## Purpose

Provides the unified, responsive, role-aware dashboard layout, navigation sidebar, header navbar, notification drawer, and KYC verification status indicator across all authenticated portals.

## ADDED Requirements

### Requirement: Role-Aware Navigation Shell
The system SHALL render an adaptive sidebar and header navigation tailored to the authenticated user's active role (`INVESTOR`, `ENTREPRENEUR`, `CONSULTANT`, `ADMIN`, or `SUB_ADMIN`).

#### Scenario: User navigates matching role portal
- **WHEN** an authenticated user with role `INVESTOR` accesses `/dashboard/investor`
- **THEN** the system displays the Investor sidebar menu items (Overview, Deals, Portfolio, Compare, Advisory, Settings) with active tab highlighting.

#### Scenario: Cross-role route access prevention
- **WHEN** an authenticated user with role `ENTREPRENEUR` attempts to access `/dashboard/investor`
- **THEN** the system redirects the user to `/dashboard/entrepreneur` and displays their authorized workspace.

### Requirement: KYC and Verification Status Banner
The system SHALL display an actionable verification alert banner at the top of the dashboard when a user's verification status is `PENDING`, `UNDER_REVIEW`, or `REJECTED`.

#### Scenario: Unverified user views dashboard
- **WHEN** a user with `verificationStatus = PENDING` opens their dashboard
- **THEN** a verification notice banner is displayed prompting them to submit NID or Passport identity verification documents.

#### Scenario: Verified user views dashboard
- **WHEN** a user with `verificationStatus = VERIFIED` opens their dashboard
- **THEN** the verification warning banner is omitted and a verified badge is displayed beside the user's name.

### Requirement: User Profile and Session Management
The system SHALL provide a header dropdown menu displaying user identity, role badge, subscription tier preview, and a secure sign-out trigger.

#### Scenario: User triggers sign out
- **WHEN** the user selects the "Sign Out" option from the dashboard user menu
- **THEN** the system invalidates the session via `POST /auth/logout`, clears local auth state, and navigates to the login view.
