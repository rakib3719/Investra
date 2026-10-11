import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole, PlanBillingInterval } from '@prisma/client';
import { CreatePlanTierDto, UpdatePlanTierDto } from './dto/plan-tier.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. PUBLIC: Get all active plans for public pricing page
  async getPublicPlans(role?: UserRole) {
    const whereClause: any = { isActive: true };
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

    return this.prisma.$transaction(async (tx) => {
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

    return this.prisma.$transaction(async (tx) => {
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

  // 8. SUBSCRIPTION ACTIVATION WITH IMMUTABLE SNAPSHOTTING
  async subscribeUserToPlan(
    userId: string,
    planId: string,
    billingInterval: PlanBillingInterval = PlanBillingInterval.MONTHLY,
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

    if (existingSub) {
      return this.prisma.userSubscription.update({
        where: { id: existingSub.id },
        data: {
          planId: plan.id,
          billingInterval,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          featureSnapshot: snapshotDict,
          updatedAt: now,
        },
      });
    }

    return this.prisma.userSubscription.create({
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
