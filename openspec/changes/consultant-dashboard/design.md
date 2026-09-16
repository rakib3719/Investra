## Context

Investra's frontend uses a unified dashboard routing pattern at `app/dashboard/[role]/[section]/page.tsx` powered by `DashboardPageClient.tsx`. While `INVESTOR`, `ENTREPRENEUR`, and `ADMIN` roles load structured, multi-section workspaces (`InvestorWorkspace`, `EntrepreneurWorkspace`, `AdminWorkspace`), `CONSULTANT` currently defaults to a static fallback dashboard.

See `proposal.md` for motivation and `specs/consultant-dashboard/spec.md` for functional requirements.

## Goals / Non-Goals

**Goals:**
- Implement `ConsultantWorkspace` and `ConsultantShell` matching the design language, typography, and sidebar navigation of existing Investra workspaces.
- Provide 6 distinct functional views:
  1. `overview`: Performance cards, agenda timeline, recent client inquiries.
  2. `services`: CRUD management for 1-on-1 Mentoring, Live Workshops, and Digital Courses.
  3. `schedule`: Calendar agenda, call timings, meeting links (Google Meet / Zoom), session status updates.
  4. `clients`: Enrolled founders and investors, session history, and deal context.
  5. `earnings`: Financial telemetry displaying the SDD 80/20 revenue split (80% net payout, 20% platform fee) and payout records.
  6. `settings`: Consultant profile settings, credentials, verification, and hourly rates.
- Establish clean TypeScript types and a reactive fallback state store (`consultants-mock.ts`) so creating offerings and updating sessions is fully interactive immediately.

**Non-Goals:**
- In-browser WebRTC video calls (sessions redirect to Google Meet / Zoom links).
- Direct banking/payout automated ACH transfers (will connect to Stripe Connect in the payment module).

## Decisions

### 1. Workspace Shell Pattern
Mirror the proven architectural pattern of `EntrepreneurWorkspace`:
- `navigation.ts`: Define `consultantSections` (`overview`, `services`, `schedule`, `clients`, `earnings`, `settings`), section paths, and `consultantPageMeta`.
- `ConsultantShell.tsx`: Responsive navigation shell with mobile drawer, notifications bell, user profile, and sign-out handler.
- `ConsultantWorkspace.tsx`: Dynamic section switcher mounted in `DashboardPageClient.tsx`.

```
+---------------------------------------------------------------------------------+
|                       CONSULTANT COMPONENT HIERARCHY                            |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  DashboardPageClient.tsx (if role === 'CONSULTANT')                             |
|          |                                                                      |
|          v                                                                      |
|  ConsultantWorkspace.tsx                                                        |
|          |                                                                      |
|          +--> ConsultantShell.tsx (Sidebar + Header + Mobile Drawer)            |
|                   |                                                             |
|                   +--> section === "overview"  --> ConsultantOverviewPage       |
|                   +--> section === "services"  --> ServicesPage                 |
|                   +--> section === "schedule"  --> SchedulePage                 |
|                   +--> section === "clients"   --> ClientsPage                  |
|                   +--> section === "earnings"  --> EarningsPage                 |
|                   +--> section === "settings"  --> ConsultantSettingsPage       |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### 2. Client-Side Interactive State & Resilient Fixtures
Create `frontend/lib/consultants/` containing:
- `types.ts`: Models for `ConsultantService`, `ConsultantBooking`, `ConsultantClient`, and `ConsultantEarningsSummary`.
- `consultants-mock.ts`: Rich, realistic seed data covering all 3 service types, upcoming calls with Google Meet links, past client interactions, and historical earnings.
- An interactive React hook `useConsultantWorkspaceState()` that allows creating new offerings, toggling service status, and marking sessions as completed with optimistic updates.

### 3. Transparent 80/20 Revenue Calculation
Encode the SDD business rule in `earnings`:
```
Gross Revenue = Sum of all completed bookings
Investra Platform Fee (20%) = Gross Revenue * 0.20
Consultant Net Earnings (80%) = Gross Revenue * 0.80
```
Display these metrics with transparent visual badges so the consultant clearly sees their gross earnings and net earnings.

## Risks / Trade-offs

- **[Risk] Meeting link invalidity** -> Mitigation: Validate URL inputs in the service/session modal to ensure valid `http://` or `https://` format (e.g. `meet.google.com/*` or `zoom.us/*`) and provide a 1-click "Copy Link" helper.
- **[Risk] Empty state for new consultants** -> Mitigation: When a consultant has 0 bookings or offerings, render high-contrast empty state cards with helpful guidance and a primary CTA to publish their first offering.
- **[Risk] Mobile responsive layout for calendar/tables** -> Mitigation: Use responsive table wrappers with horizontal scrolling and card-based fallbacks on viewports under 768px.
