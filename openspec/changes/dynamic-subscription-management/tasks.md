## 1. Database Schema & Seed Data

- [x] 1.1 Add `PlatformFeature`, `PlanTier`, `PlanFeature`, and `UserSubscription` models to `backend/prisma/schema.prisma` and verify schema validation via `npx prisma validate`.
- [x] 1.2 Create database migration or push schema to PostgreSQL and verify client generation via `npx prisma generate`.
- [x] 1.3 Implement seeder in `backend/prisma/seed.js` for platform catalog features across `ENTREPRENEUR`, `INVESTOR`, and `CONSULTANT` and verify via node seed execution.

## 2. Backend Subscription & Admin API Module

- [x] 2.1 Scaffold `SubscriptionsModule` with controller, service, and DTOs in `backend/src/modules/subscriptions/` and register in `backend/src/app.module.ts`.
- [x] 2.2 Implement public endpoint `GET /api/v1/subscriptions/plans` with role and billing filters, and verify with curl.
- [x] 2.3 Implement admin endpoints under `/api/v1/admin/subscriptions/plans` (GET, POST, PATCH, DELETE) and `/api/v1/admin/subscriptions/features` (GET) with JWT and Admin guard verification.
- [x] 2.4 Implement snapshotting logic in subscription creation service ensuring `featureSnapshot` saves exact current feature limits.

## 3. Frontend Admin Workspace (`/dashboard/admin/subscriptions`)

- [x] 3.1 Register `subscriptions` section in `frontend/components/dashboard/admin/navigation.ts` and sidebar navigation.
- [x] 3.2 Build API client and React Query hooks for fetching features and managing plans in `frontend/lib/admin/admin-subscriptions-api.ts`.
- [x] 3.3 Create `AdminSubscriptionsPage` component featuring role tabs (`Entrepreneur`, `Investor`, `Consultant`) and plan tier overview cards.
- [x] 3.4 Create `PlanEditorModal` supporting name, slug, badge, pricing, and dynamic feature list with toggle switches and limit inputs.

## 4. Frontend Public Pricing Integration & Verification

- [x] 4.1 Update `frontend/app/subscription/page.tsx` to query live plans from `GET /api/v1/subscriptions/plans` with fallback handling while preserving UI styling.
- [x] 4.2 End-to-end verification: Create a new tier in Admin Dashboard, verify instant reflection on public `/subscription`, edit a tier limit, and confirm existing mock subscription snapshot remains intact.
