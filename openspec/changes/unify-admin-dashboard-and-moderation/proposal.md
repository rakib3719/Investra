## Why

Investra currently features polished, canonical multi-page dashboard workspaces for Investors and Entrepreneurs using shared design primitives (`Panel`, `MetricCard`, `StatusPill`, `ProgressBar`), but the Platform Administrator workspace remains a rudimentary, single-purpose view. Platform administrators require full governance and moderation capabilities across all stakeholders—including the ability to block/unblock users, revoke compromised sessions, review and approve startup campaigns, manage industry categories, and inspect platform telemetry—within the identical responsive design system.

## What Changes

- **Unified Admin Shell & Deep Section Routing**: Establish `AdminShell`, `AdminSidebar`, and `navigation.ts` matching the 268px sidebar, brand typography, and header styling of the Investor and Entrepreneur workspaces, routing `/dashboard/admin/[section]` for `overview`, `campaigns`, `users`, `categories`, `visitors`, and `settings`.
- **User Governance & Moderation Engine**: Provide a comprehensive user management interface and backend endpoints to list, search, filter, block, unblock, and suspend users across all roles (`INVESTOR`, `ENTREPRENEUR`, `CONSULTANT`, `ADMIN`). Blocking a user immediately sets `accountStatus = 'BLOCKED'` and revokes active refresh sessions.
- **Venture Round Moderation Pipeline**: Deliver an administrative campaign review table with status filtering (`UNDER_REVIEW`, `ACTIVE`, `DRAFT`, `REJECTED`), pitch and milestone inspection, and 1-click approval or rejection with constructive feedback notes.
- **Platform Taxonomy & Category Management**: Enable administrators to inspect and create industry sectors/categories (name, slug, description, color, active state).
- **Consolidated Visitor Insights & Platform KPI Overview**: Embed the existing anonymous visitor telemetry into a dedicated section alongside high-level KPI metric cards (registered users by role, active rounds, capital raised).

## Capabilities

### New Capabilities
- `admin-workspace-shell`: Canonical admin shell, sticky sidebar, top search header, responsive drawer, and routing for all admin sections.
- `admin-user-moderation`: User management directory with role/status filters, user detail inspection, account blocking, unblocking, and session invalidation.
- `admin-campaign-moderation`: Startup campaign moderation interface with approval, rejection notes, and preview links.

### Modified Capabilities
<!-- None: No existing main specs are being modified. -->

## Impact

- **Backend**:
  - New `AdminUsersModule` with `AdminUsersController` and `AdminUsersService` supporting `GET /admin/users`, `PATCH /admin/users/:id/status`, and `GET /admin/overview-stats`.
  - Registered in `backend/src/app.module.ts`.
  - Protected with `JwtAuthGuard` and `RolesGuard(UserRole.ADMIN)`.
- **Frontend**:
  - `frontend/components/dashboard/admin/`: `AdminShell.tsx`, `navigation.ts`, `AdminWorkspace.tsx`, and dedicated sub-pages (`AdminOverviewPage`, `AdminUsersPage`, `AdminCampaignsPage`, `AdminCategoriesPage`, `AdminVisitorsPage`, `AdminSettingsPage`).
  - `frontend/components/dashboard/DashboardPageClient.tsx`: Updated to route and permit `adminSections`.
  - `frontend/lib/admin/`: Typed API client and TanStack Query hooks for admin user management and moderation actions.
