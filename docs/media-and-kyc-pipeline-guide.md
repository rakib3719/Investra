# Investra Media & KYC Pipeline Architecture Guide

This document provides a comprehensive technical overview of the media storage architecture, direct-to-storage upload pipeline, Cloudflare R2 dual-bucket topology, database persistence model, and KYC compliance workflow.

---

## 1. System Architecture & Philosophy

Investra implements an **Asynchronous Direct-to-Storage Presigned Upload Architecture** backed by **Cloudflare R2** and **PostgreSQL (Neon)**.

### Why Direct-to-Storage?
Traditional file uploads route binary data through the application server (`Client -> Backend -> S3/R2`). In a high-traffic fintech platform, this causes serious bottlenecks:
- Exhausts server memory (RAM) buffering multi-megabyte payloads.
- Blocks Node.js event loops during file parsing.
- Increases latency and risks request timeouts.

Investra solves this by having clients upload **directly** to Cloudflare R2 via cryptographically signed temporary URLs. The backend only signs the permission ticket and logs metadata.

```
┌──────────────┐                  ┌──────────────────┐                  ┌──────────────────┐
│              │ 1. Request URL   │                  │                  │                  │
│              │─────────────────>│  NestJS Backend  │                  │                  │
│              │ <────────────────│                  │                  │                  │
│              │ 2. Presigned PUT └──────────────────┘                  │                  │
│              │                                                        │  Cloudflare R2   │
│ Client (Web) │ 3. Direct Binary PUT (Zero Backend Load)               │ (Dual Bucket)    │
│              │───────────────────────────────────────────────────────>│                  │
│              │ <──────────────────────────────────────────────────────│                  │
│              │ 4. 200 OK                                              └──────────────────┘
│              │                                                                  ▲
│              │ 5. Confirm Upload                                                │
│              │─────────────────>┌──────────────────┐                            │
│              │                  │  NestJS Backend  │ 6. Verify (HeadObject)     │
│              │                  │                  │────────────────────────────┘
│              │                  │ 7. Mark ACTIVE   │
│              │ <────────────────│ 8. Return URL    │
│              │                  └──────────────────┘
│              │                            │
│              │                            ▼ 9. Save to User Profile
│              │                  ┌──────────────────┐
│              │                  │ Postgres DB      │
│              │                  │ (users & media)  │
│              │                  └──────────────────┘
```

---

## 2. Dual-Bucket Storage Isolation

Investra separates assets into two distinct Cloudflare R2 buckets based on security posture:

| Bucket Name | Access Type | Cloudflare CDN Domain | Used For |
| :--- | :--- | :--- | :--- |
| `investra-public` | **Public** (Read via CDN) | `https://pub-e468949c2cb64e5288ea222052def845.r2.dev` | User Avatars, Cover Banners, Campaign Thumbnails, Pitch Gallery Images |
| `investra-private` | **Private** (Encrypted, Zero Public Access) | None (Direct access 403 Forbidden) | KYC Documents (NID, Passport, Tax Returns, Selfie Verification) |

### Key Security Guarantees
1. **Public Assets** are cached at Cloudflare edge locations worldwide, giving sub-50ms load times globally.
2. **Private Assets** can NEVER be accessed directly via any URL. They can ONLY be retrieved via short-lived (15-minute) presigned GET URLs generated on-demand by authorized `ADMIN` or `SUB_ADMIN` accounts.

---

## 3. End-to-End Upload Flow

### Scenario A: Upload During Registration (Pre-Registration)
When a prospective user visits `/register`, they have no JWT token or database user ID yet.

1. **File Selection**:
   - The user selects an avatar or cover banner in the optional "Profile & Cover Photos" section.
   - Client validates file size (Avatar max 5MB, Cover max 10MB) and MIME type (`image/jpeg`, `image/png`, `image/webp`).
2. **Presign Request (`POST /api/v1/media/presign-public`)**:
   - Frontend calls `requestPublicPresignedUpload({ fileName, mimeType, sizeBytes, category: 'AVATAR' })`.
   - Backend creates an unowned `media_files` record with `uploadedById = null` and `status = 'PENDING_UPLOAD'`.
   - Backend generates an R2 object key: `users/public/avatars/<uuid>-<fileName>`.
   - Backend signs an AWS S3 `PutObjectCommand` presigned URL (valid for 15 minutes) and returns `{ mediaId, uploadUrl, key }`.
3. **Direct Binary Upload**:
   - Frontend sends an HTTP `PUT` request directly to `uploadUrl` with the file's raw binary data and `Content-Type: mimeType`.
4. **Confirm Upload (`POST /api/v1/media/confirm-public-upload`)**:
   - Frontend notifies backend with `{ mediaId }`.
   - Backend issues a `HeadObjectCommand` to Cloudflare R2 to verify the object was actually uploaded and its size matches.
   - Backend updates `media_files.status` to `'ACTIVE'` and generates the public CDN URL:
     `https://pub-e468949c2cb64e5288ea222052def845.r2.dev/users/public/avatars/...`
   - Returns `{ id, url, key, status }`.
5. **Account Creation & Ownership Claim (`POST /api/v1/auth/register`)**:
   - When the user clicks "Create account", the registration payload includes:
     ```json
     {
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@investra.io",
       "password": "StrongPassword123!",
       "role": "INVESTOR",
       "avatarMediaId": "7a35e4d2-...",
       "image": "https://pub-e468949c2cb64e5288ea222052def845.r2.dev/users/public/avatars/...",
       "coverMediaId": "3b29f110-...",
       "coverImage": "https://pub-e468949c2cb64e5288ea222052def845.r2.dev/users/public/covers/..."
     }
     ```
   - In `AuthService.register()`, the newly created user automatically claims the orphaned media records:
     `UPDATE media_files SET uploaded_by_id = user.id WHERE id IN (avatarMediaId, coverMediaId)`
   - The user record saves `image` and `cover_image` for immediate profile rendering.

---

### Scenario B: Profile Update in Dashboard (Authenticated)
When an existing user updates their avatar or cover in the dashboard settings:

1. Frontend calls `uploadPublicMediaPipeline()` (or `uploadMediaPipeline()` for private docs).
2. Backend validates the user's JWT (`req.user.id`).
3. Asset is stored under the user's isolated prefix: `users/<userId>/avatars/<uuid>-<fileName>`.
4. After upload confirmation, frontend calls `PATCH /api/v1/profile/me`:
   ```json
   {
     "image": "https://pub-e468949c2cb64e5288ea222052def845.r2.dev/...",
     "avatarMediaId": "uuid",
     "coverImage": "https://pub-e468949c2cb64e5288ea222052def845.r2.dev/...",
     "coverMediaId": "uuid"
   }
   ```
5. Backend updates the `users` row and links `avatar_media_id` and `cover_media_id`.

---

## 4. Database Schema Structure

### `users` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Unique user identifier |
| `image` | `TEXT` | Public CDN URL for avatar (`https://pub-e468949c2cb64e5288ea222052def845.r2.dev/...`) |
| `avatar_media_id` | `UUID` (FK) | References `media_files.id` |
| `cover_image` | `TEXT` | Public CDN URL for profile cover banner |
| `cover_media_id` | `UUID` (FK) | References `media_files.id` |

### `media_files` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Media file identifier |
| `bucket` | `VARCHAR(100)` | Target bucket (`investra-public` or `investra-private`) |
| `key` | `VARCHAR(500)` | R2 storage object key path |
| `file_name` | `VARCHAR(255)` | Original client file name sanitized |
| `mime_type` | `VARCHAR(100)` | MIME type (e.g. `image/jpeg`, `application/pdf`) |
| `size_bytes` | `BIGINT` | File size in bytes |
| `category` | `VARCHAR(50)` | `AVATAR`, `CAMPAIGN_COVER`, `KYC_DOCUMENT`, etc. |
| `status` | `VARCHAR(50)` | `PENDING_UPLOAD`, `UPLOADED`, `ACTIVE`, `DELETE_PENDING`, `DELETED` |
| `uploaded_by_id` | `UUID` (FK, Nullable) | References `users.id`. Nullable to allow pre-registration uploads |
| `public_url` | `TEXT` | Full public CDN URL if stored in public bucket, otherwise `null` |
| `created_at` | `TIMESTAMP` | Upload timestamp |
| `updated_at` | `TIMESTAMP` | Last status modification timestamp |

---

## 5. How Media is Displayed & Retrieved

### 1. Public Media (Avatars & Covers)
Because avatars and covers live in `investra-public` and have Cloudflare CDN enabled:
- The backend stores and returns the full URL: `https://pub-e468949c2cb64e5288ea222052def845.r2.dev/users/...`
- The Next.js frontend renders them directly using standard `<img>` or `<Image>` components:
  ```tsx
  <img
    src={user.image || '/images/default-avatar.png'}
    alt="User Avatar"
    className="h-20 w-20 rounded-full object-cover"
  />
  ```
- **CDN Edge Caching**: Cloudflare caches the image across hundreds of edge locations. Subsequent loads take milliseconds and use 0 backend CPU or bandwidth.

### 2. Private Media (KYC Verification Documents)
Because KYC documents are strictly confidential (passports, national IDs, tax documents):
- The `public_url` in the database is strictly `null`.
- If a client attempts to access `https://pub-e468949c2cb64e5288ea222052def845.r2.dev/kyc/...`, Cloudflare returns `404 Not Found` or `403 Forbidden` because the private bucket does not have public read access enabled.
- **Admin Review Flow**:
  1. An authorized compliance officer (`ADMIN` or `SUB_ADMIN`) views a user's verification application in the Admin Dashboard.
  2. The frontend calls `GET /api/v1/media/:mediaId/access-url`.
  3. The backend checks `RolesGuard`: only `ADMIN` or the owning user can request access.
  4. The backend issues an AWS S3 `GetObjectCommand` presigned URL that expires in **15 minutes**.
  5. The admin's browser views the document via this temporary secure token. Once expired, the URL permanently becomes invalid.

---

## 6. Frontend UI Components Summary

1. **`/register` (Registration Page)**:
   - Contains an expandable **Profile & Cover Photos (Optional)** section.
   - Clean, lightweight dropzone powered by `FileUploadDropzone`.
   - Fully optional: users can register with or without uploading an avatar or cover banner.
2. **`ProfileAvatarCard` (Dashboard Profile Settings)**:
   - Unified component integrated into:
     - Investor Settings (`/dashboard/investor/settings`)
     - Entrepreneur Settings (`/dashboard/entrepreneur/settings`)
     - Admin Settings (`/dashboard/admin/settings`)
     - Standalone Profile Page (`/profile`)
   - Allows users to preview, upload, replace, or delete both their **Profile Avatar** and **Cover Banner**.
3. **`KycVerificationCard` (Dashboard Identity & Compliance)**:
   - Modern fintech-grade verification panel displaying:
     - Current compliance status badge (`UNVERIFIED`, `PENDING_REVIEW`, `VERIFIED`, `REJECTED`).
     - Document upload slots for Government ID (Front & Back) and Proof of Residence.
     - Clear guidelines on acceptable documents and verification turnaround time.
