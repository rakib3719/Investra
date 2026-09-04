## Purpose

Provides a responsive, multi-fund side-by-side comparison matrix allowing accredited investors to evaluate 2, 3, or 4 startup campaigns simultaneously with automated financial benchmarking and standout metric highlights.

## ADDED Requirements

### Requirement: Variable Fund Column Comparison (2 to 4 Deals)
The system SHALL support simultaneous side-by-side comparison of 2, 3, or 4 campaigns. When fewer than 4 campaigns are selected, the system SHALL display an interactive "+ Add Fund" slot that opens the deal picker.

#### Scenario: Comparing two deals
- **WHEN** an investor accesses the comparison matrix with 2 deals selected
- **THEN** the system displays 2 full deal columns plus an "+ Add Fund" card, adjusting column widths for comfortable readability.

#### Scenario: Comparing four deals
- **WHEN** an investor adds a 4th deal to the comparison matrix
- **THEN** the system displays all 4 deal columns in a full 4-column matrix, hiding the "+ Add Fund" card and preventing addition beyond 4 items.

#### Scenario: Attempting to remove below minimum limit
- **WHEN** an investor has exactly 2 deals in the matrix and clicks the remove action on one deal
- **THEN** the system prevents removing the deal or prompts the user that at least 2 deals must be selected for comparison.

### Requirement: Best-in-Metric Benchmark Highlighting
The system SHALL dynamically calculate and visually highlight standout metric values across the actively compared deals.

#### Scenario: Top projected IRR yield
- **WHEN** 2 to 4 deals with varying projected IRR rates are compared
- **THEN** the deal with the highest IRR receives an emerald "Highest Yield" badge on its IRR cell.

#### Scenario: Lowest entry minimum ticket size
- **WHEN** 2 to 4 deals with varying minimum investment thresholds are compared
- **THEN** the deal with the lowest minimum ticket receives a "Lowest Minimum" badge.

#### Scenario: Top ESG sustainability score
- **WHEN** deals include ESG ratings (e.g., AAA, AA, A)
- **THEN** deals achieving the highest tier rating receive an "ESG Leader" visual highlight.

### Requirement: Categorized Comparison Dimensions
The system SHALL group comparison data into clear semantic sections: Financial & Terms, Sector & Stage, Due Diligence & Milestones, and Direct Actions.

#### Scenario: Inspecting financial and traction metrics
- **WHEN** the investor reviews the matrix
- **THEN** financial metrics (Valuation, Target Fund, Raised Amount, Progress Bar, Min Investment, Projected IRR) and due diligence items (Milestones count, ESG audit, Investor bookmarks) are presented in designated categorized row sections.

### Requirement: Direct Founder Outreach & Deal Access
The system SHALL provide a direct "Connect Founder" action and "View Pitch" link within each deal's column header and action footer.

#### Scenario: Initiating founder connection from comparison
- **WHEN** an investor clicks "Connect Founder" under a specific compared deal
- **THEN** the system opens the verified ConnectFounderModal pre-populated with that startup's details and entrepreneur contact information.
