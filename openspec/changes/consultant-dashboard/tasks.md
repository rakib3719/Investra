## 1. Data Contracts & Resilient Mock State

- [ ] 1.1 Create `frontend/lib/consultants/types.ts` defining data models for `ConsultantService`, `ConsultantBooking`, `ConsultantClient`, and `ConsultantEarnings` and verify TypeScript compiles without errors.
- [ ] 1.2 Create `frontend/lib/consultants/consultants-mock.ts` with comprehensive seed data for 1-on-1 mentoring, workshops, digital courses, booked calls, and earnings records.
- [ ] 1.3 Implement `frontend/lib/consultants/use-consultant-state.ts` with reactive state helpers to add offerings, toggle availability, and update session completion status.

## 2. Navigation & Workspace Shell

- [ ] 2.1 Create `frontend/components/dashboard/consultant/navigation.ts` defining `consultantSections` (`overview`, `services`, `schedule`, `clients`, `earnings`, `settings`), paths, and page metadata.
- [ ] 2.2 Build `frontend/components/dashboard/consultant/ConsultantShell.tsx` providing responsive desktop sidebar and mobile drawer navigation with active state indicators.
- [ ] 2.3 Create `frontend/components/dashboard/consultant/ConsultantWorkspace.tsx` and register it inside `DashboardPageClient.tsx` so authenticated consultants access the workspace.

## 3. Section Pages Implementation

- [ ] 3.1 Build `ConsultantOverviewPage.tsx` with summary cards (Net Earnings, Active Sessions, Unique Clients, Rating) and upcoming session agenda with direct call launcher.
- [ ] 3.2 Build `ServicesPage.tsx` featuring offering cards across 1-on-1, workshop, and course formats, active/paused toggles, and "New Offering" modal.
- [ ] 3.3 Build `SchedulePage.tsx` featuring chronological call agenda, Google Meet / Zoom link preview with copy action, and session completion status controls.
- [ ] 3.4 Build `ClientsPage.tsx` displaying enrolled founders and investors, startup affiliations, deal stages, and consultation notes.
- [ ] 3.5 Build `EarningsPage.tsx` presenting gross bookings, the 20% Investra platform fee deduction, net 80% payout balance, and transaction history table.
- [ ] 3.6 Build `ConsultantSettingsPage.tsx` providing form controls for hourly rate, specializations, years of experience, and verification badge status.

## 4. Verification & Build Validation

- [ ] 4.1 Run `npm run build` in `frontend/` and verify that all dashboard routes compile cleanly with 0 TypeScript and lint errors.
