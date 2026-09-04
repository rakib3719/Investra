## Why

Currently, Investra (InvestConnect) has authentication completed with cookie-first JWT sessions and role resolution, but the dashboard routes (`/dashboard/[role]`) only display an empty placeholder card. According to the Investra Software Design Document (SDD) and Brand Guidelines, each authenticated role (`INVESTOR`, `ENTREPRENEUR`, `CONSULTANT`, `ADMIN`, and `SUB_ADMIN`) requires a dedicated, feature-rich, high-performance portal tailored to their specific platform responsibilities and monetization workflows.

Implementing these role-based dashboards completes the core user experience, enabling investors to discover and compare deals, entrepreneurs to manage campaigns and inquiries, consultants to schedule sessions and track 80/20 earnings, and administrators to govern subscriptions and permissions.

## What Changes

- **Unified Dashboard Shell & Layout Component**: Implement a shared, responsive layout with a role-adaptive sidebar, header bar, user status dropdown, KYC verification alerts, and Midnight Navy/Steel Blue glassmorphic theme.
- **Investor Dashboard**:
  - Overview telemetry (invested capital, active campaigns backed, IRR/yield metrics, quick discovery feed).
  - Deal flow directory with advanced multi-stage filtering (`IDEA`, `MVP`, `EARLY_STAGE`, `GROWTH`, `SCALING`).
  - Portfolio tracking & saved bookmarks.
  - Side-by-side business comparison matrix.
  - Consultant session booking & KYC status tracker.
- **Entrepreneur (Uddokta) Dashboard**:
  - Campaign overview telemetry (funding progress, investor engagement views, active leads).
  - Business campaign creation and management wizard (pitch deck, valuation, equity/debt, media gallery).
  - Investor inquiry and message request management.
  - Mentorship session organizer & business KYC verification.
- **Consultant Dashboard**:
  - Earnings & revenue summary reflecting the 80/20 platform split.
  - 1-on-1 consultation session scheduler and calendar (Zoom / Google Meet link integration).
  - Workshops & pre-recorded course management.
  - Client review and rating monitor.
  - Service rate configuration (consultation fee, session fee, workshop fee, course fee).
- **Administrator & Sub-Admin Dashboard**:
  - Platform-wide telemetry (total volume, active users, funding aggregates).
  - User and role management (status toggling, role reassignments).
  - Subscription plan configuration & premium feature gate toggles.
  - Campaign moderation & verification review queue (KYC NID/Passport approval).
  - Transaction monitoring & Sub-Admin granular PBAC permission matrix.

## Capabilities

### New Capabilities
- `dashboard-shell`: Responsive, role-aware dashboard layout, theme provider integration, navigation sidebar, top navigation header, notification center, and KYC status alert banner.
- `investor-dashboard`: Portfolio telemetry, deal flow explorer, startup comparison matrix, bookmarked opportunities, and consultant advisory scheduling for investors.
- `entrepreneur-dashboard`: Business campaign publishing, pitch deck management, investor lead tracking, engagement analytics, and mentorship management for entrepreneurs.
- `consultant-dashboard`: Consultation booking calendar, live session links, workshop/course management, rating analytics, and 80/20 earnings payout tracker for consultants.
- `admin-dashboard`: Platform user management, subscription package & feature gate control, KYC audit queue, transaction monitor, and sub-admin permission management for admins.

### Modified Capabilities
<!-- None -->

## Impact

- **Frontend Routes**: Extends `/dashboard/[role]` with sub-routes and modular views for `investor`, `entrepreneur`, `consultant`, and `admin`.
- **UI Components**: Introduces reusable dashboard cards, metrics counters, data tables, comparison tables, scheduling widgets, and filter drawers matching the Venture Navy & Forest Growth design system.
- **State & Hooks**: Adds TanStack Query hooks, React Hook Form schemas, and API client adapters for dashboard modules.
- **Backend Alignment**: Connects frontend views directly to Prisma schema models (`InvestorProfile`, `EntrepreneurProfile`, `ConsultantProfile`, `UserVerification`, `Category`, `User`, `RefreshSession`).
