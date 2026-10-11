## Why

Investra currently relies on hardcoded subscription tiers on the frontend (`/subscription`) without persistent backend schema models, administrative plan authoring, or role-based dynamic feature limits. To empower administrators to create and customize tiers for different roles (`ENTREPRENEUR`, `INVESTOR`, `CONSULTANT`), and crucially to preserve subscriber guarantees so existing subscribers keep the features and limits they originally purchased when plans change (grandfathering/snapshotting), a comprehensive dynamic subscription system is needed.

## What Changes

- **Platform Feature Catalog & Database Models**: Introduce database models (`PlatformFeature`, `PlanTier`, `PlanFeature`, and `UserSubscription`) supporting numeric limits and boolean flags with an immutable subscriber `featureSnapshot`.
- **Predefined Feature Seeders**: Seed standard system features for all three platform roles (`campaign_post_limit`, `investor_analytics`, `deal_bookmark_limit`, `deal_comparison_matrix`, `direct_founder_chat`, `consultation_booking_limit`, etc.).
- **Admin Subscription Tier Management APIs**: Full CRUD operations for creating, updating, activating/deactivating, and sorting subscription plans and their feature allotments with role scoping (`ENTREPRENEUR`, `INVESTOR`, `CONSULTANT`).
- **Admin Subscription Management UI**: An administrative workspace view under `/dashboard/admin/subscriptions` with role filters, visual tier builder modal, price inputs (Monthly & Yearly), and feature checklist with numeric limit controls.
- **Dynamic Public Pricing & Tier Page**: Refactor `/subscription` page to dynamically fetch active plans from the backend while preserving the responsive UI design.
- **Snapshot & Entitlement Guarantee**: When users subscribe or are assigned a plan, an immutable snapshot of plan features and limits is saved directly to `UserSubscription.featureSnapshot`, ensuring future tier adjustments never disrupt existing subscriber entitlements.

## Capabilities

### New Capabilities
- `subscription-management`: Covers administrative plan tier creation, feature catalog definitions, feature limit associations, dynamic public plan retrieval, and subscriber entitlement snapshot preservation.

### Modified Capabilities
None.

## Impact

- **Database**: Adds `PlatformFeature`, `PlanTier`, `PlanFeature`, and `UserSubscription` models and migrations to PostgreSQL via Prisma.
- **Backend API**: New NestJS module `src/modules/subscriptions` with public endpoints (`GET /api/v1/subscriptions/plans`) and admin-guarded endpoints (`/api/v1/admin/subscriptions/*`).
- **Admin UI**: Adds `/dashboard/admin/subscriptions` navigation item, admin page client, plan editor modal, and React Query hooks.
- **Frontend Public UI**: Updates `/subscription/page.tsx` to query live plans dynamically by selected role and billing period.
- **Payment Gateways**: Future-proofed fields for Stripe (`stripeMonthlyPriceId`, `stripeYearlyPriceId`) and SSLCommerz identifiers without enforcing immediate checkout dependencies.
