## Purpose

Provides an enterprise-grade, dual-bucket direct-to-storage media management capability utilizing Cloudflare R2 for uploading, organizing, accessing, replacing, and validating user images, startup pitch decks, confidential KYC documents, and pitch videos with zero server binary load.

## ADDED Requirements

### Requirement: Server-Enforced Media Category Policy and Presigned PUT URL Issuance
The system SHALL provide an authenticated API endpoint that accepts upload initiation metadata (`fileName`, `fileType`, `fileSize`, `category`), validates against a centralized server-side policy, and generates a time-limited Presigned PUT URL targeted at either the Public or Private R2 bucket without streaming binary payloads through NestJS.

#### Scenario: Valid public upload initiation
- **WHEN** an authenticated user requests a presigned upload URL for category `AVATAR`, `CAMPAIGN_COVER`, or `CAMPAIGN_GALLERY` with valid metadata
- **THEN** the system SHALL create a `MediaFile` record with `accessType: PUBLIC`, `status: PENDING_UPLOAD`, target the Public R2 bucket, and return a presigned PUT URL valid for 15 minutes.

#### Scenario: Valid private upload initiation
- **WHEN** an authenticated user requests a presigned upload URL for category `KYC_DOCUMENT`, `CONFIDENTIAL_PITCH_DECK`, or `FINANCIAL_REPORT` with valid metadata
- **THEN** the system SHALL create a `MediaFile` record with `accessType: PRIVATE`, `status: PENDING_UPLOAD`, target the Private R2 bucket, and return a presigned PUT URL valid for 15 minutes.

#### Scenario: File exceeding category maximum
- **WHEN** a user requests an upload URL with `fileSize` exceeding the category cap (Avatar > 5MB, PDF > 50MB, or Video > 100MB)
- **THEN** the system SHALL reject the request with HTTP 400 Bad Request stating the maximum permitted file size.

#### Scenario: Unsupported MIME type
- **WHEN** a user requests an upload URL with an unwhitelisted MIME type or prohibited file extension
- **THEN** the system SHALL reject the request with HTTP 400 Bad Request indicating the MIME type is not allowed.

#### Scenario: Direct video under 100 MB
- **WHEN** a user initiates an upload for category `VIDEO` with an MP4/WebM MIME type and file size under 100 MB
- **THEN** the system SHALL validate the payload, target the Public R2 bucket under the video prefix, and issue a presigned PUT URL.

### Requirement: Two-Phase Upload Confirmation and HeadObject Verification
The system SHALL require clients to call a confirmation endpoint after completing a direct browser upload, verifying the object's presence and byte size in Cloudflare R2 before transitioning status from `PENDING_UPLOAD` to `UPLOADED`.

#### Scenario: Confirming an object that does not exist
- **WHEN** a client calls `POST /api/v1/media/confirm-upload` for a `mediaId` where the object was never written to Cloudflare R2
- **THEN** the system SHALL receive a 404/NotFound on `HeadObject`, maintain the record in non-active status, and return HTTP 400 indicating upload verification failure.

#### Scenario: Confirming an object with unexpected size
- **WHEN** a client calls confirm-upload where the actual byte size reported by R2 `HeadObject` differs significantly from the pre-declared `sizeBytes`
- **THEN** the system SHALL reject the confirmation with HTTP 400 and prevent the media from transitioning to `UPLOADED`.

#### Scenario: Confirm success results in UPLOADED, not ACTIVE
- **WHEN** a client calls confirm-upload for an existing object matching the expected size and ownership
- **THEN** the system SHALL update the status to `UPLOADED` (NOT `ACTIVE`) and return the verified media record.

### Requirement: Safe Entity Attachment and Media Replacement
The system SHALL promote a `MediaFile` from `UPLOADED` to `ACTIVE` only when its owning business entity is successfully persisted, and SHALL safely replace existing media without premature deletion.

#### Scenario: Parent entity save promotes UPLOADED -> ACTIVE
- **WHEN** a User Profile or Campaign save succeeds referencing an `UPLOADED` media ID
- **THEN** the system SHALL set the entity's foreign key relation and transition the `MediaFile` status from `UPLOADED` to `ACTIVE` with `activatedAt` timestamp.

#### Scenario: Parent entity save failure preserves existing ACTIVE media
- **WHEN** saving the parent entity fails due to validation or database error during an update
- **THEN** the system SHALL roll back the transaction, keeping the existing media `ACTIVE` and the newly uploaded media in `UPLOADED` status without data loss.

#### Scenario: Successful image replacement safely deletes previous media only after commit
- **WHEN** a user replaces an existing `ACTIVE` avatar with a new `UPLOADED` avatar and the transaction commits
- **THEN** the system SHALL associate the new avatar as `ACTIVE`, transition the old avatar to `DELETE_PENDING`, execute `DeleteObject` in R2, and update the old record to `DELETED`.

#### Scenario: R2 deletion failure results in retryable DELETE_PENDING state
- **WHEN** Cloudflare R2 is temporarily unreachable during the deletion of an old replaced asset
- **THEN** the system SHALL leave the old record in `DELETE_PENDING` status so it can be safely purged by the retry cleanup routine.

### Requirement: Explicit Media Deletion and Cancellation
The system SHALL allow authenticated owners to explicitly delete uploaded or active media files through an authenticated API endpoint.

#### Scenario: User removes an uploaded but uncommitted media item
- **WHEN** a user uploads a temporary file in the frontend uploader and clicks "Remove" before saving the form
- **THEN** the frontend SHALL invoke `DELETE /api/v1/media/:id`, and the backend SHALL verify ownership, remove the object from R2, and finalize the record as `DELETED`.

#### Scenario: Browser cancellation of an in-flight R2 PUT
- **WHEN** a user clicks "Cancel" while a direct browser-to-R2 upload is currently in progress
- **THEN** the frontend SHALL abort the `XMLHttpRequest` immediately and notify the user that upload was halted.

### Requirement: Dual-Bucket Access Control Segregation
The system SHALL serve public assets directly via derived URLs and restrict private assets to authenticated, authorized users via temporary presigned GET URLs.

#### Scenario: Public asset URL is derived directly and requires no signed GET
- **WHEN** any client views a public media asset (`accessType: PUBLIC`)
- **THEN** the system SHALL derive the URL directly as `R2_PUBLIC_URL + "/" + key` without invoking NestJS signed URL APIs or backend proxying.

#### Scenario: Authorized private owner views private media through temporary signed GET
- **WHEN** an authenticated user who owns a private document requests a viewing URL via `GET /api/v1/media/:id/signed-url`
- **THEN** the system SHALL verify ownership, generate a temporary Presigned GET URL expiring in 15 minutes, and return the signed URL for direct browser access.

#### Scenario: Authorized admin/compliance user views KYC through temporary signed GET
- **WHEN** an administrator or compliance officer requests access to a user's private `KYC_DOCUMENT`
- **THEN** the system SHALL verify compliance permissions, issue an expiring Presigned GET URL, and return it without proxying binary content through NestJS.

#### Scenario: Unauthorized private media request returns 403
- **WHEN** an unauthenticated user or an unauthorized user attempts to obtain a signed URL for a private document
- **THEN** the system SHALL reject the request with HTTP 403 Forbidden.

#### Scenario: Expired signed GET requires generation of a new URL
- **WHEN** a previously issued signed GET URL has passed its 15-minute expiration window
- **THEN** direct browser requests to Cloudflare R2 with that URL SHALL fail with HTTP 403/AccessDenied until the client requests a fresh signed URL from NestJS.

### Requirement: Free-Hosting-Compatible Orphan Cleanup
The system SHALL provide an idempotent cleanup mechanism to safely delete abandoned `PENDING_UPLOAD` and unattached `UPLOADED` records older than the 24-hour retention window.

#### Scenario: Abandoned PENDING_UPLOAD cleanup
- **WHEN** a media record remains in `PENDING_UPLOAD` status for longer than 24 hours without confirmation
- **THEN** the cleanup routine SHALL mark the record as `DELETED` and delete any partial object in R2 if present.

#### Scenario: Abandoned UPLOADED-but-unattached cleanup
- **WHEN** an upload is confirmed (`UPLOADED`) but never attached to an `ACTIVE` business entity within 24 hours
- **THEN** the cleanup routine SHALL delete the object from R2 and update the record status to `DELETED`.

### Requirement: External Presentation Video Handling
The system SHALL support external video presentations hosted on YouTube or Vimeo as an alternative to direct R2 video storage.

#### Scenario: Valid YouTube/Vimeo fallback
- **WHEN** a campaign creator submits an external pitch video URL from YouTube or Vimeo
- **THEN** the system SHALL validate the URL against whitelist regex patterns, store the video link and provider metadata in the campaign entity, and display the embedded player without creating R2 objects.

### Requirement: Multiple Campaign Gallery Uploads
The system SHALL allow multiple campaign gallery images to be uploaded and attached to a campaign presentation.

#### Scenario: Multiple campaign gallery uploads
- **WHEN** a campaign founder uploads multiple gallery images sequentially or in parallel
- **THEN** the system SHALL issue distinct presigned PUT URLs for each image under category `CAMPAIGN_GALLERY`, confirm each file into `UPLOADED`, and associate all confirmed media into the campaign gallery upon campaign save.
