## Purpose

Provides a dedicated workspace for verified consultants and advisors on Investra to create and manage advisory offerings (1-on-1 sessions, workshops, courses), coordinate scheduled calls with meeting links, view client enrollments, and track earnings based on the 80/20 platform fee distribution.

## ADDED Requirements

### Requirement: Consultant Workspace Navigation & Routing
The system SHALL provide a dedicated dashboard shell and navigation system for users with the `CONSULTANT` role at `/dashboard/consultant/[section]`.

#### Scenario: Navigating between consultant sections
- **WHEN** an authenticated consultant visits `/dashboard/consultant` or any valid subsection (`services`, `schedule`, `clients`, `earnings`, `settings`)
- **THEN** the system renders the `ConsultantWorkspace` with active navigation indicators and loads the corresponding sub-page.

#### Scenario: Unauthorized or incorrect role access
- **WHEN** a non-consultant user attempts to access `/dashboard/consultant`
- **THEN** the system redirects the user to their respective role dashboard path (e.g., `/dashboard/investor` or `/dashboard/entrepreneur`).

### Requirement: Overview Metrics & Agenda Timeline
The overview section SHALL display real-time summary cards and an upcoming session agenda timeline.

#### Scenario: Inspecting consultant key performance metrics
- **WHEN** the consultant accesses `/dashboard/consultant`
- **THEN** the system displays metrics for Net Earnings, Active/Upcoming Sessions, Unique Clients Reached, and Average Client Rating.

#### Scenario: Quick action to join scheduled call
- **WHEN** the consultant views an upcoming session on the overview timeline
- **THEN** the system displays a "Join Call" button that opens the scheduled Google Meet or Zoom URL in a new tab.

### Requirement: Advisory Offerings & Services Management
The services section SHALL allow consultants to create, edit, pause, and price offerings across 3 formats: 1-on-1 Mentoring, Live Cohort Workshops, and Digital Courses.

#### Scenario: Creating a new advisory offering
- **WHEN** the consultant clicks "New Offering", provides title, description, format type, duration, price, and max capacity, and submits
- **THEN** the system validates the payload, adds the new offering to the consultant's active services list, and displays a success notification.

#### Scenario: Toggling active status of an offering
- **WHEN** the consultant switches the availability toggle of an existing service
- **THEN** the system updates the offering state between Active and Paused.

### Requirement: Calendar, Bookings & Meeting Links
The schedule section SHALL provide an agenda of all booked calls with timing, attendee details, and meeting link management.

#### Scenario: Accessing meeting links
- **WHEN** the consultant views a scheduled session in the calendar agenda
- **THEN** the system displays the attendee's name, booking topic, scheduled time, and options to copy or open the meeting link (Google Meet / Zoom).

#### Scenario: Marking session status
- **WHEN** a session concludes and the consultant marks it as "Completed"
- **THEN** the session status updates to Completed and reflects in the completed session count.

### Requirement: Clients & Learners Directory
The clients section SHALL list all entrepreneurs and investors who have booked advisory sessions with this consultant.

#### Scenario: Viewing client details and meeting notes
- **WHEN** the consultant visits `/dashboard/consultant/clients`
- **THEN** the system displays client profile cards showing name, role (Entrepreneur or Investor), startup/fund affiliation, session history, and meeting notes.

### Requirement: 80/20 Revenue Distribution & Payouts Breakdown
The earnings section SHALL calculate and present gross revenue, the 20% Investra platform service fee, and the net 80% consultant payout balance.

#### Scenario: Displaying fee breakdown
- **WHEN** the consultant visits `/dashboard/consultant/earnings`
- **THEN** the system displays Gross Bookings, Platform Fee (-20%), Net Payout Balance (80%), and a table of transaction records with payout status.

### Requirement: Advisory Profile & Credentials Settings
The settings section SHALL allow consultants to update their professional bio, headline, hourly rate, credentials, and verification documents.

#### Scenario: Updating hourly rate and advisory profile
- **WHEN** the consultant edits their hourly rate and bio in `/dashboard/consultant/settings` and clicks save
- **THEN** the system persists the updated fields and reflects the new hourly rate across their public offerings.

### Requirement: State Resilience & Curated Fallback Support
The workspace SHALL include curated fallback data to ensure interactive fidelity when backend data is loading or empty in dev/staging environments.

#### Scenario: Fallback data rendering in offline or dev mode
- **WHEN** the API returns empty results or is temporarily unavailable
- **THEN** the workspace gracefully populates with curated sample sessions, offerings, and earnings so the UI remains fully testable without breaking.
