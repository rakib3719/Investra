## Why

Currently, the Investra platform has an established, polished, corporate design system implemented in the Investor Dashboard (`InvestorShell`, `InvestorUI`, `InvestorOverviewPage`). In contrast, the Entrepreneur Workspace (`EntrepreneurWorkspace.tsx`) employs a divergent dark navy theme (`#182B45`), lacks standard platform navigation (no Investra header bar, no user initials dropdown, no search/notification controls), and does not support sub-route URL navigation (`/dashboard/entrepreneur/[section]`). 

While the backend and frontend campaign integration (`useMyCampaignsQuery`, `useCreateCampaignMutation`, `useSubmitCampaignForReviewMutation`, `useAddMilestoneMutation`) is fully functional, its presentation in `FundraisingManager.tsx` uses ad-hoc styles, conflicting color codes, and non-standard card radiuses. Unifying the Entrepreneur Workspace under the canonical Investra design system creates visual consistency, improves accessibility, and elevates the user experience across all platform roles.

## What Changes

- **Entrepreneur Shell Architecture**: Replace the ad-hoc dark navy sidebar in `EntrepreneurWorkspace.tsx` with a clean, standard `EntrepreneurShell` modeled after `InvestorShell` (white sticky sidebar, Investra serif branding, emerald-accented active states, and bottom promotional/action card).
- **Sticky Header & Account Controls**: Introduce the standard top header bar for the Entrepreneur dashboard featuring role eyebrows (`ENTREPRENEUR WORKSPACE`), dynamic section title, notifications indicator, search button, and user account dropdown menu (profile link, settings, sign out).
- **First-Class Section URL Routing**: Update `frontend/components/dashboard/DashboardPageClient.tsx` to permit section routing for `entrepreneur` (`/dashboard/entrepreneur`, `/dashboard/entrepreneur/campaigns`, `/dashboard/entrepreneur/matches`, `/dashboard/entrepreneur/analytics`, `/dashboard/entrepreneur/settings`).
- **Unified Design Primitives for Campaigns**: Refactor `FundraisingManager.tsx` into a styled `FundraisingPage` using shared Investra UI components (`Panel`, `SectionHeading`, `StatusPill`, `ProgressBar`, `PrimaryButton`, `SecondaryButton`, and standard form input styling).
- **Entrepreneur Overview Page**: Implement a dedicated `EntrepreneurOverviewPage` mirroring the metrics and data presentation of `InvestorOverviewPage`, displaying live campaign statistics (target round, committed capital, round progress, projected IRR, and milestone tracking).
- **Form & Modal Design Consistency**: Align the "Create Campaign" and "Add Milestone" modal dialogs with standard Investra design specifications (focus rings with emerald glow, consistent typography, clean modal backdrops, and input field structures).

## Capabilities

### New Capabilities
- `entrepreneur-workspace`: Unified navigation shell, dynamic top header, section-based routing, and overview analytics for authenticated entrepreneurs.
- `campaign-management`: Entrepreneur campaign authoring, milestone management, review submissions, and status visualization integrated with canonical Investra UI primitives.

### Modified Capabilities
<!-- None: openspec/specs is currently empty and existing requirements are newly captured in this change -->

## Impact

- **Frontend Components**:
  - `frontend/components/dashboard/DashboardPageClient.tsx`: Support entrepreneur section routing.
  - `frontend/components/dashboard/entrepreneur/EntrepreneurWorkspace.tsx`: Overhauled to use the unified shell and section component dispatcher.
  - `frontend/components/dashboard/entrepreneur/EntrepreneurShell.tsx`: Newly created shell container following `InvestorShell`.
  - `frontend/components/dashboard/entrepreneur/navigation.ts`: Section definitions, route mapping, and page metadata for entrepreneurs.
  - `frontend/components/dashboard/entrepreneur/pages/EntrepreneurOverviewPage.tsx`: Summary dashboard with campaign progress metrics.
  - `frontend/components/dashboard/entrepreneur/pages/FundraisingPage.tsx`: Standardized campaign manager retaining full API hooks.
- **Dependencies & Backend APIs**: No backend changes or database migrations required; all existing NestJS endpoints (`/entrepreneur/my-campaigns`, `/campaigns`, `/campaigns/:id/milestones`, `/campaigns/:id/submit-review`) and TanStack Query hooks are preserved.
