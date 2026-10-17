import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole, PlanBillingInterval } from '@prisma/client';
import { CreatePlanTierDto, UpdatePlanTierDto } from './dto/plan-tier.dto';
import { StripeService } from './stripe.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  // 1. PUBLIC: Get all plans for public pricing page
  async getPublicPlans(role?: UserRole) {
    const whereClause: any = {};
    if (role) {
      whereClause.targetRole = role;
    }

    const plans = await this.prisma.planTier.findMany({
      where: whereClause,
      orderBy: { sortOrder: 'asc' },
      include: {
        features: {
          include: {
            feature: true,
          },
        },
      },
    });

    return plans.map((plan) => this.formatPlanResponse(plan));
  }

  // 2. ADMIN: List all platform catalog features
  async getPlatformFeatures(role?: UserRole) {
    const where: any = {};
    if (role) {
      where.targetRole = role;
    }
    return this.prisma.platformFeature.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  }

  // 3. ADMIN: List all plan tiers (both active and inactive)
  async getAdminPlans(role?: UserRole) {
    const where: any = {};
    if (role) {
      where.targetRole = role;
    }

    const plans = await this.prisma.planTier.findMany({
      where,
      orderBy: [{ targetRole: 'asc' }, { sortOrder: 'asc' }],
      include: {
        features: {
          include: {
            feature: true,
          },
        },
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    return plans.map((plan) => ({
      ...this.formatPlanResponse(plan),
      subscribersCount: plan._count.subscriptions,
    }));
  }

  // 4. ADMIN: Get single plan by ID
  async getPlanById(id: string) {
    const plan = await this.prisma.planTier.findUnique({
      where: { id },
      include: {
        features: {
          include: {
            feature: true,
          },
        },
      },
    });
    if (!plan) {
      throw new NotFoundException(`Plan tier with ID ${id} not found.`);
    }
    return this.formatPlanResponse(plan);
  }

  // 5. ADMIN: Create a new plan tier with feature mappings
  async createPlan(dto: CreatePlanTierDto) {
    const existing = await this.prisma.planTier.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`Plan tier with slug "${dto.slug}" already exists.`);
    }

    const { features, ...planData } = dto;

    const createdPlanWithFeatures = await this.prisma.$transaction(async (tx) => {
      const createdPlan = await tx.planTier.create({
        data: {
          ...planData,
          priceMonthly: dto.priceMonthly,
          priceYearly: dto.priceYearly,
        },
      });

      if (features && features.length > 0) {
        await tx.planFeature.createMany({
          data: features.map((f) => ({
            planId: createdPlan.id,
            featureId: f.featureId,
            isEnabled: f.isEnabled,
            limitValue: f.limitValue !== undefined ? f.limitValue : null,
          })),
        });
      }

      return tx.planTier.findUnique({
        where: { id: createdPlan.id },
        include: {
          features: {
            include: { feature: true },
          },
        },
      });
    });

    if (!createdPlanWithFeatures) {
      throw new BadRequestException('Failed to create plan tier.');
    }

    // Automatic Stripe Synchronization (Option 1)
    await this.stripeService.syncPlanWithStripe(createdPlanWithFeatures.id);
    return this.getPlanById(createdPlanWithFeatures.id);
  }

  // 6. ADMIN: Update an existing plan tier and its features
  async updatePlan(id: string, dto: UpdatePlanTierDto) {
    const existing = await this.prisma.planTier.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Plan tier with ID ${id} not found.`);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const slugConflict = await this.prisma.planTier.findUnique({
        where: { slug: dto.slug },
      });
      if (slugConflict) {
        throw new ConflictException(`Plan tier with slug "${dto.slug}" already exists.`);
      }
    }

    const { features, ...planData } = dto;

    await this.prisma.$transaction(async (tx) => {
      await tx.planTier.update({
        where: { id },
        data: planData,
      });

      if (features) {
        // Replace or upsert features for this plan
        await tx.planFeature.deleteMany({
          where: { planId: id },
        });

        if (features.length > 0) {
          await tx.planFeature.createMany({
            data: features.map((f) => ({
              planId: id,
              featureId: f.featureId,
              isEnabled: f.isEnabled,
              limitValue: f.limitValue !== undefined ? f.limitValue : null,
            })),
          });
        }
      }

      return tx.planTier.findUnique({
        where: { id },
        include: {
          features: {
            include: { feature: true },
          },
        },
      });
    });

    // Automatic Stripe Synchronization (Option 1)
    await this.stripeService.syncPlanWithStripe(id);
    return this.getPlanById(id);
  }

  // 7. ADMIN: Delete a plan tier
  async deletePlan(id: string) {
    const existing = await this.prisma.planTier.findUnique({
      where: { id },
      include: {
        _count: { select: { subscriptions: true } },
      },
    });
    if (!existing) {
      throw new NotFoundException(`Plan tier with ID ${id} not found.`);
    }

    if (existing._count.subscriptions > 0) {
      // Soft-deactivate if active subscribers exist
      return this.prisma.planTier.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return this.prisma.planTier.delete({
      where: { id },
    });
  }

  // 8. SUBSCRIPTION ACTIVATION WITH IMMUTABLE SNAPSHOTTING & PAYMENT AUDITING
  async subscribeUserToPlan(
    userId: string,
    planId: string,
    billingInterval: PlanBillingInterval = PlanBillingInterval.MONTHLY,
    paymentMeta?: {
      provider?: string;
      transactionId?: string;
      receiptUrl?: string;
      amount?: number;
      currency?: string;
    },
  ) {
    const plan = await this.prisma.planTier.findUnique({
      where: { id: planId },
      include: {
        features: {
          include: { feature: true },
        },
      },
    });

    if (!plan || !plan.isActive) {
      throw new BadRequestException('The selected plan tier is not available.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user && user.role !== 'ADMIN' && user.role !== 'SUB_ADMIN' && user.role !== plan.targetRole) {
      throw new BadRequestException(
        `Your account role (${user.role}) cannot subscribe to a ${plan.targetRole} plan.`
      );
    }

    // Generate snapshot dictionary: { [featureCode]: { isEnabled, limitValue, name } }
    const snapshotDict: Record<string, any> = {};
    for (const pf of plan.features) {
      snapshotDict[pf.feature.code] = {
        name: pf.feature.name,
        code: pf.feature.code,
        featureType: pf.feature.featureType,
        isEnabled: pf.isEnabled,
        limitValue: pf.limitValue,
        unit: pf.feature.unit,
      };
    }

    const now = new Date();
    const periodEnd = new Date(now);
    if (billingInterval === PlanBillingInterval.YEARLY) {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    // Upsert user subscription
    const existingSub = await this.prisma.userSubscription.findFirst({
      where: { userId },
    });

    let subscription;
    if (existingSub) {
      subscription = await this.prisma.userSubscription.update({
        where: { id: existingSub.id },
        data: {
          planId: plan.id,
          billingInterval,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          featureSnapshot: snapshotDict,
          cancelledAt: null,
          updatedAt: now,
        },
      });
    } else {
      subscription = await this.prisma.userSubscription.create({
        data: {
          userId,
          planId: plan.id,
          billingInterval,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          featureSnapshot: snapshotDict,
        },
      });
    }

    // Record SubscriptionPayment audit row
    const chargeAmount =
      billingInterval === PlanBillingInterval.YEARLY
        ? Number(plan.priceYearly)
        : Number(plan.priceMonthly);

    const paidAmount = paymentMeta?.amount !== undefined ? paymentMeta.amount : chargeAmount;

    await this.prisma.subscriptionPayment.create({
      data: {
        userId,
        planId: plan.id,
        subscriptionId: subscription.id,
        amount: paidAmount,
        currency: paymentMeta?.currency || plan.currency,
        billingInterval,
        status: 'PAID',
        paymentProvider: paymentMeta?.provider || 'STRIPE',
        transactionId: paymentMeta?.transactionId || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        receiptUrl: paymentMeta?.receiptUrl || null,
        metadata: {
          planName: plan.name,
          targetRole: plan.targetRole,
        },
      },
    });

    return subscription;
  }

  // 8b. CANCEL SUBSCRIPTION (User action)
  async cancelUserSubscription(userId: string) {
    const sub = await this.prisma.userSubscription.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!sub) {
      throw new NotFoundException('No active subscription found to cancel.');
    }

    const updated = await this.prisma.userSubscription.update({
      where: { id: sub.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    return {
      message: 'Subscription cancelled successfully.',
      subscription: updated,
    };
  }

  // 8c. GET USER PAYMENT HISTORY
  async getUserPaymentHistory(userId: string) {
    const payments = await this.prisma.subscriptionPayment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            slug: true,
            badge: true,
            targetRole: true,
          },
        },
      },
    });

    return payments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      currency: p.currency,
      billingInterval: p.billingInterval,
      status: p.status,
      paymentProvider: p.paymentProvider,
      transactionId: p.transactionId,
      receiptUrl: p.receiptUrl,
      createdAt: p.createdAt,
      plan: p.plan,
    }));
  }

  // 8d. ADMIN: GET ALL SUBSCRIBERS
  async getAdminSubscribers(role?: UserRole) {
    const where: any = {};
    if (role) {
      where.plan = { targetRole: role };
    }

    const subscriptions = await this.prisma.userSubscription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            phone: true,
            image: true,
            role: true,
            accountStatus: true,
            createdAt: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            slug: true,
            badge: true,
            targetRole: true,
            priceMonthly: true,
            priceYearly: true,
            currency: true,
          },
        },
      },
    });

    return subscriptions.map((sub) => ({
      id: sub.id,
      userId: sub.userId,
      user: sub.user,
      planId: sub.planId,
      plan: {
        ...sub.plan,
        priceMonthly: Number(sub.plan.priceMonthly),
        priceYearly: Number(sub.plan.priceYearly),
      },
      billingInterval: sub.billingInterval,
      status: sub.status,
      currentPeriodStart: sub.currentPeriodStart,
      currentPeriodEnd: sub.currentPeriodEnd,
      cancelledAt: sub.cancelledAt,
      featureSnapshot: sub.featureSnapshot,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
    }));
  }

  // 8e. ADMIN: GET ALL SUBSCRIPTION PAYMENTS
  async getAdminPayments(limit = 100) {
    const payments = await this.prisma.subscriptionPayment.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            slug: true,
            targetRole: true,
          },
        },
      },
    });

    return payments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      currency: p.currency,
      billingInterval: p.billingInterval,
      status: p.status,
      paymentProvider: p.paymentProvider,
      transactionId: p.transactionId,
      receiptUrl: p.receiptUrl,
      createdAt: p.createdAt,
      user: p.user,
      plan: p.plan,
    }));
  }

  // 8f. ADMIN: REVOKE / CANCEL SUBSCRIBER
  async adminCancelSubscription(subscriptionId: string) {
    const sub = await this.prisma.userSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!sub) {
      throw new NotFoundException(`Subscription with ID ${subscriptionId} not found.`);
    }

    return this.prisma.userSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });
  }

  // 9. CHECK USER ENTITLEMENT & REMAINING LIMIT
  async checkUserEntitlement(userId: string, featureCode: string, userRole?: UserRole) {
    // 1. Look for active subscription
    const sub = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        currentPeriodEnd: { gte: new Date() },
      },
      include: { plan: true },
    });

    if (sub && sub.featureSnapshot) {
      const snapshot = sub.featureSnapshot as Record<string, any>;
      const feat = snapshot[featureCode];
      if (feat) {
        return {
          hasAccess: Boolean(feat.isEnabled),
          limitValue: feat.limitValue !== undefined ? feat.limitValue : null,
          isUnlimited: feat.limitValue === -1,
          planName: sub.plan.name,
        };
      }
    }

    // 2. Fallback to default free tier for user's role if no active custom sub
    if (userRole) {
      const freePlan = await this.prisma.planTier.findFirst({
        where: { targetRole: userRole, priceMonthly: 0, isActive: true },
        include: {
          features: {
            where: { feature: { code: featureCode } },
            include: { feature: true },
          },
        },
      });

      if (freePlan && freePlan.features.length > 0) {
        const pf = freePlan.features[0];
        return {
          hasAccess: pf.isEnabled,
          limitValue: pf.limitValue,
          isUnlimited: pf.limitValue === -1,
          planName: freePlan.name,
        };
      }
    }

    // Default permissive for unspecified or unseeded
    return {
      hasAccess: true,
      limitValue: null,
      isUnlimited: true,
      planName: 'Default Standard',
    };
  }

  // 10. GET USER ACTIVE SUBSCRIPTION
  async getUserActiveSubscription(userId: string) {
    const sub = await this.prisma.userSubscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!sub) {
      return null;
    }

    return {
      id: sub.id,
      planId: sub.planId,
      planName: sub.plan.name,
      planSlug: sub.plan.slug,
      targetRole: sub.plan.targetRole,
      billingInterval: sub.billingInterval,
      priceMonthly: Number(sub.plan.priceMonthly),
      priceYearly: Number(sub.plan.priceYearly),
      status: sub.status,
      currentPeriodStart: sub.currentPeriodStart,
      currentPeriodEnd: sub.currentPeriodEnd,
      featureSnapshot: sub.featureSnapshot,
    };
  }

  // 11. CHECKOUT SESSION (STRIPE REDIRECT / DIRECT FALLBACK)
  async createCheckoutSession(
    userId: string,
    planId: string,
    billingInterval: PlanBillingInterval = PlanBillingInterval.MONTHLY,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const plan = await this.prisma.planTier.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found.');
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUB_ADMIN' && user.role !== plan.targetRole) {
      throw new BadRequestException(
        `Your account role (${user.role}) cannot subscribe to a ${plan.targetRole} plan.`
      );
    }

    const sessionResult = await this.stripeService.createCheckoutSession({
      userId,
      userEmail: user.email,
      userName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      planId,
      billingInterval: billingInterval === PlanBillingInterval.YEARLY ? 'YEARLY' : 'MONTHLY',
    });

    // Only free plans (price === 0) activate immediately without payment redirect
    if (sessionResult.isFree) {
      const subscription = await this.subscribeUserToPlan(
        userId,
        planId,
        billingInterval,
        {
          provider: 'FREE_TIER',
          transactionId: `free_${Date.now()}`,
          amount: 0,
        },
      );
      return {
        url: null,
        isFree: true,
        subscription,
      };
    }

    if (!sessionResult.url) {
      throw new BadRequestException(
        'Unable to initialize Stripe checkout. Please ensure STRIPE_SECRET_KEY is configured in backend/.env.'
      );
    }

    return {
      url: sessionResult.url,
      sessionId: sessionResult.sessionId,
      isFree: false,
    };
  }

  // 12. STRIPE WEBHOOK HANDLER
  async handleStripeWebhook(signature: string, rawBody: Buffer | string) {
    const event = await this.stripeService.constructEvent(rawBody, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const metadata = session.metadata || {};
      const { userId, planId, billingInterval } = metadata;

      if (userId && planId) {
        const amountTotal = session.amount_total ? session.amount_total / 100 : undefined;
        const currency = session.currency ? session.currency.toUpperCase() : 'USD';
        const transactionId = session.payment_intent || session.id;

        await this.subscribeUserToPlan(
          userId,
          planId,
          billingInterval === 'YEARLY'
            ? PlanBillingInterval.YEARLY
            : PlanBillingInterval.MONTHLY,
          {
            provider: 'STRIPE',
            transactionId,
            amount: amountTotal,
            currency,
          },
        );
      }
    }

    return { received: true };
  }

  // Helper: Format Plan Output
  private formatPlanResponse(plan: any) {
    return {
      id: plan.id,
      slug: plan.slug,
      name: plan.name,
      badge: plan.badge,
      description: plan.description,
      targetRole: plan.targetRole,
      priceMonthly: Number(plan.priceMonthly),
      priceYearly: Number(plan.priceYearly),
      currency: plan.currency,
      stripeMonthlyPriceId: plan.stripeMonthlyPriceId,
      stripeYearlyPriceId: plan.stripeYearlyPriceId,
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      sortOrder: plan.sortOrder,
      features: (plan.features || []).map((pf: any) => ({
        id: pf.id,
        featureId: pf.featureId,
        code: pf.feature?.code,
        name: pf.feature?.name,
        description: pf.feature?.description,
        featureType: pf.feature?.featureType,
        unit: pf.feature?.unit,
        isEnabled: pf.isEnabled,
        limitValue: pf.limitValue,
      })),
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
