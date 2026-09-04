## Why

According to the Investra Software Design Document, the platform serves as a centralized networking and deal-discovery ecosystem uniting Investors, Entrepreneurs, and Consultants. Crucially, the platform operates strictly as an introduction and deal evaluation network—there are no financial payment gateways or direct money escrow transactions on-platform for investment pledges.

Currently, while entrepreneurs can author and publish startup campaigns into the PostgreSQL database, the Investor Dashboard's `OpportunitiesPage.tsx` and `WatchlistPage.tsx` display static mock deals disconnected from real backend campaigns. Furthermore, there is no database persistence or API for saving/bookmarking campaigns to a personal watchlist (archiving), and no structured mechanism for investors to initiate direct connection inquiries with founders. This change connects live campaigns to the investor workspace, introduces a persistent bookmark/watchlist system, and enables direct founder-investor connection requests.

## What Changes

- **Bookmark / Watchlist Database Entity**: Add a Prisma `Bookmark` model associating `User` (investor) and `Business` (campaign) with unique constraints and timestamp indexing.
- **Bookmarks Backend Module**: Create `BookmarksModule` in NestJS with endpoints to add, remove, list, and verify bookmark statuses (`POST /investor/bookmarks/:businessId`, `DELETE /investor/bookmarks/:businessId`, `GET /investor/bookmarks`, `GET /investor/bookmarks/ids`).
- **Live Investor Opportunities Feed**: Connect `OpportunitiesPage.tsx` to `useCampaignsQuery()` to fetch real published startup campaigns with dynamic category pills, target amounts, projected IRR, and active bookmark toggles.
- **Persistent Investor Watchlist / Archive Page**: Refactor `WatchlistPage.tsx` to fetch and render the investor's bookmarked campaigns with live funding progress bars, target returns, remove-from-watchlist actions, and direct review navigation.
- **Founder Connection & Deal Inquiry Workflow**: Provide a "Connect with Founder" modal inquiry flow on campaign cards and detail views, allowing accredited investors to express direct interest and request meetings without on-platform payment processing.
- **Founder Social Proof & Telemetry**: Expose campaign bookmark counts on the Entrepreneur dashboard and public `/funds` cards to signal investor traction and interest.

## Capabilities

### New Capabilities
- `investor-discovery`: Real campaign deal flow integration into the investor opportunities dashboard with live filters and stage indicators.
- `investor-watchlist`: Persistent bookmarking and watchlist management allowing investors to save, monitor, and organize target startup opportunities.
- `founder-connection`: Direct connection requests and intro notes between accredited investors and entrepreneurs without financial transactions.

### Modified Capabilities
<!-- None: openspec/specs is currently empty and existing requirements are newly captured in this change -->

## Impact

- **Backend Architecture**:
  - `backend/prisma/schema.prisma`: Add `Bookmark` model and relation to `User` and `Business`.
  - Migration via `npx prisma db push` or `prisma migrate dev`.
  - `backend/src/bookmarks/`: New controller, service, DTOs, and module registered in `AppModule`.
- **Frontend Architecture**:
  - `frontend/lib/bookmarks/`: API client and React Query hooks (`useBookmarksQuery`, `useBookmarkIdsQuery`, `useToggleBookmarkMutation`).
  - `frontend/components/dashboard/investor/pages/OpportunitiesPage.tsx`: Hooked to real campaigns and bookmark toggles.
  - `frontend/components/dashboard/investor/pages/WatchlistPage.tsx`: Hooked to real bookmarked opportunities.
  - `frontend/app/funds/[slug]/page.tsx` & `/funds/page.tsx`: Interactive bookmarking and "Connect with Founder" modal actions.
