## 1. Database Schema & Seed Data

- [x] 1.1 Add `Business`, `CampaignMilestone`, `PitchDeck` models and `CampaignStatus`, `RiskLevel` enums to `backend/prisma/schema.prisma` and verify with `npx prisma validate`
- [x] 1.2 Generate and run Prisma migration for campaign entities and verify migration completion
- [x] 1.3 Update `backend/prisma/seed.js` with realistic seed campaigns and verify `npm run db:seed` executes successfully

## 2. Backend Campaigns Module

- [x] 2.1 Implement DTOs for campaign creation, updating, milestones, and query filtering in `backend/src/modules/campaigns/dto`
- [x] 2.2 Implement `CampaignsService` with entrepreneur CRUD, milestone handling, and status transitions (`DRAFT` -> `UNDER_REVIEW` -> `ACTIVE`)
- [x] 2.3 Implement `CampaignsController` with public discovery endpoints (`GET /campaigns`, `GET /campaigns/:slug`) and protected entrepreneur endpoints (`POST /campaigns`, `PATCH /campaigns/:id`)
- [x] 2.4 Implement Admin campaign moderation endpoint (`PATCH /admin/campaigns/:id/status`) with `Roles(UserRole.ADMIN)` guard
- [x] 2.5 Register `CampaignsModule` in `backend/src/app.module.ts` and verify compilation with `npm run build`

## 3. Frontend API Client & Dynamic UI

- [x] 3.1 Create TypeScript types, API client, and TanStack Query hooks in `frontend/lib/campaigns/`
- [x] 3.2 Update `frontend/app/funds/page.tsx` to fetch live campaign data with server pagination, category filters, and debounced search
- [x] 3.3 Create dynamic campaign detail page at `frontend/app/funds/[slug]/page.tsx` with pitch overview, financial stats, milestones, and entrepreneur info
- [x] 3.4 Build the Campaign Creator Wizard in the Entrepreneur Dashboard (`/dashboard/entrepreneur/fundraising`) for authoring new pitches and milestones

## 4. Testing & End-to-End Verification

- [x] 4.1 Add unit tests in `backend/src/modules/campaigns/campaigns.service.spec.ts` and verify with `npm run test`
- [x] 4.2 Verify complete lifecycle: register entrepreneur -> create draft campaign -> submit for review -> admin approves -> verified campaign renders on public `/funds` directory
