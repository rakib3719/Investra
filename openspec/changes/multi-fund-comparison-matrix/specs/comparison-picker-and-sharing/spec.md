## Purpose

Enables accredited investors to search, discover, and select up to 4 investment opportunities across the platform into an active comparison session, synchronize selections through URL parameters, and dock selected deals from marketplace listings.

## ADDED Requirements

### Requirement: Searchable Deal Picker Modal
The system SHALL provide an interactive modal triggered by the "+ Add Fund" slot or deal selector bar, allowing investors to search and select campaigns from the database.

#### Scenario: Searching campaigns to add
- **WHEN** an investor clicks "+ Add Fund" in the matrix
- **THEN** the picker modal displays a list of active campaigns with search input, category filters, and clear indicators showing deals already in the active comparison.

#### Scenario: Selecting a deal into an empty slot
- **WHEN** an investor clicks "Add to Compare" on a campaign inside the modal
- **THEN** the campaign is appended to the comparison matrix (up to 4 items) and the modal updates or closes.

### Requirement: URL Parameter Synchronization
The system SHALL keep the actively compared fund identifiers synchronized with the browser URL query parameter `funds` (e.g. `/compare?funds=slug-1,slug-2,slug-3`).

#### Scenario: Opening a shared comparison URL
- **WHEN** a user navigates to `/compare?funds=solargrid-bangladesh-ltd,apex-fintech-core-banking-api`
- **THEN** the system resolves and displays those specific campaigns in the comparison matrix.

#### Scenario: Updating deals reflects in URL
- **WHEN** an investor adds or removes a deal from the comparison matrix
- **THEN** the system updates the URL query parameters without triggering a full page reload.

### Requirement: Floating Compare Dock from Marketplace Listings
The system SHALL display an interactive comparison dock when an investor selects deals on the `/funds` directory or `/dashboard/investor/opportunities` page.

#### Scenario: Adding deals from directory
- **WHEN** an investor clicks "Compare" on 2 or more fund cards in the `/funds` directory
- **THEN** a floating bottom drawer appears showing the selected thumbnails and a "Compare Now (N)" button that navigates to `/compare?funds=...`.
