## 1. Dashboard Shell & Shared Layout

- [ ] 1.1 Implement polymorphic `DashboardShell` layout component (`frontend/components/dashboard/DashboardShell.tsx`) with role-adaptive sidebar navigation, active highlighting, mobile drawer, and verify rendering on all roles.
- [ ] 1.2 Implement `DashboardHeader` with user profile dropdown, active role badge, verification badge, and sign-out trigger, and verify header actions and session termination.
- [ ] 1.3 Implement `KYCAlertBanner` (`frontend/components/dashboard/KYCAlertBanner.tsx`) rendering alert state when `verificationStatus` is `PENDING`, `UNDER_REVIEW`, or `REJECTED`, and verify banner dismissal/navigation.

## 2. Investor Dashboard Modules

- [ ] 2.1 Implement `InvestorOverviewView` with total deployed capital metrics, active deals counter, portfolio yield rate, and quick deal discovery cards, and verify component renders correctly.
- [ ] 2.2 Implement `InvestorDealsView` with search input, stage filter buttons (`IDEA`, `MVP`, `EARLY_STAGE`, `GROWTH`, `SCALING`), industry category filter, and bookmark action toggle, and verify filtering and bookmarking interactions.
- [ ] 2.3 Implement `InvestorComparisonView` allowing selection of up to 3 businesses for side-by-side metric comparison, and verify dynamic comparison matrix rendering.
- [ ] 2.4 Implement `InvestorPortfolioView` and `InvestorAdvisoryView` showing backed startups and consultant booking options, and verify view transitions.

## 3. Entrepreneur Dashboard Modules

- [ ] 3.1 Implement `EntrepreneurOverviewView` with live campaign funding progress bars, page views telemetry, bookmark counters, and pending message alerts, and verify metric calculations.
- [ ] 3.2 Implement `CampaignCreatorModal` allowing entrepreneurs to submit a business idea/campaign with valuation, target funding, equity, stage, pitch deck, and gallery, and verify form validation.
- [ ] 3.3 Implement `EntrepreneurInquiriesView` and `EntrepreneurMentorshipView` for managing incoming investor leads and booking pitch reviews with consultants, and verify lead management actions.

## 4. Consultant Dashboard Modules

- [ ] 4.1 Implement `ConsultantOverviewView` displaying total earnings, 80/20 split payout balance, completed sessions, and average star rating, and verify revenue math (80% net to consultant).
- [ ] 4.2 Implement `ConsultantBookingsView` with calendar/appointment list and direct "Join Meeting" action for Zoom/Google Meet links, and verify appointment display.
- [ ] 4.3 Implement `ConsultantServicesView` and `ConsultantSettingsView` allowing management of workshops, masterclass courses, and hourly consultation fees, and verify rate update forms.

## 5. Administrator Dashboard Modules

- [ ] 5.1 Implement `AdminOverviewView` and `AdminUsersView` with platform telemetry, role filtering, and account status toggling (`ACTIVE`, `SUSPENDED`, `BLOCKED`), and verify user moderation actions.
- [ ] 5.2 Implement `AdminSubscriptionsView` and `AdminKYCReviewView` to configure plan feature gates and review submitted NID/Passport identity verifications, and verify verification status changes.

## 6. Integration and Route Coordination

- [ ] 6.1 Update `frontend/app/dashboard/[role]/page.tsx` to dynamically mount the respective role view orchestrator with URL query parameter tab synchronization (`?tab=...`), and verify smooth role-specific navigation.
- [ ] 6.2 Run Next.js lint/typecheck and verify build integrity across all dashboard routes and components.
