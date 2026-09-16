## Purpose

Facilitates direct introduction requests and connection notes between accredited investors and startup founders without on-platform payment or escrow processing.

## ADDED Requirements

### Requirement: Direct Introduction Request Action
The system SHALL provide a "Connect with Founder" or "Request Intro" action on campaign detail pages and opportunity cards, allowing accredited investors to express interest and initiate discussions.

#### Scenario: Submitting an introduction request
- **WHEN** an investor clicks "Connect with Founder", enters an intro note or meeting preference, and submits the modal form
- **THEN** the system logs the connection request and confirms that the founder has been notified of the investor's interest

#### Scenario: Non-monetary interaction guarantee
- **WHEN** an investor interacts with a campaign or completes an intro request
- **THEN** the system does NOT prompt for payment gateway details, credit card numbers, or escrow transfer instructions
