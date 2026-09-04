## Purpose

Enables consultants to monetize their advisory expertise through 1-on-1 scheduled sessions, group workshops, courses, live meeting links, and 80/20 revenue payout tracking.

## ADDED Requirements

### Requirement: Consultant Earnings and Revenue Telemetry
The system SHALL display the consultant's total earnings, upcoming payout balance calculated with the platform's 80/20 revenue split (80% to consultant, 20% platform fee), and average client rating.

#### Scenario: Consultant views earnings overview
- **WHEN** an authenticated consultant opens `/dashboard/consultant`
- **THEN** total earned revenue, net payout balance (after 20% platform fee deduction), completed session count, and average rating are rendered.

### Requirement: 1-on-1 Consultation Booking & Calendar
The system SHALL provide a consultation management calendar showing booked sessions, client attendee details, topic notes, and live meeting links (Zoom or Google Meet).

#### Scenario: Consultant accesses upcoming session
- **WHEN** a consultant opens their session calendar
- **THEN** upcoming appointments are listed with client name, booked time slot, and a direct "Join Meeting" action button.

### Requirement: Workshop and Masterclass Management
The system SHALL enable consultants to create and publish group workshops and pre-recorded course offerings with defined ticket pricing, schedule, and attendee capacity limits.

#### Scenario: Creating a new workshop
- **WHEN** a consultant fills in workshop title, description, seat capacity, fee, and event date
- **THEN** the workshop is published to the marketplace and listed in the consultant's service portfolio.

### Requirement: Service Rate and Availability Configuration
The system SHALL allow consultants to configure their hourly consultation rate, session fees, workshop fees, course pricing, and weekly available time slots.

#### Scenario: Updating consultation fee
- **WHEN** a consultant updates their session rate in profile settings
- **THEN** the new fee is reflected on their public consultant profile and in booking checkouts.
