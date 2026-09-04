## Context

The system has an established NestJS backend with Prisma ORM, PostgreSQL connection pooling, and cookie-first JWT authentication with RBAC guards (`RolesGuard`). The frontend is a Next.js 15 application with Tailwind CSS v4, dynamic role-based dashboards, and static mock directory pages. See `proposal.md` for the motivation.

## Goals / Non-Goals

**Goals:**
- Define Prisma schema models for `Business`, `CampaignMilestone`, and `PitchDeck` with relations to `User` and `Category`.
- Implement a modular `CampaignsModule` in NestJS with full validation, role-based authorization, and filtering capabilities.
- Build entrepreneur campaign management API (create, edit, milestone updates, submit for review).
- Build public and investor discovery API with pagination, multi-facet filtering (category, stage, IRR, risk), and text search.
- Connect the frontend `/funds` directory and create dynamic `/funds/[slug]` detail views.
- Provide the Entrepreneur Campaign Builder in the dashboard.

**Non-Goals:**
- Actual payment gateway transactions/escrow pledges (deferred to `subscriptions-and-payments` track).
- Side-by-side dynamic comparison comparison matrix (deferred to `comparison-engine-and-watchlist` track).
- Real-time investor-to-founder WebSocket chat (deferred to `realtime-chat-and-data-room` track).

## Decisions

### 1. Entity Modeling and Status State Machine
- **Choice**: Introduce `Business` (mapped to `businesses` table) with `CampaignStatus` enum (`DRAFT`, `UNDER_REVIEW`, `ACTIVE`, `REJECTED`, `FUNDED`, `CLOSED`).
- **Rationale**: Keeps campaign records clearly separated while supporting strict status transitions. Drafts can be edited freely; once submitted to `UNDER_REVIEW`, updates are restricted until approved or rejected by an admin.
- **Alternatives considered**: Merging campaigns into user profile tables. Rejected due to 1-to-many potential for serial entrepreneurs and clean normalization.

### 2. Financial Precision with Prisma Decimal
- **Choice**: Use Prisma `@db.Decimal(14, 2)` for currency amounts (`targetAmount`, `raisedAmount`, `minInvestment`) and `@db.Decimal(5, 2)` for IRR percentages.
- **Rationale**: Prevents floating point inaccuracies in monetary and return calculations.

### 3. Discovery Query Strategy & Multi-Facet Filtering
- **Choice**: Implement parameterized Prisma `where` queries with dynamic clauses for `categoryId`, `stage`, `riskLevel`, `projectedIrr: { gte: minIrr }`, and `search` matching using `contains` with `mode: "insensitive"`.
- **Rationale**: Provides fast, indexed relational queries without requiring external search clusters for MVP while retaining full compatibility with PostgreSQL.

### 4. Client State with TanStack Query
- **Choice**: Encapsulate API communication in typed API helpers (`frontend/lib/campaigns/campaigns-api.ts`) and custom React Query hooks (`useCampaigns`, `useCampaign`, `useCreateCampaign`).
- **Rationale**: Provides automatic background caching, debounced query invalidation, and seamless loading/error UI states across public and dashboard routes.

## Risks / Trade-offs

- **[Risk: Title & Slug Collisions]** -> **Mitigation**: Implement automated unique slug generation that lowercases the title, removes special characters, and appends a short deterministic hash or random 4-character suffix if collisions occur.
- **[Risk: Stale Campaign Progress Metrics]** -> **Mitigation**: Calculate funding percentages dynamically on read or maintain atomic incremental update transactions when commitments are recorded.
- **[Risk: Unauthorized Edit of Published Campaigns]** -> **Mitigation**: Enforce `RolesGuard` and ownership verification checks in `CampaignsService` to ensure entrepreneurs can only edit their own campaigns in `DRAFT` status.

## Migration Plan

1. Update `backend/prisma/schema.prisma` with new models and relations.
2. Generate and apply migration via `npx prisma migrate dev --name add_campaign_entities`.
3. Update `backend/prisma/seed.js` with sample startup campaigns across diverse industries.
4. Deploy backend `CampaignsModule` and verify unit/integration tests.
5. Deploy frontend API clients and connected pages.
