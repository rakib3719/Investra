## Purpose

Provides a dynamic, role-scoped subscription system for administrators to define plans, curate catalog features with numeric limits or boolean switches, and guarantee immutable subscriber entitlements upon plan changes.

## ADDED Requirements

### Requirement: Role-Scoped Platform Feature Catalog
The system SHALL maintain a system-defined catalog of platform features categorized by user role (`ENTREPRENEUR`, `INVESTOR`, `CONSULTANT`) and feature type (`BOOLEAN` or `NUMERIC_LIMIT`).

#### Scenario: Querying system features by role
- **WHEN** an administrator requests available platform features filtered by role `ENTREPRENEUR`
- **THEN** the system returns only features applicable to entrepreneurs with their code, name, description, feature type, and measurement units.

#### Scenario: Preventing duplicate feature codes
- **WHEN** a feature definition is created with an existing `code`
- **THEN** the system rejects the operation with a 409 Conflict error.

### Requirement: Administrative Plan Tier Authoring
The system SHALL allow administrators to create, read, update, deactivate, and reorder subscription plan tiers for specific user roles.

#### Scenario: Creating a subscription tier with features and limits
- **WHEN** an administrator submits a new tier for role `INVESTOR` specifying monthly/yearly price, display badge, and feature limits (e.g., `deal_bookmark_limit` = 50, `deal_comparison_matrix` = true)
- **THEN** the system creates the plan tier and maps all specified feature configurations into persistent records.

#### Scenario: Editing an existing tier without mutating past subscriptions
- **WHEN** an administrator updates an existing plan's monthly price and reduces its `campaign_post_limit` from 5 to 2
- **THEN** the plan tier definition is updated for future buyers, but all previously created active user subscriptions remain unchanged.

### Requirement: Immutable Subscriber Feature Snapshotting
The system SHALL snapshot all plan features and numeric limits into the user's subscription record at the moment of plan activation or renewal.

#### Scenario: Preserving grandfathered entitlements
- **WHEN** a user purchases or activates a plan tier with a snapshot containing `campaign_post_limit: 5`
- **THEN** subsequent administrative changes to that plan tier's limit do not alter the user's `featureSnapshot` or active entitlements.

### Requirement: Dynamic Public Plan Tier Retrieval
The system SHALL provide a public API returning all active subscription tiers and their formatted features grouped by target role and billing interval.

#### Scenario: Public user browsing plans
- **WHEN** an unauthenticated visitor or authenticated user visits `/subscription` and selects `investor` and `yearly`
- **THEN** the system retrieves only active `INVESTOR` tiers ordered by `sortOrder`, displaying yearly prices and feature descriptions with their respective limits.
