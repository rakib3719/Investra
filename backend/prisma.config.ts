import { env } from "./src/common/config/env.config";
import { defineConfig } from "prisma/config";

// Prisma migrations need a direct Neon connection, not the pooled endpoint.
const migrationUrl = env.DIRECT_URL.replace("-pooler.", ".");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
});
