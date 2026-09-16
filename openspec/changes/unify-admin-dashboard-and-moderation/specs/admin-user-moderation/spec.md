## Purpose

Enables platform administrators to govern, inspect, search, filter, block, and unblock user accounts across all platform stakeholder roles with immediate session revocation.

## ADDED Requirements

### Requirement: Stakeholder Directory and Filtering
The system SHALL provide administrators with a searchable, paginated directory of all registered users filterable by stakeholder role (`INVESTOR`, `ENTREPRENEUR`, `CONSULTANT`, `ADMIN`) and account status (`ACTIVE`, `PENDING`, `BLOCKED`, `SUSPENDED`).

#### Scenario: Searching and filtering users
- **WHEN** an administrator enters a search query or selects a status filter on the user directory
- **THEN** the system returns matching user records including their name, email, role, verification status, and joined date.

### Requirement: User Account Blocking with Session Invalidation
The system SHALL allow an administrator to block a user account, setting their status to `BLOCKED` and immediately revoking all active authentication sessions.

#### Scenario: Blocking an active user
- **WHEN** an administrator confirms a block action on an active user account
- **THEN** the system updates the user's `accountStatus` to `BLOCKED`, deletes or revokes their active `refreshSessions`, and terminates future API access with a 401 Unauthorized status.

### Requirement: User Account Unblocking and Restoration
The system SHALL allow an administrator to restore access for a blocked or suspended user, returning their status to `ACTIVE`.

#### Scenario: Unblocking a blocked user
- **WHEN** an administrator clicks the unblock action on a blocked user account
- **THEN** the system sets the user's `accountStatus` to `ACTIVE`, enabling the user to authenticate successfully.

### Requirement: User Profile KYC Inspection
The system SHALL display detailed stakeholder profile data in a dedicated inspection panel or drawer, including attached venture campaigns, investment bookmarks, and KYC verification status.

#### Scenario: Inspecting user profile details
- **WHEN** an administrator clicks on a user row in the directory
- **THEN** the system displays the user's company name, bio, accredited investor status, and attached platform activity.
