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
  NODE_ENV: (process.env.NODE_ENV || 'development') as
    | 'development'
    | 'production'
    | 'test',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  TRUSTED_ORIGINS: (
    process.env.TRUSTED_ORIGINS ||
    process.env.FRONTEND_URL ||
    'http://localhost:3000,http://localhost:3001,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:3001,https://investra-three.vercel.app,https://investra-frontend-4m5v.onrender.com'
  )
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  API_PUBLIC_URL: (process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || '3000'}`).replace(/\/$/, ''),
  DATABASE_URL: process.env.DATABASE_URL || '',
  DIRECT_URL: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS
    ? parseInt(process.env.BCRYPT_ROUNDS, 10)
    : 12,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
  COOKIE_SAME_SITE: (process.env.COOKIE_SAME_SITE ||
    (process.env.NODE_ENV === 'production' ? 'none' : 'lax')) as
    | 'lax'
    | 'strict'
    | 'none',
  UPLOADS_DIR: path.resolve(process.cwd(), process.env.UPLOADS_DIR || 'uploads'),
  MAX_AVATAR_FILE_SIZE: process.env.MAX_AVATAR_FILE_SIZE
    ? parseInt(process.env.MAX_AVATAR_FILE_SIZE, 10)
    : 5 * 1024 * 1024,
  VISITOR_HASH_SALT: process.env.VISITOR_HASH_SALT || process.env.JWT_SECRET || '',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
  SMTP_SECURE: process.env.SMTP_SECURE !== 'false',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER || '',

  // Cloudflare R2 Dual-Bucket Storage
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || '',
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '',
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || '',
  R2_ENDPOINT:
    process.env.R2_ENDPOINT ||
    (process.env.R2_ACCOUNT_ID
      ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : ''),
  R2_PUBLIC_BUCKET_NAME: process.env.R2_PUBLIC_BUCKET_NAME || 'investra-media-public',
  R2_PRIVATE_BUCKET_NAME: process.env.R2_PRIVATE_BUCKET_NAME || 'investra-media-private',
  R2_PUBLIC_URL: (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, ''),
  MEDIA_CLEANUP_SECRET: process.env.MEDIA_CLEANUP_SECRET || 'dev-cleanup-secret',
};

// Export the inferred type for type-safety elsewhere
export type EnvConfig = typeof env;

export function isAllowedOrigin(origin?: string | null): boolean {
  if (!origin) return true;
  const normalizedOrigin = origin.trim().replace(/\/+$/, '');
  if (
    env.TRUSTED_ORIGINS.includes(normalizedOrigin) ||
    env.TRUSTED_ORIGINS.includes('*') ||
    normalizedOrigin.endsWith('.vercel.app') ||
    normalizedOrigin === 'https://investra-three.vercel.app'
  ) {
    return true;
  }
  // Allow any localhost / 127.0.0.1 origin during development
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
    return true;
  }
  return false;
}
