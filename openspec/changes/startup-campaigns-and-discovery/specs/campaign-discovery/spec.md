## Purpose

Allows investors and visitors to explore, search, filter, and inspect verified startup campaigns with transparent IRR metrics and funding progress.

## ADDED Requirements

### Requirement: Multi-Facet Campaign Discovery Listing
The system SHALL provide a public and authenticated campaign listing endpoint supporting pagination, search queries, and multi-facet filtering (category, stage, risk level, IRR range, and funding percentage).

#### Scenario: Filtering campaigns by category and IRR
- **WHEN** a client queries campaigns with categoryId and minIrr=15
- **THEN** the system returns a paginated list of ACTIVE campaigns matching those criteria with total count and page metadata

#### Scenario: Keyword search across campaign title and pitch
- **WHEN** a client enters a search term in the discovery query
- **THEN** the system performs case-insensitive text matching against campaign title, tagline, and pitch summary

### Requirement: Detailed Campaign Overview Presentation
The system SHALL expose complete campaign profiles including financial metrics (valuation, target, raised amount, projected IRR, risk level), founder credentials, category, gallery, and milestones.

#### Scenario: Viewing active campaign details by slug
- **WHEN** a user navigates to an active campaign detail page by slug
- **THEN** the system renders the full campaign dataset including milestones and fundraising progress bar

#### Scenario: Accessing non-active draft campaign by unauthenticated user
- **WHEN** an unauthenticated visitor requests a campaign that is in DRAFT or REJECTED status
- **THEN** the system returns a 404 Not Found error
