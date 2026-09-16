## Context

See `proposal.md` for background and motivation. The Investra frontend is a Next.js 15 App Router application with Tailwind CSS v4. Currently, the Investor dashboard has a mature architecture:
- `InvestorShell.tsx`: Sticky sidebar, mobile drawer, top header bar, user avatar dropdown.
- `InvestorUI.tsx`: Canonical UI primitives (`Panel`, `SectionHeading`, `MetricCard`, `StatusPill`, `ProgressBar`, `PrimaryButton`, `SecondaryButton`).
- `navigation.ts`: Section list, section path resolver, and page metadata dictionary.
- Dynamic route handler: `app/dashboard/[role]/[section]/page.tsx` delegating to `DashboardPageClient.tsx`.

In contrast, the Entrepreneur role renders `EntrepreneurWorkspace.tsx`, which bypasses route sections, uses a standalone dark navy `#182B45` sidebar, and embeds `FundraisingManager.tsx` with custom styling. The backend APIs (`CampaignsModule` in NestJS) and frontend hooks (`campaigns-hooks.ts`) are fully implemented and functional.

## Goals / Non-Goals

**Goals:**
- Implement `EntrepreneurShell.tsx` and `navigation.ts` matching the visual layout, typography, and interaction patterns of `InvestorShell.tsx`.
- Update `DashboardPageClient.tsx` to permit section routing for `ENTREPRENEUR` (`overview`, `campaigns`, `matches`, `analytics`, `settings`).
- Create `EntrepreneurOverviewPage.tsx` displaying aggregated campaign telemetry (total target, raised capital, active round progress, and milestones) using `MetricCard` and `Panel`.
- Refactor `FundraisingManager.tsx` into `FundraisingPage.tsx` adhering to Investra UI primitives, updating campaign cards with `StatusPill` (`DRAFT`, `UNDER_REVIEW`, `ACTIVE`, `REJECTED`), `ProgressBar`, and restyling the "Create Campaign" and "Add Milestone" modals.
- Provide clean sub-views for `matches`, `analytics`, and `settings` so that all navigation items lead to functional, on-brand pages.

**Non-Goals:**
- Modifying backend NestJS services, controllers, or Prisma schemas.
- Altering the investor dashboard or public `/funds` directory behavior.
- Implementing payment escrow or live data room file uploads (deferred to respective tracks).

## Decisions

### 1. Section Structure and Route Resolution
- **Choice**: Define `entrepreneurSections` as `["overview", "campaigns", "matches", "analytics", "settings"]` in `navigation.ts` and dispatch section components inside `EntrepreneurWorkspace.tsx`.
- **Rationale**: Mirrors the clean pattern of `InvestorWorkspace.tsx`, enabling bookmarkable URLs (`/dashboard/entrepreneur/campaigns`), browser history support, and deep linking without full page reloads.
- **Alternatives considered**: Retaining local `activeTab` React state. Rejected because it breaks browser navigation and creates an inconsistent UX between investor and entrepreneur roles.

### 2. Reusing and Standardizing UI Primitives
- **Choice**: Utilize the established primitives from `InvestorUI.tsx` (`Panel`, `SectionHeading`, `MetricCard`, `StatusPill`, `ProgressBar`, `PrimaryButton`, `SecondaryButton`) for entrepreneur views.
- **Rationale**: Guarantees identical border radii (`rounded-2xl`), border colors (`border-slate-200/80`), shadows, and badge color mappings across the entire application.
- **Alternatives considered**: Duplicating component definitions inside an `EntrepreneurUI.tsx`. Rejected to eliminate code duplication and maintain single-source styling.

### 3. Preserving API Integration Layer
- **Choice**: Keep `useMyCampaignsQuery`, `useCategoriesQuery`, `useCreateCampaignMutation`, `useSubmitCampaignForReviewMutation`, and `useAddMilestoneMutation` completely intact.
- **Rationale**: The API client and query cache invalidation logic are proven and work reliably. Only the presentation layer and modal designs are upgraded.

## Risks / Trade-offs

- **[Risk: Route collision in DashboardPageClient]** -> **Mitigation**: Update `sectionAllowed` validation logic to check `validEntrepreneurSection` when `user.role === "ENTREPRENEUR"`, ensuring neither role can access the other's invalid sub-routes.
- **[Risk: Form state disruption in modal refactoring]** -> **Mitigation**: Retain existing state variables (`title`, `targetAmount`, `pitchText`, etc.) and mutation triggers verbatim, applying only styling changes to `<input>`, `<select>`, `<textarea>`, and modal wrappers.
- **[Risk: Responsive drawer behavior on mobile]** -> **Mitigation**: Adopt the tested mobile backdrop and slide-over transition from `InvestorShell`.

## Migration Plan

1. Create `navigation.ts` for entrepreneur sections and metadata.
2. Build `EntrepreneurShell.tsx` following `InvestorShell.tsx`.
3. Create `EntrepreneurOverviewPage.tsx` and refactor `FundraisingPage.tsx`.
4. Update `DashboardPageClient.tsx` to enable entrepreneur section routing.
5. Verify navigation, campaign creation, milestone submission, and review submission in the browser.
