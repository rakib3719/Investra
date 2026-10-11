## Context

Investra uses NestJS + Prisma (PostgreSQL) for backend services and Next.js (App Router, Tailwind CSS, Lucide Icons) for frontend. Currently, pricing plans in `frontend/app/subscription/page.tsx` are hardcoded static JavaScript objects. There are no relational tables for subscription tiers, entitlements, or limits.

## Goals / Non-Goals

**Goals:**
- Provide a robust PostgreSQL schema supporting dynamic tiers, role-based platform features, numeric limits, and boolean flags.
- Establish an immutable snapshotting mechanism (`UserSubscription.featureSnapshot`) to guarantee grandfathering when admins update plan specifications.
- Provide administrative APIs and an intuitive `/dashboard/admin/subscriptions` UI for creating, editing, and toggling tiers.
- Refactor the public pricing page (`/subscription`) to fetch live plan definitions from the backend.
- Seed standard platform features for all three platform roles (`ENTREPRENEUR`, `INVESTOR`, `CONSULTANT`).

**Non-Goals:**
- Actual payment gateway webhooks or direct credit card processing via Stripe/SSLCommerz (fields like `stripeMonthlyPriceId` and `stripeYearlyPriceId` are provisioned, but checkout orchestration is deferred).
- Immediate user downgrade/proration recalculation logic (scheduled for the billing orchestration phase).

## Decisions

### Decision 1: Relational Plan Tiers with JSONB Snapshotting for Subscriptions
- **Choice**: Separate `PlatformFeature`, `PlanTier`, and `PlanFeature` tables for admin configuration, but serialize an immutable JSON object `featureSnapshot` on `UserSubscription`.
- **Rationale**: If plans are purely joined relationally at runtime, modifying an existing plan immediately changes limits for all existing active subscribers (breaking the grandfathering guarantee). Snapshotting features at activation time decouples current subscribers from subsequent tier revisions while keeping the catalog relational and cleanly administrable.
- **Alternatives Considered**: 
  - *Versioned Plan Tiers (`plan_tier_v1`, `v2`)*: Adds unnecessary relational clutter and query complexity for admins when adjusting minor copy or price.
  - *Full EAV (Entity-Attribute-Value) for subscriber entitlements*: Heavy query and join overhead for basic limit checks.

### Decision 2: Feature Types (NUMERIC_LIMIT vs BOOLEAN)
- **Choice**: Enum `FeatureType` with `NUMERIC_LIMIT` and `BOOLEAN`. Numeric limits support `-1` to denote unlimited (e.g., unlimited bookmarks or pitches) and positive integers for finite caps.
- **Rationale**: Accurately reflects Investra's domain needs (e.g., 50 bookmarks vs unlimited; 1 active campaign vs 3 campaigns; boolean access to side-by-side deal comparison).

### Decision 3: Role-Scoping for Platform Features & Tiers
- **Choice**: Direct enum binding to `UserRole` (`ENTREPRENEUR`, `INVESTOR`, `CONSULTANT`).
- **Rationale**: An investor's tier should not configure entrepreneur features (e.g. pitch count), and vice-versa. Scoping by role ensures admins see only relevant features when configuring a tier.

## Risks / Trade-offs

- **[Risk] Feature key renaming in future releases** → Use rigid, namespaced feature codes (`campaign_post_limit`, `deal_bookmark_limit`) seeded once. Code changes reference these immutable string identifiers.
- **[Risk] Complex nested UI in Admin Modal** → Implement a streamlined modal organized by tabs: General Details, Pricing (Monthly/Yearly), and Features with toggle switches & numeric limit steppers.
- **[Risk] Database sync during local development** → Provide a repeatable Prisma seed script for all standard features so local environments always have the full catalog ready.
