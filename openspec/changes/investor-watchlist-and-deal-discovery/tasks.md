## 1. Database & Backend Implementation

- [x] 1.1 Add `Bookmark` model to `backend/prisma/schema.prisma` with relations to `User` and `Business`, apply schema with `npx prisma db push`, and verify Prisma Client generation.
- [x] 1.2 Implement `backend/src/bookmarks/bookmarks.service.ts` providing add, remove, list, and ID array lookup operations, and verify service logic.
- [x] 1.3 Implement `backend/src/bookmarks/bookmarks.controller.ts` with endpoints (`POST /investor/bookmarks/:businessId`, `DELETE /investor/bookmarks/:businessId`, `GET /investor/bookmarks`, `GET /investor/bookmarks/ids`) protected by `JwtAuthGuard` and `RolesGuard(INVESTOR)`, and register `BookmarksModule` in `backend/src/app.module.ts`.

## 2. Frontend API & Bookmark Hooks

- [x] 2.1 Create `frontend/lib/bookmarks/bookmarks-api.ts` and `frontend/lib/bookmarks/bookmarks-hooks.ts` with `useBookmarksQuery`, `useBookmarkIdsQuery`, and `useToggleBookmarkMutation` with automatic cache invalidation.
- [x] 2.2 Update campaign types and queries to include bookmark counts and verify type safety.

## 3. Investor Opportunities & Watchlist UI

- [x] 3.1 Refactor `frontend/components/dashboard/investor/pages/OpportunitiesPage.tsx` to query live campaigns via `useCampaignsQuery()`, wire category filter tabs to database categories, and bind bookmark button toggles.
- [x] 3.2 Refactor `frontend/components/dashboard/investor/pages/WatchlistPage.tsx` to render live bookmarked campaigns via `useBookmarksQuery()`, compute watchlist telemetry, and support unbookmarking and deal review.
- [x] 3.3 Connect interactive bookmark toggle buttons in the public `/funds` directory and `/funds/[slug]` detail page.

## 4. Founder Connection & Non-Monetary Deal Flow

- [x] 4.1 Implement the "Connect with Founder" introduction modal dialog allowing accredited investors to express deal interest and request meetings without on-platform payment processing.
- [x] 4.2 Display investor bookmark count metrics on the Entrepreneur dashboard to reflect verified campaign traction.

## 5. Verification & Testing

- [x] 5.1 Run backend test suite (`npm test`) to confirm all backend services and endpoints pass cleanly.
- [x] 5.2 Run frontend production build (`npm run build`) to confirm zero compilation, routing, or TypeScript errors.
