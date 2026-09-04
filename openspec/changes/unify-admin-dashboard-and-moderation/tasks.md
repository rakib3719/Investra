## 1. Backend Admin Users & Stats Module

- [x] 1.1 Implement `backend/src/modules/admin/dto/admin-users-query.dto.ts` and `update-user-status.dto.ts` and verify DTO validation rules.
- [x] 1.2 Implement `backend/src/modules/admin/admin-users.service.ts` supporting paginated user listing, filtering by role and status, status update with session revocation, and platform overview statistics.
- [x] 1.3 Implement `backend/src/modules/admin/admin-users.controller.ts` with `GET /admin/users`, `PATCH /admin/users/:id/status`, and `GET /admin/overview-stats` protected by `JwtAuthGuard` and `RolesGuard(ADMIN)`, and register `AdminModule` in `backend/src/app.module.ts`.
- [x] 1.4 Write unit tests in `backend/src/modules/admin/admin-users.service.spec.ts` and verify with `npm test`.

## 2. Frontend API Client & Navigation Schema

- [x] 2.1 Implement `frontend/lib/admin/admin-users-api.ts` and `frontend/lib/admin/admin-hooks.ts` providing `useAdminUsersQuery`, `useUpdateUserStatusMutation`, and `useAdminOverviewStatsQuery`.
- [x] 2.2 Create `frontend/components/dashboard/admin/navigation.ts` defining `adminSections` (`overview`, `campaigns`, `users`, `categories`, `visitors`, `settings`), metadata, and route path helpers.
- [x] 2.3 Update `frontend/components/dashboard/DashboardPageClient.tsx` to permit and route all `adminSections` for `user.role === 'ADMIN'`.

## 3. Admin Workspace Shell & Shared Layout

- [x] 3.1 Implement `frontend/components/dashboard/admin/AdminShell.tsx` featuring the 268px sidebar, brand typography, active indicator pills, mobile drawer toggle, and user avatar sign-out footer.
- [x] 3.2 Implement `frontend/components/dashboard/admin/AdminWorkspace.tsx` routing active sections to dedicated view components.

## 4. Dedicated Admin Pages & Moderation Workflows

- [x] 4.1 Implement `frontend/components/dashboard/admin/pages/AdminOverviewPage.tsx` rendering high-level KPI cards, pending moderation queue, and quick platform alerts.
- [x] 4.2 Implement `frontend/components/dashboard/admin/pages/AdminUsersPage.tsx` with role/status filters, user search, profile detail drawer, and block/unblock action dialogs.
- [x] 4.3 Implement `frontend/components/dashboard/admin/pages/AdminCampaignsPage.tsx` providing status-filtered campaign review, milestone checks, 1-click approval, and rejection feedback modal.
- [x] 4.4 Implement `frontend/components/dashboard/admin/pages/AdminCategoriesPage.tsx`, `AdminVisitorsPage.tsx`, and `AdminSettingsPage.tsx`.

## 5. Verification & Testing

- [x] 5.1 Run backend unit tests (`npm test`) to verify all admin and campaign test suites pass cleanly.
- [x] 5.2 Run frontend production build (`npm run build`) to verify all dynamic and static routes compile with zero TypeScript errors.
