## Purpose

Provides a unified, responsive administrative dashboard shell featuring a 268px sidebar, brand header, and multi-page routing that matches the look and feel of the investor and entrepreneur workspaces.

## ADDED Requirements

### Requirement: Admin Multi-Page Workspace Routing
The system SHALL permit authenticated administrators to navigate between distinct dashboard sections under `/dashboard/admin/[section]` without unexpected redirection to the default overview.

#### Scenario: Navigating between admin sections
- **WHEN** an authenticated administrator with role `ADMIN` navigates to `/dashboard/admin/users` or `/dashboard/admin/campaigns`
- **THEN** the system renders the corresponding section component and updates the active navigation state.

#### Scenario: Non-admin role protection
- **WHEN** an authenticated user with role `INVESTOR` or `ENTREPRENEUR` attempts to access any `/dashboard/admin/*` route
- **THEN** the system redirects the user to their respective role dashboard path.

### Requirement: Canonical Responsive Admin Sidebar
The system SHALL render a fixed 268px sidebar on desktop viewports and a collapsible drawer on mobile viewports featuring brand typography, section links, icon accents, and counter badges.

#### Scenario: Mobile drawer toggle
- **WHEN** an administrator clicks the hamburger menu toggle on a mobile viewport
- **THEN** the administrative navigation drawer slides open with an accessible backdrop overlay.

#### Scenario: Active route highlighting
- **WHEN** an administrator views an active dashboard section
- **THEN** the sidebar displays the corresponding link with emerald active pill styling and brand indicator line.
