# Auth API testing guide

## What is covered

`src/modules/auth/auth.controller.spec.ts` is a Nest Jest **controller unit-test** suite. It covers every `AuthController` route:

- `POST /auth/register`
- `POST /auth/login` (including the secure access and refresh cookies)
- `POST /auth/refresh` (including rotated cookies)
- `POST /auth/logout` (with and without a refresh cookie)
- `POST /auth/verify-email`
- `POST /auth/resend-verification`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`

The suite creates a Nest `TestingModule` and replaces `AuthService` with Jest mocks. Therefore it never connects to Prisma or sends an email. `test/jest.setup.ts` also supplies safe fallback test environment values, so a local `.env` is not required for these unit tests.

## Run the tests

From the `backend` directory:

```bash
# Run only AuthController tests once
npm test -- auth.controller.spec.ts

# Keep the AuthController tests running while you edit
npm run test:watch -- auth.controller.spec.ts

# Run the AuthController suite with coverage
npm run test:cov -- auth.controller.spec.ts

# Run every unit test in src/
npm test
```

## Reading the result

Jest reports each API group separately, for example `POST /auth/login`. A green `PASS` means the controller delegated to the right service method and returned or set the expected response data. A red `FAIL` prints the mismatched value and the exact test line.

## When an AuthController endpoint changes

1. Update the endpoint in `auth.controller.ts`.
2. Find the matching `describe('METHOD /auth/path')` block in `auth.controller.spec.ts`.
3. Update the DTO fixture, mocked service response, and assertions together.
4. Run `npm test -- auth.controller.spec.ts` before committing.

For login, refresh, and logout changes, keep the cookie assertions. They protect the HTTP-only, `sameSite: 'lax'`, and expiry behaviour that should not regress.

## Unit tests vs real HTTP e2e tests

These controller unit tests are fast and isolate routing/controller behaviour. They intentionally mock authentication guards, database access, and mail delivery. Use `npm run test:e2e` for real HTTP-level tests; those tests should point to a dedicated disposable test database and must never use production credentials.
