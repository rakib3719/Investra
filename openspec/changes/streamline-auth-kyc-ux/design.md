## Context

See `proposal.md` for background and motivation. Currently, the backend already implements private Cloudflare R2 media upload policies (`category: KYC_DOCUMENT`, `isPublic: false`) and endpoints for fetching (`/kyc/me`) and submitting (`/kyc/submit`) verification records, as well as admin review endpoints (`/admin/kyc`). 

However, on the frontend, the UI presented all fields in a single, massive 600-line form (`KycVerificationCard.tsx`) packed with regulatory paragraphs. Sidebar links and badges across `InvestorShell`, `EntrepreneurShell`, and `ConsultantShell` had inconsistent labels and missing status indicators. Furthermore, users were forced through all checks upfront without a clean 2-tier "Browse with email verified, Gate on sensitive action" pattern.

## Goals / Non-Goals

**Goals:**
- Unify navigation across Investor, Entrepreneur, and Consultant dashboards to consistently offer `Identity & KYC` with live status pills (`Unverified`, `Under Review`, `Verified`).
- Refactor `KycVerificationCard` into a progressive 3-step wizard with step validation, sleek micro-copy, and clear R2 private vault security badges.
- Create an `ActionVerificationGate` / `VerificationRequiredModal` component to gracefully block unverified users from sensitive actions (such as `ConnectFounderModal`, deal commitments, or campaign publishing) and guide them to KYC with 1 click.
- Maintain 100% backward compatibility with the existing NestJS backend and Prisma schema.

**Non-Goals:**
- Rewriting backend database models or altering existing verification status enum values (`PENDING`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`).
- Altering the admin review dashboard logic (`AdminKycPage.tsx`), which already works effectively with the existing API.

## Decisions

### Decision 1: Progressive Multi-Step Wizard vs. Accordion or Single Form
- **Choice**: Multi-step wizard (Steps 1 to 3) with top progress bar.
- **Rationale**: Single forms create cognitive overload and abandonment, while accordions hide state. Progressive wizards (popularized by Stripe Identity and Persona) focus user attention on 2-3 fields at a time:
  - Step 1: ID Type & Front/Back/Selfie uploads.
  - Step 2: Residential Address & Tax Identification (TIN).
  - Step 3: Role-specific financial/accreditation details (Source of funds for Investors; Trade license for Founders/Consultants).
- **Alternative considered**: Tabbed navigation inside the card. Rejected because linear onboarding ensures prerequisite media files (front, selfie) are uploaded first.

### Decision 2: Action Gating via Reusable Verification Gate Hook & Modal
- **Choice**: A custom React hook `useKycGate()` and `<VerificationRequiredModal />`.
- **Rationale**: Instead of hard-locking entire routes or hiding deal opportunities, users are encouraged to browse deals, explore startup metrics, and interact with the UI. When they click "Connect with Founder" or "Commit Funds", `useKycGate()` checks `isVerified`. If unverified, the modal appears with context ("Institutional compliance requires identity verification before initiating founder calls or transferring capital").
- **Alternative considered**: Global route middleware redirecting all unverified users directly to `/dashboard/[role]/kyc`. Rejected because it creates excessive friction and damages the exploratory experience.

### Decision 3: Sleek Security Trust Indicators
- **Choice**: Compact badge pill: `"256-bit Encrypted Private Vault • Cloudflare R2 Zero-Trust"`.
- **Rationale**: Long walls of legal disclaimers trigger anxiety and fatigue. Trust is earned through crisp, modern, institutional-grade visual treatments.

## Risks / Trade-offs

- **[Risk] User closes wizard midway through uploads**:
  - *Mitigation*: Uploaded media IDs in Dropzones are preserved in local state so navigating back/forward between steps does not re-upload files.
- **[Risk] Incomplete KYC submissions**:
  - *Mitigation*: Wizard validates required fields (ID Front, Selfie, Residential Address) before enabling the final submission button.
