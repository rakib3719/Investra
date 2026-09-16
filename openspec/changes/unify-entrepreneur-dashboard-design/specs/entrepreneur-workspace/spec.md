## Purpose

Provides a cohesive, role-tailored dashboard experience for entrepreneurs using Investra's canonical design system, including sidebar navigation, top header controls, and section-based routing.

## ADDED Requirements

### Requirement: Standard Entrepreneur Shell Layout
The system SHALL display a unified workspace layout for authenticated entrepreneurs matching the visual standards of the Investra design system, featuring a light corporate background (`#f9fbfa`), sticky white sidebar navigation with Investra logo branding, and a sticky top header bar.

#### Scenario: Entrepreneur accesses workspace
- **WHEN** an authenticated user with role `ENTREPRENEUR` navigates to `/dashboard/entrepreneur`
- **THEN** the system displays the unified shell containing the Investra logo, navigation links, section header with `ENTREPRENEUR WORKSPACE` eyebrow, and user profile controls

#### Scenario: Mobile viewport navigation toggle
- **WHEN** an entrepreneur views the dashboard on a mobile screen width below 1024px
- **THEN** the sidebar is collapsed into an off-canvas drawer accessible via the top hamburger menu button

### Requirement: First-Class Section URL Routing
The system SHALL support deep-linked sub-routes under `/dashboard/entrepreneur/[section]` for standard sections (`overview`, `campaigns`, `matches`, `analytics`, `settings`) without redirecting valid paths back to the root dashboard.

#### Scenario: Direct navigation to campaigns section
- **WHEN** an authenticated entrepreneur navigates directly to `/dashboard/entrepreneur/campaigns`
- **THEN** the system renders the Fundraising & Pitch Campaigns view with the campaigns navigation item marked active

#### Scenario: Invalid section path redirection
- **WHEN** an entrepreneur navigates to an unrecognized section path under `/dashboard/entrepreneur/unknown-route`
- **THEN** the system replaces the route with `/dashboard/entrepreneur`

### Requirement: Entrepreneur Header and User Controls
The system SHALL provide a sticky top header containing the current section eyebrow, dynamic title, description, quick-action notification badge, search icon, and user initials avatar dropdown menu.

#### Scenario: Account dropdown interactions
- **WHEN** the entrepreneur clicks the account avatar in the top header
- **THEN** a dropdown menu displays links to view profile, account settings, and a sign-out action

### Requirement: Entrepreneur Overview Dashboard
The system SHALL present an overview dashboard aggregating active fundraising metrics, capital committed vs target round, round completion percentages, and priority investor pipeline status.

#### Scenario: Viewing overview metrics
- **WHEN** the entrepreneur visits `/dashboard/entrepreneur`
- **THEN** the system displays metric cards for total target capital, committed funds, active campaigns count, and average projected IRR using standard Investra UI panel cards
