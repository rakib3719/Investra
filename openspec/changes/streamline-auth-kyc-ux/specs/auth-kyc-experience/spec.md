## Purpose

Provides a clean, two-tier verification experience where email-verified users can freely explore the platform, while high-stakes investment and fundraising actions require role-tailored KYC compliance submitted through a multi-step wizard.

## ADDED Requirements

### Requirement: Unified Navigation and Compliance Status Badge
The application SHALL provide a consistent `Identity & KYC` entry point across all authenticated user dashboards (Investor, Entrepreneur, Consultant) displaying real-time compliance status badges.

#### Scenario: User checks KYC status in sidebar
- **WHEN** an authenticated user views the sidebar navigation in any role dashboard
- **THEN** the navigation displays `Identity & KYC` with a badge indicating `Unverified`, `Under Review`, or `Verified` matching their actual verification status.

### Requirement: Multi-Step Progressive KYC Wizard
The application SHALL break down the KYC verification submission into a 3-step progressive wizard (Step 1: ID & Biometric Selfie, Step 2: Address & Tax ID, Step 3: Role-Specific Financial / KYB Information) rather than a single monolithic form.

#### Scenario: User progresses through verification steps
- **WHEN** a user fills in valid primary ID details and uploads front/selfie files in Step 1
- **THEN** the system allows them to progress to Step 2 without showing irrelevant or overwhelming fields prematurely.

#### Scenario: Role-tailored Step 3 inputs
- **WHEN** an investor reaches Step 3 of the wizard
- **THEN** the system presents source of funds and accredited wealth range selections, whereas for an entrepreneur, it presents trade license and business incorporation upload options.

### Requirement: Action-Gated Protection for Financial and Deal Actions
The application SHALL allow authenticated users with verified emails to browse dashboards, opportunities, and campaigns freely, but SHALL gate transactional actions (such as committing capital, requesting founder calls, or publishing campaigns) behind an identity verification prompt.

#### Scenario: Unverified user attempts to connect with founder or commit capital
- **WHEN** an investor who has not been approved for KYC clicks to request a call or commit capital on a deal
- **THEN** the system displays a clear `Identity Verification Required` modal explaining regulatory requirements and offering a 1-click transition to the KYC verification wizard.

#### Scenario: Verified user initiates deal action
- **WHEN** an investor who has `VERIFIED` status clicks to request a call or commit capital
- **THEN** the action proceeds immediately without blocking or prompting for KYC.

### Requirement: Reassuring Zero-Trust Private Vault Security Messaging
The application SHALL replace lengthy legal disclaimers with concise, institutional-grade trust indicators highlighting encrypted, private storage.

#### Scenario: User views document upload section
- **WHEN** a user prepares to upload identity documents
- **THEN** the interface displays clear, concise encryption indicators (e.g., "256-bit AES Private Vault • Isolated Cloudflare R2 Storage") without walls of unformatted legal copy.
