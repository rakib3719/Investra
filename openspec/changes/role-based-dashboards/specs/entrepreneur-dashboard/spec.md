## Purpose

Enables entrepreneurs (Uddokta) to create and manage fundraising campaigns, track investor engagement telemetry, manage pitch decks, review incoming investor inquiries, and book mentorship sessions.

## ADDED Requirements

### Requirement: Campaign Overview and Performance Telemetry
The system SHALL present an entrepreneur overview dashboard showing live campaign funding progress, total page views, investor bookmark counts, and pending investor messages.

#### Scenario: Entrepreneur views dashboard home
- **WHEN** an authenticated entrepreneur opens `/dashboard/entrepreneur`
- **THEN** progress bars for active campaigns, engagement telemetry, and recent investor interactions are displayed.

### Requirement: Campaign Creation and Management
The system SHALL provide a multi-step business campaign submission interface capturing business name, category, stage, funding target, minimum ticket size, equity offered, pitch deck URL, and gallery media.

#### Scenario: Submitting a new campaign
- **WHEN** an entrepreneur completes and submits the campaign form with valid business metrics
- **THEN** the campaign is created in `PENDING` or `ACTIVE` status and added to the entrepreneur's campaign management list.

### Requirement: Investor Inquiries and Chat Requests
The system SHALL display incoming connection and chat requests from interested investors, allowing entrepreneurs to accept, review investor profiles, or reply.

#### Scenario: Reviewing investor inquiry
- **WHEN** an investor submits a connection inquiry regarding a campaign
- **THEN** the inquiry appears in the entrepreneur's inquiries inbox with investor credentials and message preview.

### Requirement: Mentorship and Pitch Advisory Booking
The system SHALL allow entrepreneurs to browse verified consultants, check availability, and schedule advisory sessions for pitch refinement and financial modeling.

#### Scenario: Booking consultant for pitch review
- **WHEN** an entrepreneur selects a consultant and confirms a session slot
- **THEN** the session is scheduled and added to the entrepreneur's upcoming mentorship calendar.
