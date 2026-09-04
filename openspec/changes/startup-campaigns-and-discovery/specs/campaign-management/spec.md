## Purpose

Enables registered entrepreneurs to create, update, manage, and submit fundraising campaigns with financial metrics, pitch materials, and trackable milestones.

## ADDED Requirements

### Requirement: Campaign Creation and Drafting
The system SHALL allow authenticated entrepreneurs to create fundraising campaigns in DRAFT status with target funding amount, minimum ticket size, business stage, industry category, and pitch summary.

#### Scenario: Successful campaign creation
- **WHEN** an authenticated entrepreneur submits valid campaign details with required fields (title, category, stage, targetAmount, minInvestment, pitchText)
- **THEN** the system creates a new campaign in DRAFT status associated with the entrepreneur and returns the created campaign record

#### Scenario: Unauthorized role attempts campaign creation
- **WHEN** a non-entrepreneur user (e.g. investor) attempts to create a campaign
- **THEN** the system rejects the request with a 403 Forbidden status

### Requirement: Campaign Pitch Deck and Milestones
The system SHALL allow entrepreneurs to attach pitch decks, gallery image URLs, and sequential milestone objectives to draft campaigns.

#### Scenario: Adding milestones to a campaign
- **WHEN** an entrepreneur adds a milestone with title, target date, and required funding allocation
- **THEN** the system persists the milestone attached to the campaign and returns the updated milestone list

#### Scenario: Updating milestone completion status
- **WHEN** an entrepreneur marks an active milestone as achieved with supporting proof notes
- **THEN** the system updates the milestone record and recalculates campaign execution progress

### Requirement: Campaign Moderation Submission
The system SHALL provide a submission workflow allowing entrepreneurs to submit draft campaigns for admin review, locking direct edits during review.

#### Scenario: Submitting campaign for review
- **WHEN** an entrepreneur submits a DRAFT campaign with all mandatory fields and at least one milestone
- **THEN** the system transitions the campaign status to UNDER_REVIEW and notifies administrators

#### Scenario: Admin approves campaign
- **WHEN** an administrator approves a campaign in UNDER_REVIEW status
- **THEN** the system updates the campaign status to ACTIVE and makes it discoverable in the public directory
