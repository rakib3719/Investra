## Why

Investra is designed as a three-sided investment networking platform connecting Investors, Entrepreneurs, and Consultants. While Investors, Entrepreneurs, and Admins currently have dedicated, feature-rich workspaces, users registered with the `CONSULTANT` role currently fall back to a generic static dashboard.

To deliver on the core value proposition of the Notion Software Design Document (SDD), consultants must have a dedicated workspace to manage advisory offerings (1-on-1 mentoring, cohort workshops, online courses), inspect client bookings from founders and investors, manage meeting links (Google Meet / Zoom), and track their net earnings following the platform's 80/20 revenue distribution model (80% consultant payout, 20% platform fee).

## What Changes

- **Dedicated Consultant Workspace**: Introduce `ConsultantWorkspace` and `ConsultantShell` in `frontend/components/dashboard/consultant/`, routed through `/dashboard/consultant/[section]`.
- **Navigation & Routing**: Implement `consultantSections` (`overview`, `services`, `schedule`, `clients`, `earnings`, `settings`) in `navigation.ts` and wire into `DashboardPageClient.tsx`.
- **Overview Page**: Real-time summary cards for net earnings, upcoming advisory calls, total unique clients reached, and star ratings, plus an upcoming agenda timeline.
- **Services & Offerings Management**: Interactive interface to create, edit, pause, and price offerings across 3 formats: 1-on-1 Mentoring, Live Cohort Workshops, and Digital Courses.
- **Schedule & Calendar**: Agenda view of upcoming calls with direct "Join Call" actions, Google Meet / Zoom link copying, and status transitions (Scheduled, Completed, Cancelled).
- **Client & Learner Registry**: Directory of entrepreneurs and investors who have booked advisory sessions, including pitch links, deal stage, and session notes.
- **Earnings & Revenue Distribution**: Visual breakdown of gross bookings, the 20% Investra platform fee, net 80% consultant earnings, withdrawal status, and payout history.
- **Advisory Profile & Settings**: Management of hourly rate, years of experience, credentials, specializations, and verification badge status.
- **Curated Fallback & State Resilience**: Include rich, curated fallback data and mock stores so the consultant workspace is fully functional and interactive in dev/offline mode before persistent database mutations.

## Capabilities

### New Capabilities
- `consultant-dashboard`: Complete multi-section dashboard workspace and services management for users with the `CONSULTANT` role.

### Modified Capabilities
<!-- None -->

## Impact

- **Frontend**:
  - `frontend/components/dashboard/consultant/` (Shell, Workspace, navigation, and sub-pages: `ConsultantOverviewPage`, `ServicesPage`, `SchedulePage`, `ClientsPage`, `EarningsPage`, `ConsultantSettingsPage`).
  - `frontend/components/dashboard/DashboardPageClient.tsx` (Render `ConsultantWorkspace` when `user.role === 'CONSULTANT'`).
  - `frontend/lib/consultants/types.ts` & `consultants-mock.ts` (Data models and fallback fixtures for offerings, bookings, and earnings).
- **APIs & Backend**:
  - Sets up the contract for future consultant booking endpoints (`/consultant/services`, `/consultant/bookings`, `/consultant/earnings`).
- **Dependencies**: Lucide React icons, existing `@/components/ui/` components, Tailwind styling.
