import * as dotenv from 'dotenv';
import * as path from 'path';

// Load the .env file from the project working directory
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Simple validation at startup to make sure critical variables are defined
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'] as const;
const missingEnvVars: string[] = [];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    missingEnvVars.push(key);
  }
}

if (missingEnvVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingEnvVars.forEach((key) => {
    console.error(`   - ${key} is required but not defined.`);
  });
  console.error('\nPlease verify your .env file settings.\n');
  process.exit(1);
}

// Export the typed environment configuration object
export const env = {
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL || '',
  DIRECT_URL: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

// Export the inferred type for type-safety elsewhere
export type EnvConfig = typeof env;

