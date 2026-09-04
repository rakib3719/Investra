## 1. Shell & Routing Architecture

- [x] 1.1 Create `frontend/components/dashboard/entrepreneur/navigation.ts` defining `entrepreneurSections`, route paths, and page metadata, and verify TypeScript compilation.
- [x] 1.2 Implement `frontend/components/dashboard/entrepreneur/EntrepreneurShell.tsx` mirroring `InvestorShell.tsx` (sticky white sidebar, Investra serif branding, mobile drawer, sticky header, and user avatar dropdown), and verify responsive drawer behavior.
- [x] 1.3 Update `frontend/components/dashboard/DashboardPageClient.tsx` to validate and permit entrepreneur section routing (`/dashboard/entrepreneur/[section]`), verifying deep links do not trigger incorrect redirects.

## 2. Overview Dashboard & Sub-Pages

- [x] 2.1 Implement `frontend/components/dashboard/entrepreneur/pages/EntrepreneurOverviewPage.tsx` displaying live funding progress metric cards, campaign summaries, and investor pipeline widgets using standard `Panel` and `MetricCard`.
- [x] 2.2 Create matching page views for `/matches`, `/analytics`, and `/settings` under `frontend/components/dashboard/entrepreneur/pages/` to ensure all sidebar navigation destinations render on-brand layouts.

## 3. Campaigns & Fundraising Redesign

- [x] 3.1 Refactor `FundraisingManager.tsx` into `frontend/components/dashboard/entrepreneur/pages/FundraisingPage.tsx`, updating campaign cards with `Panel`, canonical `StatusPill` colors, and `ProgressBar` while preserving existing `useMyCampaignsQuery` hooks.
- [x] 3.2 Restyle the "Create Campaign" and "Add Milestone" modal dialogs with standard Investra input controls, focus rings, and primary/secondary button styling while retaining all form handlers and mutation triggers.
- [x] 3.3 Update `frontend/components/dashboard/entrepreneur/EntrepreneurWorkspace.tsx` to dispatch section components (`overview`, `campaigns`, `matches`, `analytics`, `settings`) wrapped inside `EntrepreneurShell`.

## 4. Verification & Validation

- [x] 4.1 Run frontend TypeScript and lint checks to confirm zero syntax, typing, or compilation errors.
- [x] 4.2 Validate end-to-end workflow: test navigation between dashboard sections, verify campaign creation and milestone addition, check review submission, and ensure link routing to public `/funds/[slug]` pitch page works properly.
