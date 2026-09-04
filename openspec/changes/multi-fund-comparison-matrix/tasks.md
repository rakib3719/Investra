## 1. Benchmarking Utilities & Deal Picker Modal

- [x] 1.1 Implement metric benchmark calculation utilities in `frontend/lib/deals/compare-utils.ts` to compute standout leaders (top IRR, lowest min ticket, highest ESG rating, funding progress %) and verify with unit tests.
- [x] 1.2 Implement `frontend/components/deals/DealComparePickerModal.tsx` allowing investors to search, filter by category/stage, and select active marketplace campaigns into open comparison slots.

## 2. Dynamic 2 to 4 Matrix Component

- [x] 2.1 Rewrite `frontend/app/compare/page.tsx` into a responsive side-by-side matrix supporting 2, 3, or 4 funds with horizontal scroll preservation.
- [x] 2.2 Implement the interactive "+ Add Fund to Compare" slot card displayed whenever fewer than 4 campaigns are selected.
- [x] 2.3 Implement categorized comparison sections (Financial Terms, Valuation, Milestones & ESG, and Due Diligence) with automatic "Best in Metric" visual badges.
- [x] 2.4 Integrate `ConnectFounderModal` on each compared campaign column to enable instant founder connection directly from the comparison matrix.

## 3. URL Synchronization & Cross-Page Compare Dock

- [x] 3.1 Implement bidirectional URL query parameter synchronization (`/compare?funds=slug1,slug2...`) using Next.js search parameters for shareable and bookmarked comparisons.
- [x] 3.2 Implement `frontend/components/deals/CompareFloatingDock.tsx` and integrate it into `frontend/app/funds/page.tsx` and `frontend/components/dashboard/investor/pages/OpportunitiesPage.tsx` to allow queuing deals for comparison while exploring.

## 4. Verification & Build

- [x] 4.1 Run frontend production build (`npm run build`) to verify all comparison components, routes, and query parameters compile cleanly with zero TypeScript errors.
- [x] 4.2 Validate responsive behavior and matrix constraints when toggling between 2, 3, and 4 funds.
