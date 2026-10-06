## 1. Unified Dashboard Navigation & Compliance Badges

- [x] 1.1 Standardize navigation section metadata and titles to `Identity & KYC` across Investor, Entrepreneur, and Consultant dashboards in `navigation.ts` and verify labels match across all three roles.
- [x] 1.2 Update `InvestorShell.tsx`, `EntrepreneurShell.tsx`, and `ConsultantShell.tsx` navigation items to display dynamic compliance status badges (`Verified`, `In Review`, `Unverified`) using `useMyKycQuery`.

## 2. Progressive KYC Verification Wizard & UI De-cluttering

- [x] 2.1 Refactor `KycVerificationCard.tsx` into a 3-step progressive wizard (Step 1: ID & Selfie, Step 2: Address & Tax, Step 3: Role-Specific Financial / KYB Information) with top progress bar and step validation.
- [x] 2.2 Replace long walls of legal text with concise micro-copy and clean 256-bit AES Cloudflare R2 private vault security indicator badges.
- [x] 2.3 Verify responsive behavior, dropzone file retention across step navigation, and smooth submission with toast feedback.

## 3. Action-Gated Protection & Verification Modal

- [x] 3.1 Create reusable `VerificationRequiredModal.tsx` and custom `useKycGate()` hook to check verification status before sensitive user actions.
- [x] 3.2 Wire `useKycGate()` into `ConnectFounderModal.tsx` and deal commitment actions on `OpportunitiesPage.tsx` so unverified users are prompted to complete KYC before executing actions.
- [x] 3.3 Verify unverified users can browse deals and view dashboards freely, while trigger buttons open the verification modal smoothly.
