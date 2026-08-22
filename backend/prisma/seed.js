/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();

const bcrypt = require('bcrypt');
const { PrismaClient, AccountStatus, UserRole } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password || password.length < 12) {
    throw new Error('Set a 12+ character SEED_ADMIN_PASSWORD before running db:seed.');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          role: UserRole.ADMIN,
          accountStatus: AccountStatus.ACTIVE,
          isEmailVerified: true,
        },
      });
      console.log(`Administrator ${email} is active. Existing password was not changed.`);
      return;
    }

    await prisma.user.create({
      data: {
        firstName: 'Investra',
        lastName: 'Administrator',
        username: 'investraadmin',
        email,
        password: await bcrypt.hash(password, 12),
        role: UserRole.ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        isEmailVerified: true,
      },
    });
    console.log(`Administrator ${email} created.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
