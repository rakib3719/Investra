## Purpose

Provides platform administrators with comprehensive tools to review, evaluate, approve, or reject startup fundraising campaigns submitted by entrepreneurs.

## ADDED Requirements

### Requirement: Administrative Campaign Moderation Queue
The system SHALL present all platform fundraising campaigns in a centralized moderation pipeline filterable by status (`UNDER_REVIEW`, `ACTIVE`, `DRAFT`, `REJECTED`).

#### Scenario: Filtering campaigns by moderation status
- **WHEN** an administrator selects the `UNDER_REVIEW` filter in the moderation queue
- **THEN** the system displays all campaigns awaiting platform review with their entrepreneur identity, funding goal, IRR, and submission timestamp.

### Requirement: Venture Round Approval Workflow
The system SHALL permit administrators to approve vetted campaigns, transitioning their status to `ACTIVE` and publishing them to the public directory and investor deal flow.

#### Scenario: Approving a submitted campaign
- **WHEN** an administrator clicks the approve action on a campaign in `UNDER_REVIEW` status
- **THEN** the system updates the campaign status to `ACTIVE` and immediately makes it visible on the public `/funds` directory and investor opportunities feed.

### Requirement: Venture Round Rejection with Feedback
The system SHALL permit administrators to reject an incomplete or non-compliant campaign, transitioning its status to `REJECTED` and recording an actionable rejection explanation for the founder.

#### Scenario: Rejecting a submitted campaign with notes
- **WHEN** an administrator submits a rejection reason note for a campaign
- **THEN** the system sets the campaign status to `REJECTED`, records the `rejectionReason` text in the database, and surfaces the feedback on the entrepreneur's dashboard.
