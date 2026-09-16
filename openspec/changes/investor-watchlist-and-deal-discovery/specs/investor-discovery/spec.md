## Purpose

Enables investors to browse, search, and evaluate published startup campaigns within their workspace using live data, filtering by sector category and risk levels.

## ADDED Requirements

### Requirement: Live Campaign Discovery Feed
The system SHALL populate the Investor Opportunities page (`/dashboard/investor/opportunities`) with published campaigns fetched from the backend API rather than mock or static fixtures.

#### Scenario: Investor views opportunities dashboard
- **WHEN** an authenticated investor navigates to `/dashboard/investor/opportunities`
- **THEN** the system displays live active campaigns showing company title, category, business stage, target round, funding progress, and projected IRR

#### Scenario: Category facet filtering
- **WHEN** an investor selects a category filter pill (e.g. "Clean energy" or "FinTech")
- **THEN** the system filters displayed campaign opportunities matching the selected industry category

### Requirement: Campaign Detail Navigation
The system SHALL provide direct links on opportunity cards allowing investors to view the complete campaign pitch, deliverables, and founder profile.

#### Scenario: Navigating to public pitch page
- **WHEN** an investor clicks "Review opportunity" on a campaign card
- **THEN** the system navigates to `/funds/[slug]` displaying full pitch details, milestones, and venture background
