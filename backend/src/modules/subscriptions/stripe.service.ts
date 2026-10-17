import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { env } from '../../common/config/env.config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe | null = null;

  constructor(private readonly prisma: PrismaService) {
    this.initStripe();
  }

  private initStripe(): Stripe | null {
    if (this.stripe) return this.stripe;
    const secretKey = process.env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY;
    if (secretKey && secretKey.startsWith('sk_')) {
      this.stripe = new Stripe(secretKey);
      this.logger.log('✅ Stripe SDK successfully initialized.');
      return this.stripe;
    } else {
      this.logger.warn(
        '⚠️ STRIPE_SECRET_KEY is not configured or empty. Operating in test/mock mode.'
      );
      return null;
    }
  }

  getStripe(): Stripe | null {
    return this.initStripe();
  }

  isConfigured(): boolean {
    return this.initStripe() !== null;
  }

  /**
   * Automatic Stripe Product & Price Synchronization (Option 1)
   * Automatically creates or updates Stripe Product, Monthly Price ID, and Yearly Price ID.
   */
  async syncPlanWithStripe(planId: string): Promise<{
    stripeMonthlyPriceId: string | null;
    stripeYearlyPriceId: string | null;
  }> {
    const plan = await this.prisma.planTier.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return { stripeMonthlyPriceId: null, stripeYearlyPriceId: null };
    }

    const priceMonthly = Number(plan.priceMonthly);
    const priceYearly = Number(plan.priceYearly);
    const currency = (plan.currency || 'USD').toLowerCase();

    // Free tiers do not need Stripe prices
    if (priceMonthly === 0 && priceYearly === 0) {
      return { stripeMonthlyPriceId: null, stripeYearlyPriceId: null };
    }

    const stripeClient = this.getStripe();
    if (!stripeClient) {
      this.logger.log(
        `Stripe not configured. Skipping remote sync for plan "${plan.name}".`
      );
      return {
        stripeMonthlyPriceId: plan.stripeMonthlyPriceId,
        stripeYearlyPriceId: plan.stripeYearlyPriceId,
      };
    }

    try {
      // 1. Create or find Stripe Product by metadata
      let product: Stripe.Product;
      const existingProducts = await stripeClient.products.search({
        query: `metadata['planId']:'${plan.id}'`,
      });

      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0];
        // Keep name and description up to date
        if (product.name !== plan.name || product.description !== plan.description) {
          product = await stripeClient.products.update(product.id, {
            name: plan.name,
            description: plan.description || undefined,
          });
        }
      } else {
        product = await stripeClient.products.create({
          name: plan.name,
          description: plan.description || undefined,
          metadata: {
            planId: plan.id,
            slug: plan.slug,
            targetRole: plan.targetRole,
          },
        });
        this.logger.log(`Created new Stripe Product "${product.name}" (${product.id})`);
      }

      // 2. Synchronize Monthly Price
      let monthlyPriceId = plan.stripeMonthlyPriceId;
      if (priceMonthly > 0) {
        let needsNewMonthlyPrice = true;

        if (monthlyPriceId) {
          try {
            const existingPrice = await stripeClient.prices.retrieve(monthlyPriceId);
            if (
              existingPrice.active &&
              existingPrice.unit_amount === Math.round(priceMonthly * 100) &&
              existingPrice.currency === currency
            ) {
              needsNewMonthlyPrice = false;
            }
          } catch {
            needsNewMonthlyPrice = true;
          }
        }

        if (needsNewMonthlyPrice) {
          const newPrice = await stripeClient.prices.create({
            product: product.id,
            unit_amount: Math.round(priceMonthly * 100),
            currency,
            recurring: { interval: 'month' },
            metadata: {
              planId: plan.id,
              billingInterval: 'MONTHLY',
            },
          });
          monthlyPriceId = newPrice.id;
          this.logger.log(
            `Generated Stripe Monthly Price: ${monthlyPriceId} ($${priceMonthly}/mo) for "${plan.name}"`
          );
        }
      }

      // 3. Synchronize Yearly Price
      let yearlyPriceId = plan.stripeYearlyPriceId;
      if (priceYearly > 0) {
        let needsNewYearlyPrice = true;

        if (yearlyPriceId) {
          try {
            const existingPrice = await stripeClient.prices.retrieve(yearlyPriceId);
            if (
              existingPrice.active &&
              existingPrice.unit_amount === Math.round(priceYearly * 100) &&
              existingPrice.currency === currency
            ) {
              needsNewYearlyPrice = false;
            }
          } catch {
            needsNewYearlyPrice = true;
          }
        }

        if (needsNewYearlyPrice) {
          const newPrice = await stripeClient.prices.create({
            product: product.id,
            unit_amount: Math.round(priceYearly * 100),
            currency,
            recurring: { interval: 'year' },
            metadata: {
              planId: plan.id,
              billingInterval: 'YEARLY',
            },
          });
          yearlyPriceId = newPrice.id;
          this.logger.log(
            `Generated Stripe Yearly Price: ${yearlyPriceId} ($${priceYearly}/yr) for "${plan.name}"`
          );
        }
      }

      // 4. Update PlanTier in database
      await this.prisma.planTier.update({
        where: { id: plan.id },
        data: {
          stripeMonthlyPriceId: monthlyPriceId,
          stripeYearlyPriceId: yearlyPriceId,
        },
      });

      return {
        stripeMonthlyPriceId: monthlyPriceId,
        stripeYearlyPriceId: yearlyPriceId,
      };
    } catch (err: any) {
      this.logger.error(`Failed to synchronize plan "${plan.name}" with Stripe: ${err.message}`);
      return {
        stripeMonthlyPriceId: plan.stripeMonthlyPriceId,
        stripeYearlyPriceId: plan.stripeYearlyPriceId,
      };
    }
  }

  /**
   * Create a Stripe Checkout Session for Subscription
   */
  async createCheckoutSession(params: {
    userId: string;
    userEmail: string;
    userName?: string;
    planId: string;
    billingInterval: 'MONTHLY' | 'YEARLY';
  }): Promise<{
    url: string | null;
    sessionId?: string;
    isFree?: boolean;
    isMock?: boolean;
  }> {
    const { userId, userEmail, planId, billingInterval } = params;

    const plan = await this.prisma.planTier.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new Error('Subscription plan not found');
    }

    const price =
      billingInterval === 'YEARLY'
        ? Number(plan.priceYearly)
        : Number(plan.priceMonthly);

    // Free plan: no checkout session needed
    if (price === 0) {
      return { url: null, isFree: true };
    }

    const stripeClient = this.getStripe();
    if (!stripeClient) {
      this.logger.error(
        `STRIPE_SECRET_KEY is missing or invalid in backend/.env. Cannot create checkout session for paid plan "${plan.name}".`
      );
      throw new Error(
        'Stripe payment gateway is not configured. Please set STRIPE_SECRET_KEY in backend/.env to enable Stripe payments.'
      );
    }

    // Ensure price ID exists
    let targetPriceId =
      billingInterval === 'YEARLY'
        ? plan.stripeYearlyPriceId
        : plan.stripeMonthlyPriceId;

    if (!targetPriceId) {
      const syncResult = await this.syncPlanWithStripe(plan.id);
      targetPriceId =
        billingInterval === 'YEARLY'
          ? syncResult.stripeYearlyPriceId
          : syncResult.stripeMonthlyPriceId;
    }

    try {
      if (!targetPriceId) {
        // Dynamic fallback price_data if no pre-generated price ID
        const session = await stripeClient.checkout.sessions.create({
          mode: 'subscription',
          customer_email: userEmail,
          line_items: [
            {
              price_data: {
                currency: (plan.currency || 'USD').toLowerCase(),
                product_data: {
                  name: plan.name,
                  description: plan.description || undefined,
                },
                unit_amount: Math.round(price * 100),
                recurring: {
                  interval: billingInterval === 'YEARLY' ? 'year' : 'month',
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            userId,
            planId: plan.id,
            billingInterval,
          },
          success_url: `${env.FRONTEND_URL}/subscription?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.FRONTEND_URL}/subscription?checkout=cancelled`,
        });

        return { url: session.url, sessionId: session.id };
      }

      const session = await stripeClient.checkout.sessions.create({
        mode: 'subscription',
        customer_email: userEmail,
        line_items: [
          {
            price: targetPriceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId,
          planId: plan.id,
          billingInterval,
        },
        success_url: `${env.FRONTEND_URL}/subscription?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.FRONTEND_URL}/subscription?checkout=cancelled`,
      });

      return { url: session.url, sessionId: session.id };
    } catch (err: any) {
      this.logger.error(`Stripe checkout error for plan "${plan.name}": ${err.message}`, err.stack);
      throw new Error(`Stripe error: ${err.message}`);
    }
  }

  /**
   * Handle incoming Stripe webhook payload
   */
  async constructEvent(payload: string | Buffer, signature: string): Promise<Stripe.Event> {
    if (!this.stripe || !env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Stripe or STRIPE_WEBHOOK_SECRET is not configured.');
    }
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  }
}
