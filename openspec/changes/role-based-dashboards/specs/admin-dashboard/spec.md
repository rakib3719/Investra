## Purpose

Enables platform administrators and sub-administrators to manage platform users, configure subscription packages and feature access rules, review KYC identity submissions, and monitor financial transactions.

## ADDED Requirements

### Requirement: Platform-Wide Overview and Metrics
The system SHALL provide platform administrators with high-level system telemetry including total registered users (by role), active fundraising campaigns, total platform volume, and subscription revenue.

#### Scenario: Admin views platform overview
- **WHEN** an authenticated administrator opens `/dashboard/admin`
- **THEN** high-level platform telemetry cards and transaction graphs are rendered.

### Requirement: User and Role Management
The system SHALL enable administrators to search, filter, view user details, update account status (`ACTIVE`, `SUSPENDED`, `BLOCKED`), and inspect user profiles.

#### Scenario: Suspending a violating account
- **WHEN** an administrator changes a user's status to `SUSPENDED`
- **THEN** the account status is updated in the database and the user's active session is blocked from performing platform actions.

### Requirement: Subscription Package & Feature Gate Configuration
The system SHALL allow administrators to create, edit, and toggle features for subscription tiers (e.g. unlimited bookmarks, premium chat access, advanced comparison limits).

#### Scenario: Updating subscription tier features
- **WHEN** an administrator toggles premium chat access on a tier
- **THEN** subscribers on that tier immediately gain access to the feature validation checks across the platform.

### Requirement: KYC Identity Verification Review Queue
The system SHALL provide an administrative review queue for submitted NID and Passport identity verification documents with approval and rejection actions.

#### Scenario: Approving submitted KYC
- **WHEN** an administrator reviews uploaded ID documents and clicks "Approve"
- **THEN** the user's `verificationStatus` is updated to `VERIFIED` and the verification alert banner is cleared on the user's dashboard.
