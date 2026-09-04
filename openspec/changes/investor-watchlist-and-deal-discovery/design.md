## Context

See `proposal.md` for background and motivation. The Investra application runs a NestJS backend with Prisma ORM and a Next.js 15 App Router frontend. While startup campaigns are stored as `Business` entities in PostgreSQL and surfaced via `GET /campaigns`, the Investor Dashboard's `OpportunitiesPage.tsx` and `WatchlistPage.tsx` currently render hardcoded mock data.

In accordance with the project's Software Design Document and product principles, Investra is strictly an investment networking and deal evaluation platform. No payment gateway or escrow transfers take place on-platform. The investor workflow centers on deal discovery, evaluation, bookmarking (watchlist/archive), and direct founder outreach.

## Goals / Non-Goals

**Goals:**
- Introduce a Prisma `Bookmark` model with unique `[userId, businessId]` indexing to persist saved opportunities.
- Implement `BookmarksModule` in NestJS providing `POST /investor/bookmarks/:businessId`, `DELETE /investor/bookmarks/:businessId`, `GET /investor/bookmarks`, and `GET /investor/bookmarks/ids`.
- Create typed client hooks (`useBookmarksQuery`, `useBookmarkIdsQuery`, `useToggleBookmarkMutation`) using TanStack Query.
- Refactor `OpportunitiesPage.tsx` to render real database campaigns with active bookmark toggle buttons and dynamic category filtering.
- Refactor `WatchlistPage.tsx` to render the investor's real saved campaigns with live funding progress bars, target IRR, stage pills, and unbookmark actions.
- Provide a "Connect with Founder" modal inquiry flow on campaign cards and detail views, allowing investors to submit intro notes without financial transactions.
- Compute and display bookmark counts on campaigns as social proof for entrepreneurs.

**Non-Goals:**
- Integrating payment gateways (Stripe/SSLCommerz) for equity investment pledges.
- Live WebSocket chat engine (deferred to dedicated messaging track).

## Decisions

### 1. Database Model: Relational Bookmark Join Entity
- **Choice**: Model bookmarks with an explicit `Bookmark` table linking `User` and `Business`:
  ```prisma
  model Bookmark {
    id         String   @id @default(uuid()) @db.Uuid
    userId     String   @map("user_id") @db.Uuid
    businessId String   @map("business_id") @db.Uuid
    createdAt  DateTime @default(now()) @map("created_at") @db.Timestamp(6)

    user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    business   Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

    @@unique([userId, businessId])
    @@index([userId])
    @@index([businessId])
    @@map("bookmarks")
  }
  ```
- **Rationale**: Enforces referential integrity with cascade deletion when a user or business is removed. Prevents duplicate bookmarks at the database level and enables fast aggregation for campaign bookmark counts.
- **Alternatives considered**: Storing an array of string IDs on the `User` or `InvestorProfile` record. Rejected due to concurrent write conflicts and lack of foreign key indexing.

### 2. High-Performance Bookmark State Synchronization
- **Choice**: Provide a lightweight `GET /investor/bookmarks/ids` endpoint returning `string[]` of bookmarked business IDs alongside the full `GET /investor/bookmarks` list.
- **Rationale**: Allows any card list (`/funds`, `/dashboard/investor/opportunities`) to check bookmark status in $O(1)$ time (`bookmarkedIds.includes(campaign.id)`) without having to fetch the entire watchlist payload.
- **Alternatives considered**: Embedding an `isBookmarked` boolean into public `/campaigns` queries. Rejected because public listings are cached anonymously and should not depend on authenticated request cookies.

### 3. Non-Monetary Introduction Flow
- **Choice**: Replace mock payment or pledge buttons with a "Connect with Founder" intro action that displays a clean dialog for entering a discussion note or meeting preference.
- **Rationale**: Respects the platform's core premise as a networking hub and directly satisfies the requirement that no money changes hands on-platform.

## Risks / Trade-offs

- **[Risk: Stale bookmark cache on client]** -> **Mitigation**: Optimistically toggle bookmark UI state and invalidate `['investor', 'bookmarks']` and `['investor', 'bookmark-ids']` query caches on mutation response.
- **[Risk: Unauthorized bookmarking from non-investors]** -> **Mitigation**: Apply `@UseGuards(JwtAuthGuard, RolesGuard)` with `@Roles(UserRole.INVESTOR)` to the bookmark controller endpoints.

## Migration Plan

1. Update `backend/prisma/schema.prisma` with `Bookmark` entity and relations.
2. Push schema changes via `npx prisma db push` and regenerate Prisma client.
3. Build and test NestJS `BookmarksModule`.
4. Implement frontend API client and React Query hooks.
5. Update `OpportunitiesPage.tsx`, `WatchlistPage.tsx`, and campaign cards.
6. Verify with production build and unit tests.
