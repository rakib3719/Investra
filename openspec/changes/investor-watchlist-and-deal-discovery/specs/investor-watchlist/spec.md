## Purpose

Provides persistent bookmarking and watchlist capabilities allowing accredited investors to save, archive, and monitor promising startup investment rounds over time.

## ADDED Requirements

### Requirement: Campaign Bookmark Toggle
The system SHALL allow authenticated investors to bookmark or unbookmark any campaign from the opportunities feed, public directory, and campaign detail views.

#### Scenario: Bookmarking an active campaign
- **WHEN** an investor clicks the bookmark icon on an unbookmarked campaign card
- **THEN** the system creates a persistent bookmark record in the database, updates the icon state to active, and increases the campaign's bookmark count

#### Scenario: Removing an existing bookmark
- **WHEN** an investor clicks the active bookmark icon on a previously saved campaign
- **THEN** the system deletes the bookmark record and updates the icon state to inactive

### Requirement: Watchlist Dashboard Management
The system SHALL present all saved campaigns in the investor's Watchlist page (`/dashboard/investor/watchlist`) sorted by most recent addition.

#### Scenario: Viewing saved watchlist
- **WHEN** an investor navigates to `/dashboard/investor/watchlist`
- **THEN** the system fetches and displays all campaigns bookmarked by that investor with their current funding progress, target IRR, stage, and quick-action buttons

#### Scenario: Empty watchlist state
- **WHEN** an investor has not bookmarked any campaigns
- **THEN** the system displays a clear empty state with an action button linking to `/dashboard/investor/opportunities`
