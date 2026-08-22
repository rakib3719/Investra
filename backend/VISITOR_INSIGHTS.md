# Consent-based visitor insights

The homepage has a privacy choice banner. No visitor insight is sent until a visitor chooses **Allow insights**.

With that consent, Investra stores:

- parsed browser name/version, operating-system family, and device category;
- language, timezone, screen/viewport size, referrer, and visit time;
- an irreversible salted hash of the request IP for abuse prevention and aggregate analysis.

It does **not** retain raw IP addresses or raw user-agent strings. Browsers do not expose a reliable real-world device name, so the dashboard presents the best privacy-preserving information available (for example, `Mobile`, `Android`, `Chrome`).

Precise latitude/longitude requires a separate **Share precise location** action and the browser's geolocation permission. It is not requested automatically.

## Administrator access

Only the `ADMIN` role can call `GET /admin/visitor-insights`, which powers `/dashboard/admin`. The dashboard clearly identifies the data as consent-based.

## Deployment

1. Set a unique `VISITOR_HASH_SALT` in the backend environment.
2. Apply the pending migrations:

   ```bash
   cd backend
   npm run prisma:deploy
   ```

3. Create the first administrator without putting a password in source control:

   ```bash
   SEED_ADMIN_EMAIL=admin@gmail.com \
   SEED_ADMIN_PASSWORD='use-a-unique-12-plus-character-password' \
   npm run db:seed
   ```

The seed is idempotent: if the email already exists, it activates and promotes that account but never overwrites its existing password.

Location permission requires HTTPS in production (localhost is exempt by browsers).
