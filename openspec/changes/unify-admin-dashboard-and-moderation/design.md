## Context

See `proposal.md` for motivation and background. Investra utilizes a NestJS backend with Prisma ORM and a Next.js 15 App Router frontend. Both the Investor and Entrepreneur workspaces have been unified around a shared design system (`Panel`, `MetricCard`, `StatusPill`, `ProgressBar`) featuring 268px sticky sidebars and deep section routing via `DashboardPageClient.tsx`. In contrast, the Admin dashboard has been restricted to a single page view without sub-route support or user moderation capabilities.

## Goals / Non-Goals

**Goals:**
- Implement `AdminShell`, `AdminWorkspace`, and `navigation.ts` matching the canonical sidebar and responsive drawer design system.
- Enable multi-page deep routing `/dashboard/admin/[section]` for `overview`, `campaigns`, `users`, `categories`, `visitors`, and `settings`.
- Implement `AdminUsersModule` in NestJS providing `GET /admin/users`, `PATCH /admin/users/:id/status`, and `GET /admin/overview-stats` protected by `JwtAuthGuard` and `RolesGuard(ADMIN)`.
- Enforce immediate session revocation when a user is blocked by deleting or invalidating their `RefreshSession` records in PostgreSQL.
- Build dedicated administrative view components for each section using the shared `InvestorUI` primitives.

**Non-Goals:**
- Hard deletion of user accounts (status change to `BLOCKED` preserves foreign key integrity and audit logs).
- Automated credit rating or automated AI KYC checks (moderation is human-governed by administrators).

## Decisions

### 1. Structural Parity via Dedicated Admin Shell and Section Routing
- **Choice**: Mirror the established `InvestorShell` and `EntrepreneurShell` patterns with `AdminShell` and `adminSections = ["overview", "campaigns", "users", "categories", "visitors", "settings"]`.
- **Rationale**: Reuses the tested responsive drawer, sidebar navigation, top header, and `InvestorUI` components, eliminating visual discrepancy and enabling clean deep-linking for admin workflows.
- **Alternatives considered**: Keeping a single page with internal state tabs. Rejected because tabs prevent URL sharing, browser back-button navigation, and direct bookmarks to specific moderation queues.

### 2. User Moderation & Instant Session Revocation
- **Choice**: When an admin sets a user's `accountStatus` to `BLOCKED`, the backend executes:
  ```typescript
  await this.prisma.$transaction([
    this.prisma.user.update({
      where: { id: userId },
      data: { accountStatus: AccountStatus.BLOCKED },
    }),
    this.prisma.refreshSession.deleteMany({
      where: { userId },
    }),
  ]);
  ```
- **Rationale**: Ensures that blocked users cannot refresh expired access tokens or sustain authenticated sessions. The existing `JwtStrategy` rejects incoming requests from non-active users immediately.
- **Alternatives considered**: Setting a soft flag without deleting sessions. Rejected because blocked users would retain access until their tokens naturally expired.

### 3. Modular Administrative Endpoints
- **Choice**: Organize administrative endpoints under `backend/src/modules/admin/` with `AdminUsersController` and `AdminUsersService`, integrating cleanly alongside existing `campaigns` and `visitor-insights` modules.
- **Rationale**: Keeps administrative domain logic decoupled from public auth and user profile logic, and allows tight guard protection via `@Roles(UserRole.ADMIN)`.

## Risks / Trade-offs

- **[Risk: Accidental self-lockout]** -> **Mitigation**: Disallow administrators from blocking or demoting their own active account in `AdminUsersService`.
- **[Risk: Heavy queries on large user tables]** -> **Mitigation**: Provide database-level pagination (`skip`, `take`) with indexed searches across `email`, `firstName`, and `lastName`.
- **[Risk: Route collision in DashboardPageClient]** -> **Mitigation**: Update role authorization checks in `DashboardPageClient.tsx` to validate `adminSections` for `user.role === 'ADMIN'`.

## Migration Plan

1. Create backend `AdminUsersModule` with service, controller, and DTOs.
2. Register `AdminUsersModule` in `AppModule`.
3. Create frontend admin navigation schema and API client hooks.
4. Implement `AdminShell.tsx` and individual sub-pages (`AdminOverviewPage`, `AdminUsersPage`, `AdminCampaignsPage`, `AdminCategoriesPage`, `AdminVisitorsPage`, `AdminSettingsPage`).
5. Update `DashboardPageClient.tsx` to route admin sections seamlessly.
6. Verify with backend unit tests and frontend production build.
