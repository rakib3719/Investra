# Authentication and account security

## Implemented flow

1. Public users can register only as `INVESTOR`, `ENTREPRENEUR`, or `CONSULTANT`.
2. Registration creates a pending role profile and sends an expiring verification link.
3. Email verification activates the account. Unverified, suspended, and blocked accounts cannot log in.
4. Login creates a short-lived access token and a rotating refresh session. Both are HttpOnly cookies; neither is stored in browser storage.
5. A 401 response triggers one shared refresh request, then retries the original browser request.
6. Logout revokes the current refresh session and clears both cookies.
7. Forgot-password links are single-use. Resetting or changing a password revokes every refresh session and invalidates every existing access token using `tokenVersion`.
8. `RolesGuard` plus `@Roles(...)` are ready for any admin-only or role-specific resource.

## Security controls

- Passwords require 12+ characters with uppercase, lowercase, number, and symbol.
- Passwords use bcrypt with 12 rounds by default (`BCRYPT_ROUNDS` is configurable).
- Browser write requests with an untrusted `Origin` are rejected.
- Sensitive auth routes have an in-memory IP rate limit. Replace this with a shared Redis-backed limiter before running multiple API instances.
- Login, reset, and verification responses avoid account-enumeration messages.
- The API disables the `X-Powered-By` header and uses a strict CORS origin allowlist.

## Apply the migration

The `token_version` migration is included but intentionally has not been run against the configured database.

```bash
cd backend
npm run prisma:deploy
```

Run this against the correct environment after taking the usual production backup. Do not use `prisma:reset` in a real environment.

## Cookie and origin configuration

Set these values in the backend environment for deployment:

```env
FRONTEND_URL=https://app.example.com
TRUSTED_ORIGINS=https://app.example.com
API_PUBLIC_URL=https://api.example.com
COOKIE_SAME_SITE=lax
COOKIE_DOMAIN=.example.com
JWT_ACCESS_EXPIRES_IN=15m
JWT_EXPIRES_IN=7d
```

For cross-site cookies, use `COOKIE_SAME_SITE=none` only over HTTPS. Production cookies are always `secure`.

## Local avatar uploads and cloud migration

`POST /profile/avatar` accepts an authenticated `multipart/form-data` field named `image`.

- Accepts JPG, PNG, and WebP only; MIME type, size, and file signatures are validated.
- Limit: 5 MB by default (`MAX_AVATAR_FILE_SIZE`).
- Files are stored in `backend/uploads/avatars`, which is gitignored, and returned as `{ "url": "..." }`.

The frontend only consumes that returned URL. To move to Cloudinary or Cloudflare R2 later, replace the body of `AvatarUploadService.upload()` to upload the verified buffer and return the provider URL. The controller and frontend do not need to change.

## Verification commands

```bash
cd backend && npm test -- --runInBand && npm run test:e2e -- --runInBand && npm run build
cd frontend && npm run lint && npm run build
```
