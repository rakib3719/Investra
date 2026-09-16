## Purpose

Enables entrepreneurs to author startup investment campaigns, manage operational milestones, submit proposals for admin review, and monitor funding progress using standard Investra UI components.

## ADDED Requirements

### Requirement: Unified Campaign Card and Status Display
The system SHALL present the entrepreneur's campaigns using standard `Panel` containers, displaying the campaign title, category badge, business stage, target round, raised amount, projected IRR, and lifecycle status formatted with canonical `StatusPill` colors (`DRAFT` as slate, `UNDER_REVIEW` as amber, `ACTIVE` as green, and `REJECTED` as rose).

#### Scenario: Displaying campaign listing
- **WHEN** an entrepreneur views the `/dashboard/entrepreneur/campaigns` page
- **THEN** the system fetches the user's campaigns via `useMyCampaignsQuery` and renders each campaign within a standard Investra UI panel card with funding progress bar and financial summary

#### Scenario: Active campaign public link
- **WHEN** a campaign has `ACTIVE` status
- **THEN** the campaign card displays a direct link button navigating to `/funds/[slug]` to preview the public investment pitch

### Requirement: Standardized Campaign Creation Dialog
The system SHALL display an interactive modal dialog for drafting new campaigns styled with Investra's standard form controls, validation states, and primary button styling.

#### Scenario: Submitting a valid new campaign
- **WHEN** the entrepreneur fills in the required campaign title, category, target amount, minimum ticket, and pitch text, and submits the form
- **THEN** the system triggers `useCreateCampaignMutation`, creates the campaign draft, closes the modal, and refreshes the campaigns list

#### Scenario: Validation on missing required fields
- **WHEN** the entrepreneur attempts to submit without specifying a category or target amount
- **THEN** the system prevents submission and indicates the required fields

### Requirement: Milestone Management Integration
The system SHALL allow entrepreneurs to attach structured milestones to draft campaigns with objective title, deliverables description, target completion date, and funding allocation.

#### Scenario: Adding a milestone to a draft campaign
- **WHEN** the entrepreneur opens the Add Milestone dialog on a draft campaign, enters milestone details, and submits
- **THEN** the system invokes `useAddMilestoneMutation`, appends the milestone to the campaign record, and reflects the updated milestone count in the UI

### Requirement: Campaign Submission for Admin Review
The system SHALL allow entrepreneurs to transition draft campaigns to `UNDER_REVIEW` status when ready for compliance and platform verification.

#### Scenario: Submitting campaign for review
- **WHEN** the entrepreneur clicks "Submit for Review" on a draft campaign
- **THEN** the system calls `useSubmitCampaignForReviewMutation`, transitions the campaign status to `UNDER_REVIEW`, and updates the badge to amber
