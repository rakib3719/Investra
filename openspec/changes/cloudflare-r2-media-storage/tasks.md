## 1. Environment & Storage Infrastructure Setup

- [x] 1.1 Add dual-bucket R2 environment variables (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_PUBLIC_BUCKET_NAME`, `R2_PRIVATE_BUCKET_NAME`, `R2_PUBLIC_URL`) to `backend/.env.example` and add Joi/class-validator validation schema in `backend/src/config/`.
- [x] 1.2 Document Cloudflare R2 CORS configuration (origins, PUT/GET/HEAD methods, ETag header) in a markdown guide `docs/r2-setup-guide.md`.
- [x] 1.3 Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` in `backend/` and verify compilation succeeds.

## 2. Prisma Database Schema & Migration

- [x] 2.1 Update `backend/prisma/schema.prisma` with `MediaCategory`, `MediaAccessType`, `MediaUploadStatus` enums and the `MediaFile` model including `activatedAt` and `deletedAt`.
- [x] 2.2 Add entity relations to Prisma models: `User.avatarMediaId`, `Campaign.coverMediaId`, `Campaign.pitchDeckMediaId`, and relations for campaign gallery and KYC documents.
- [x] 2.3 Run Prisma migration/db push and verify Prisma Client types generate without errors.

## 3. NestJS Backend Media Core & Policies

- [x] 3.1 Implement `media-policy.config.ts` defining centralized policies (target bucket, max size, allowed MIME/extensions, key prefix) for all categories (`AVATAR`, `CAMPAIGN_COVER`, `CAMPAIGN_GALLERY`, `PITCH_DECK`, `CONFIDENTIAL_PITCH_DECK`, `FINANCIAL_REPORT`, `KYC_DOCUMENT`, `VIDEO`).
- [x] 3.2 Implement `R2StorageService` managing S3 client instances for both public and private buckets, supporting presigned PUT generation, presigned GET generation, `HeadObject`, and `DeleteObject`.
- [x] 3.3 Implement `MediaService` containing logic for:
  - Presigned upload issuance with server-controlled category policy enforcement
  - Upload confirmation calling `HeadObject` and setting `UPLOADED`
  - Deriving public URLs (`R2_PUBLIC_URL + "/" + key`)
  - Generating temporary private signed GET URLs with role/ownership authorization
  - Deletion of media records and R2 objects (`DELETE_PENDING` -> `DELETED`)
  - Transactional safe media replacement routine (promoting `UPLOADED` -> `ACTIVE` and queuing old media for deletion)
  - Cleanup routine for stale `PENDING_UPLOAD` and unattached `UPLOADED` records older than 24 hours.

## 4. API Endpoints & Controller Implementation

- [x] 4.1 Implement `MediaController` with the following endpoints protected by `JwtAuthGuard`:
  - `POST /api/v1/media/presign-upload`
  - `POST /api/v1/media/confirm-upload` (transitions to `UPLOADED`)
  - `GET /api/v1/media/:id/signed-url` (for private assets, checks ownership/admin permission)
  - `DELETE /api/v1/media/:id` (removes temporary or owned media)
  - `POST /api/v1/media/internal/cleanup` (protected by `X-CLEANUP-SECRET` for external cron triggers).
- [x] 4.2 Add external video validation service and DTOs for YouTube and Vimeo URLs on campaign presentation models.

## 5. Frontend Reusable Upload Components

- [x] 5.1 Implement client API utility in `frontend/lib/api/media.ts` to request presigned PUT URLs, execute direct browser-to-R2 upload using `XMLHttpRequest` with upload progress events and `AbortController` cancellation, and confirm upload upon completion.
- [x] 5.2 Build `FileUploadDropzone.tsx` in `frontend/components/ui/` with drag-and-drop, category-aware size/MIME validation, animated progress bar, cancel action, and remove action (calling `DELETE /api/v1/media/:id`).
- [x] 5.3 Build `FilePreview.tsx` supporting image thumbnail previews, PDF badges with view/download action, and existing `ACTIVE` media display during replacement.
- [x] 5.4 Integrate `FileUploadDropzone` into User Profile avatar update and Campaign creation forms (cover, pitch deck, and gallery).

## 6. Testing & End-to-End Verification

- [x] 6.1 Unit/Integration tests: Verify presigned PUT generation rejects oversized files or disallowed MIME types.
- [x] 6.2 Unit/Integration tests: Verify `confirm-upload` validates `HeadObject` and transitions status to `UPLOADED` (not `ACTIVE`).
- [x] 6.3 Integration tests: Verify parent entity save promotes `UPLOADED` to `ACTIVE` and safely transitions old media to `DELETE_PENDING` / `DELETED`.
- [x] 6.4 Integration tests: Verify parent entity save failure keeps previous media `ACTIVE` and newly uploaded media `UPLOADED` without data loss.
- [x] 6.5 Security tests: Verify unauthorized requests to private media signed URL return HTTP 403 Forbidden.
- [x] 6.6 Cleanup tests: Verify invoking the cleanup routine purges unattached `UPLOADED` and `PENDING_UPLOAD` records older than 24 hours.
