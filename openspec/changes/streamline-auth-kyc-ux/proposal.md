## Why

The current authentication and KYC onboarding experiences are cluttered, verbose, and inconsistent across role dashboards (Investor, Entrepreneur, Consultant). While basic authentication and an extensive compliance card exist, the interface suffers from wall-of-text fatigue, mismatched sidebar naming, and confusing gating rules. 

Users need a world-class, institutional-grade experience (comparable to Carta, AngelList, or Stripe) where they can register, verify email, log in, browse the ecosystem freely, and be prompted to complete identity verification only when initiating restricted financial or contractual actions (commit capital, publish campaign, book advisory, access deal rooms).

## What Changes

- **Consistent Dashboard Navigation & Badges**: Standardize sidebar navigation across all dashboards (Investor, Entrepreneur, Consultant) to use a unified `Identity & KYC` label and icon (`ShieldCheck`), accompanied by real-time status pills (`Unverified`, `In Review`, `Verified`).
- **Progressive Disclosure KYC Wizard**: Refactor the monolithic 600-line KYC verification card into a clean, intuitive multi-step wizard (Personal ID & Selfie Liveness -> Residential Address & TIN -> Role-Specific Financial / KYB Documents) with clear progress indicators.
- **De-clutter Regulatory Text & Institutional Cloudflare R2 Badging**: Replace wall-of-text regulatory disclaimers with concise, reassuring micro-copy and clean 256-bit AES encrypted private vault indicators referencing Cloudflare R2 storage.
- **Two-Tier Verification & Action-Gated Protection**: Establish a 2-tier identity flow where verified email grants browse/read access to dashboards and marketplace listings, while financial and high-trust actions (e.g. connecting with founders, committing funds, launching campaigns) are guarded by a sleek `VerificationRequiredModal` directing users to KYC.
- **Role-Tailored Compliance Flow**: Dynamically adapt KYC steps to user role:
  - Investors: Source of funds, accredited net worth/income, optional proof of funds.
  - Entrepreneurs: Business TIN, Trade License/Incorporation certificates.
  - Consultants: Professional accreditation, TIN, advisory identity check.

## Capabilities

### New Capabilities
- `auth-kyc-experience`: Clean 2-tier verification UX, progressive KYC verification wizard, action-gated modal prompts, and unified role dashboard compliance navigation.

### Modified Capabilities
<!-- None: No existing specs in openspec/specs -->

## Impact

- **Frontend**:
  - `frontend/components/dashboard/shared/KycVerificationCard.tsx` (redesigned into progressive wizard or modular steps)
  - `frontend/components/dashboard/investor/navigation.ts`, `InvestorShell.tsx`, `InvestorWorkspace.tsx`
  - `frontend/components/dashboard/entrepreneur/navigation.ts`, `EntrepreneurShell.tsx`, `EntrepreneurWorkspace.tsx`
  - `frontend/components/dashboard/consultant/navigation.ts`, `ConsultantShell.tsx`, `ConsultantWorkspace.tsx`
  - New reusable modal: `frontend/components/auth/VerificationRequiredModal.tsx`
  - Action integration points: `ConnectFounderModal.tsx`, `OpportunitiesPage.tsx`, campaign creation forms.
- **Backend**:
  - Existing endpoints (`/auth/login`, `/kyc/me`, `/kyc/submit`, `/admin/kyc`) remain fully compatible with no breaking API changes.
