import * as dotenv from 'dotenv';
import * as path from 'path';
import { z } from 'zod';

// Load the .env file from the project working directory
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Define a type-safe schema for environment variables using Zod
const envSchema = z.object({
  // Environment (development, production, test)
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Server Port
  PORT: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : 3000),
    z.number().default(3000),
  ),

  // Frontend URL (for CORS config)
  FRONTEND_URL: z
    .string()
    .url('FRONTEND_URL must be a valid URL')
    .default('http://localhost:5173'),

  // Database Connection URL
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL connection string is required'),

  // JWT Authentication Configuration
  JWT_SECRET: z
    .string()
    .min(8, 'JWT_SECRET must be at least 8 characters long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

// Run validation at startup to fail-fast if settings are incorrect
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n❌ Invalid environment configuration variables:');
  const formattedErrors = parsed.error.format();
  
  // Print each error cleanly
  Object.entries(formattedErrors).forEach(([key, value]) => {
    if (key !== '_errors' && value && '_errors' in value) {
      console.error(`   - ${key}: ${value._errors.join(', ')}`);
    }
  });
  console.error('\nPlease verify your .env file settings.\n');
  process.exit(1);
}

// Export the validated, typed environment object
export const env = parsed.data;

// Export the inferred type for type-safety elsewhere if needed
export type EnvConfig = z.infer<typeof envSchema>;
