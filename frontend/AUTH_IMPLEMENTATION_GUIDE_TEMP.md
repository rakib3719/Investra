# Investra frontend authentication — temporary implementation guide

## Status

The cookie-first implementation described below is now in place. The guide remains as a temporary map of the code and architectural decisions.

## Recommendation

Use **cookie-first authentication with the current NestJS API** for the first implementation.

The backend already sets `accessToken` and `refreshToken` as `HttpOnly` cookies. The frontend should call the API with `credentials: "include"` and **must not** save either JWT in `localStorage`, `sessionStorage`, React state, or an ordinary cookie. This is the smallest change, works with the existing backend, and is substantially safer than browser-stored JWTs.

Current local URLs:

- Frontend: `http://localhost:3001`
- API: `http://localhost:8080`
- API base environment variable: `NEXT_PUBLIC_API_URL`

## What exists in the backend now

| Action | Endpoint | Request body | Important response data |
| --- | --- | --- | --- |
| Register | `POST /auth/register` | `firstName`, `lastName`, `email`, `password`, `role` | `data.user`, `data.verificationToken` (development only) |
| Login | `POST /auth/login` | `email`, `password` | sets cookies; `data.user` also contains `role` |
| Current user | `GET /auth/me` | none | `data` is the authenticated user |
| Refresh session | `POST /auth/refresh` | none | renews auth cookies |
| Logout | `POST /auth/logout` | none | clears auth cookies |
| Verify email | `POST /auth/verify-email` | `token` | activates the account |
| Forgot/reset password | `POST /auth/forgot-password`, `POST /auth/reset-password` | see backend DTOs | reset flow |

Successful API responses are wrapped as:

```ts
{ success: true, statusCode: 200, message: string, data: T, timestamp: string }
```

So frontend code should read `response.data`, not `response.user` directly.

## Three ways to implement it

### Option A — direct browser-to-Nest API cookies (recommended now)

Client components call `http://localhost:8080/auth/*` directly with `credentials: "include"`.

- Pros: Fits the current backend immediately; little code; HttpOnly cookies protect tokens from JavaScript/XSS theft.
- Cons: Protected pages need client-side loading/redirect checks; for production, CORS and cookie-domain settings must remain correct.
- Best for: This current project and an MVP.

### Option B — Next.js BFF/proxy authentication

The browser calls Next.js route handlers such as `/api/auth/login`; those handlers call NestJS and manage cookies on the frontend domain.

- Pros: Better SSR/server-side route protection; hides backend URL from browser code; one same-origin API surface.
- Cons: More proxy and cookie-forwarding code; the backend cookie policy should be designed with the proxy.
- Best for: A production phase where dashboards need SEO/SSR or strong server-side protection.

### Option C — bearer access token in memory + refresh cookie

Keep only a short-lived access token in a React provider; use the HttpOnly refresh cookie to get a new one after reload/401.

- Pros: Can attach an `Authorization` header to every request; avoids persistent browser storage.
- Cons: More complicated than Option A and unnecessary because the current API already accepts auth cookies.
- Best for: A later mobile app or a different API gateway requirement.

Do **not** choose a fourth common shortcut: putting access/refresh tokens in `localStorage`. It makes an XSS issue an account-takeover issue.

## Recommended frontend structure

```text
lib/
  api.ts                 # fetch wrapper: API base URL, JSON, credentials, errors
  auth.ts                # login/register/me/logout/refresh API functions + types
components/auth/
  AuthProvider.tsx       # current user, loading state, refresh/me on app boot
  RequireAuth.tsx        # client-side protected-route guard
  RoleGate.tsx           # verifies allowed roles for a route/feature
app/
  login/page.tsx         # connect existing form to login()
  register/page.tsx      # connect existing form to register()
  verify-email/page.tsx  # read token and call verify-email
  forgot-password/page.tsx
  reset-password/page.tsx
  dashboard/investor/page.tsx
  dashboard/entrepreneur/page.tsx
  dashboard/consultant/page.tsx
```

## Rules for the investor–entrepreneur platform

1. **Role is assigned at registration only.** The register form must send backend enum values exactly: `INVESTOR`, `ENTREPRENEUR`, or `CONSULTANT`.
2. **Do not trust a role selected on the login screen.** Login should send only email and password. Read `data.user.role` returned by the server, then redirect to the correct dashboard. The current login role pills can stay as an informational filter/UX element, but must not grant permissions.
3. **Backend always remains the authority.** `RoleGate` improves UI, but every investor-only/entrepreneur-only API endpoint must later enforce a backend role guard too.
4. **Use a verification step after registration.** The current backend creates accounts as `PENDING` and returns a verification token only for testing. Production should email a verification link instead of exposing that token in JSON.
5. **Use the server response for account status.** Show a useful pending/blocked/suspended screen rather than assuming every successful login is active.

## Existing UI changes required

The frontend pages are currently visual-only:

- `app/login/page.tsx` currently displays an `alert`; replace it with `await login({ email, password })`, error UI, loading UI, and role-based redirect.
- `app/register/page.tsx` currently has one `fullName` field; split it into `firstName` and `lastName`, map the displayed role to the backend enum, call register, then move to verification/onboarding.
- Add one shared `AuthProvider` in the root layout and call `GET /auth/me` once when it loads. On a `401`, try `POST /auth/refresh` once, then retry `/auth/me`; if it still fails, treat the visitor as signed out.
- Logout should call `POST /auth/logout` with `credentials: "include"`, clear only frontend user state, then route to `/` or `/login`.

## API wrapper requirements

Every call needs these defaults:

```ts
fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
  credentials: "include",
  headers: { Accept: "application/json" },
});
```

For JSON POST requests also send `Content-Type: application/json`. Parse non-2xx responses and show their backend message; do not show raw JWTs, passwords, or database errors to users.

## Suggested implementation order

1. Add `lib/api.ts` and typed `lib/auth.ts`.
2. Replace the login page alert with real login + redirect by server-returned role.
3. Replace registration alert, split the name field, and create a simple verify-email page.
4. Add `AuthProvider`, loading state, logout, and `/auth/me` session restore.
5. Create separate dashboards and protect each with `RequireAuth` + `RoleGate`.
6. Before production, move verification/reset tokens to email, do not return login tokens in JSON, and add CSRF protection for cookie-authenticated write endpoints.

## Backend items to decide before production

- The login service currently permits a `PENDING` account to login; decide whether it should require email verification before issuing a session.
- Login and refresh return only safe response data; access and refresh JWTs stay in HttpOnly cookies.
- Add role guards to every protected resource endpoint—not only on the frontend.
- Set production cookie attributes deliberately: `secure: true`, appropriate `sameSite`, domain policy, HTTPS, and a precise CORS allowlist.

This file is temporary planning documentation. Once implementation begins and the architecture is accepted, it can be replaced by project documentation or removed.
