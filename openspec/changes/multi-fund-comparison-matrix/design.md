## Context

The `/compare` page currently relies on a static list of 3 mock businesses with a hardcoded restriction (`selectedIds.length < 3`). Meanwhile, the platform has dynamic campaign discovery and listing via `useCampaignsQuery` and `useCategoriesQuery`.

This design outlines a scalable, responsive 2-to-4 deal comparison matrix integrating live marketplace campaigns, searchable modal pickers, dynamic metric benchmarking, and URL query synchronization.

## Goals / Non-Goals

**Goals:**
- Provide a responsive side-by-side grid supporting 2, 3, or 4 campaigns with dynamic column layouts.
- Display an interactive "+ Add Fund" slot when fewer than 4 deals are actively selected.
- Provide a `DealComparePickerModal` allowing investors to search live campaigns by keyword, category, and stage.
- Compute and render "best in metric" badges (highest projected IRR, lowest minimum ticket, top ESG audit rating, and highest funding progress %).
- Keep selected deals synchronized with the URL search param `?funds=slug1,slug2...`.
- Integrate `ConnectFounderModal` on each compared campaign.
- Provide a floating compare dock (`CompareFloatingDock`) on `/funds` allowing investors to queue deals for comparison while browsing.

**Non-Goals:**
- Custom CSV/PDF export generation (reserved for Pro Tier future expansion).
- Arbitrary comparison beyond 4 items simultaneously (4 is the upper limit for readability on standard screens).

## Decisions

### 1. Hybrid Data Fetching & Slug Resolution
- **Approach**: On load, read `?funds=slug1,slug2...` from `useSearchParams`. Fetch live campaigns from `useCampaignsQuery({ limit: 50 })`.
- **Resolution**: Match the requested slugs against live campaigns. If fewer than 2 valid campaigns are found, supplement with verified platform starter campaigns so the page always renders a rich comparison.
- **Alternatives considered**: Separate backend `/campaigns/compare?ids=...` endpoint. Unnecessary because the existing `/campaigns` endpoint already returns full campaign models and categories.

### 2. Best-in-Metric Calculation Utility
- **Approach**: Create pure helper functions (`getMetricHighlights(campaigns)`) that compute:
  - Maximum `projectedIrr` -> flags highest yield
  - Minimum `minInvestment` -> flags most accessible entry ticket
  - Top `esgRating` (AAA > AA > A) -> flags sustainability leader
  - Maximum funding percentage (`raisedAmount / targetAmount`) -> flags momentum leader
- **Rationale**: Keeps rendering logic declarative and ensures benchmark badges automatically adjust whenever a deal is added or removed.

### 3. Responsive Column Grid with Horizontal Snap
- **Approach**: Use a CSS grid / table wrapper with `min-w-[900px]` (for 3 columns) up to `min-w-[1200px]` (for 5 columns with metrics). On small screens, allow horizontal smooth scrolling with a sticky first column for metric labels.
- **Rationale**: Guarantees table cells never squish or overflow on mobile devices while delivering a luxury desktop layout.

## Risks / Trade-offs

- **[Risk]** Screen space constraints on mobile viewports for 4 simultaneous columns.
  - **Mitigation**: Table container uses horizontal scroll with touch-friendly column widths and sticky metric labels.
- **[Risk]** Investors might remove all deals leaving an empty page.
  - **Mitigation**: Enforce a minimum of 2 deals. If an investor attempts to remove a deal when only 2 remain, prompt with an alert to add a replacement first.
