## Why

Currently, the `/compare` page is locked to a static mock dataset of 3 hardcoded businesses with a hardcoded restriction (`selectedIds.length < 3`). Investors cannot dynamically compare active startup investment rounds from the live marketplace, cannot select 2, 3, or up to 4 funds side-by-side, and lack head-to-head benchmarking metrics (such as top projected IRR yield, lowest minimum ticket size, milestone audit status, and ESG sustainability rating).

This change introduces a dynamic 2-to-4 deal comparison matrix powered by live marketplace campaigns with search/picker integration, visual "best in metric" badges, empty slot addition cards, and URL state persistence.

## What Changes

- **Dynamic 2 to 4 Deal Matrix**: Upgrade the comparison grid from a static 3-item limit to a responsive side-by-side layout supporting 2, 3, or 4 funds with dynamic column widths.
- **Empty Slot / "+ Add Fund" Card**: When fewer than 4 funds are selected, present an interactive "+ Add Fund to Compare" slot in the matrix.
- **Search & Selection Modal**: Provide an in-page modal to search, filter by category, and select active campaigns from the database (`useCampaignsQuery`) directly into the comparison grid.
- **Benchmarking & Highlight Accents**: Automatically calculate and highlight standout metrics (highest projected IRR, lowest minimum investment ticket, top ESG audit score, and highest funding percentage progress).
- **Categorized Head-to-Head Sections**: Organize comparative data into structured groups: Financial & Terms, Business Stage & Sector, Due Diligence & Traction, and Founder Outreach.
- **Direct Founder Connection Integration**: Embed the verified `ConnectFounderModal` directly within each compared fund's action block.
- **URL Parameter & Directory Sync**: Synchronize active comparison IDs via URL query parameters (`/compare?funds=slug1,slug2...`) and enable a floating compare dock from `/funds` and investor opportunities.

## Capabilities

### New Capabilities
- `deal-comparison-matrix`: Responsive side-by-side financial and operational matrix supporting 2 to 4 funds with automatic metric winner highlights, categorized rows, and sticky header controls.
- `comparison-picker-and-sharing`: Interactive fund picker modal for searching marketplace campaigns, empty slot addition, URL query parameter synchronization, and cross-page compare triggers.

### Modified Capabilities
<!-- None: No existing specs are modified. -->

## Impact

- **Frontend**:
  - Rewrites `frontend/app/compare/page.tsx` with dynamic query integration and responsive grid controls.
  - Adds `frontend/components/deals/DealComparePickerModal.tsx` for searching and picking campaigns.
  - Adds floating compare dock integration component `frontend/components/deals/CompareFloatingDock.tsx`.
  - Integrates `ConnectFounderModal` on comparison action buttons.
- **Backend**: No database schema changes required (utilizes existing `/campaigns` and `/campaigns/categories` endpoints).
- **User Experience**: Seamless deal discovery and quantitative comparison for accredited investors and platform visitors.
