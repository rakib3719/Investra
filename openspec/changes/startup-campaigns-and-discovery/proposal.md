## Why

Currently, Investra provides an authentication layer and static frontend mockups for startup investment opportunities (`/funds`), but entrepreneurs cannot create or manage real fundraising campaigns, and investors cannot discover, filter, or inspect live startup pitches backed by real database records.

Introducing the core Business Campaign and Discovery capabilities bridges this gap, establishing the primary value proposition of Investra: connecting entrepreneurs with prospective investors through structured, verifiable fundraising campaigns.

## What Changes

- Introduce database models for `Business` (Campaign), `CampaignMilestone`, and `PitchDeck` in Prisma schema with PostgreSQL migrations.
- Build a NestJS `CampaignsModule` with endpoints for creating, updating, publishing, and managing fundraising campaigns.
- Build search, multi-facet filtering (Category, Stage, Target, IRR, Risk), and pagination endpoints for public and investor campaign discovery.
- Implement an Admin moderation queue workflow (`DRAFT` -> `UNDER_REVIEW` -> `ACTIVE` -> `REJECTED` -> `FUNDED` -> `CLOSED`).
- Connect the frontend `/funds` directory to the live backend API using TanStack Query, debounced search, and interactive filter drawers.
- Build the Entrepreneur Campaign Builder Wizard in the entrepreneur dashboard (`/dashboard/entrepreneur/fundraising`) to author pitches, upload decks, and schedule financial milestones.
- Build dynamic Campaign Detail pages (`/funds/[slug]`) displaying real-time funding progress, financial metrics, team details, and pitch materials.

## Capabilities

### New Capabilities
- `campaign-management`: Covers campaign creation, editing, pitch deck attachment, milestone management, and publishing status transitions.
- `campaign-discovery`: Covers public and authenticated campaign listing, faceted filtering, keyword search, sorting, pagination, and campaign detail presentation.

### Modified Capabilities
<!-- None: Initial implementation of campaigns -->

## Impact

- **Backend**: New Prisma models (`Business`, `CampaignMilestone`, `PitchDeck`), new NestJS `CampaignsModule` (`CampaignsController`, `CampaignsService`), validation DTOs, and role guards (`ENTREPRENEUR`, `INVESTOR`, `ADMIN`).
- **Frontend**: API client functions in `frontend/lib/campaigns/`, TanStack Query hooks, real-time data integration in `frontend/app/funds/page.tsx`, `frontend/app/funds/[slug]/page.tsx`, and entrepreneur dashboard campaign editor.
- **Database**: New tables `businesses`, `campaign_milestones`, `pitch_decks` with foreign key relations to `users` and `categories`.
