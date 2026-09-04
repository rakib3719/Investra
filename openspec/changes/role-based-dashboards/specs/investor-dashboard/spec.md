## Purpose

Enables investors to monitor deployed capital telemetry, discover and filter active startup investment opportunities, compare deals side-by-side, bookmark favorites, and book sessions with consultants.

## ADDED Requirements

### Requirement: Investment Telemetry and Overview
The system SHALL present an investor overview dashboard displaying total capital deployed, number of active startup campaigns backed, average IRR/yield rate, and a curated feed of recommended deals.

#### Scenario: Investor views dashboard home
- **WHEN** an authenticated investor opens `/dashboard/investor`
- **THEN** key performance metric cards (Invested Amount, Active Deals, Portfolio Growth) and quick deal cards are rendered.

### Requirement: Deal Discovery and Multi-Filter Directory
The system SHALL provide an interactive deal discovery view allowing investors to filter startup campaigns by industry category, business stage (`IDEA`, `MVP`, `EARLY_STAGE`, `GROWTH`, `SCALING`), funding target range, and expected IRR.

#### Scenario: Filtering deals by stage and industry
- **WHEN** an investor filters by stage "EARLY_STAGE" and category "FinTech"
- **THEN** the system updates the campaign list to display only businesses matching both criteria.

### Requirement: Side-by-Side Business Comparison
The system SHALL enable investors to select up to three businesses and view a comparative table contrasting valuation, target funding, current raised %, stage, and risk indicators.

#### Scenario: Investor initiates comparison
- **WHEN** an investor selects 2 or 3 campaigns and navigates to the comparison view
- **THEN** a structured comparison matrix is rendered highlighting differences in valuation, equity offered, and traction metrics.

### Requirement: Saved Deals and Bookmarks
The system SHALL allow investors to bookmark business campaigns and access them in a dedicated saved opportunities tab.

#### Scenario: Toggling a bookmark
- **WHEN** an investor clicks the bookmark icon on a startup card
- **THEN** the campaign is added to the investor's saved bookmarks list and the icon reflects the saved state.
