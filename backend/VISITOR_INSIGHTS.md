# Automatic visitor insights (testing)

For the testing environment, the homepage records an anonymous visit when it loads. There is no Allow/Disallow banner.

Investra stores:

- parsed browser name/version, operating-system family, and device category;
- language, timezone, screen/viewport size, referrer, and visit time;
- an irreversible salted hash of the request IP for abuse prevention and aggregate analysis.

It does **not** retain raw IP addresses or raw user-agent strings. Browsers do not expose a reliable real-world device name, so the dashboard presents the best privacy-preserving information available (for example, `Mobile`, `Android`, `Chrome`).

Precise latitude/longitude is not requested or recorded automatically.

## Administrator access

Only the `ADMIN` role can call `GET /admin/visitor-insights`, which powers `/dashboard/admin`. The dashboard shows anonymous testing analytics.

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
   SEED_ADMIN_PASSWORD='use-a-unique-8-plus-character-password' \
   npm run db:seed
   ```

The seed is idempotent: if the email already exists, it activates, promotes the account, and updates its password from `SEED_ADMIN_PASSWORD`.
