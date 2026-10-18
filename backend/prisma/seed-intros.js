/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();

const { PrismaClient, IntroRequestStatus } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function seedIntros() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    console.log('Connecting to database to seed intros...');

    // 1. Find the investor
    const investor = await prisma.user.findFirst({
      where: { email: 'sd.rakib36@gmail.com' },
      include: { investorProfile: true },
    });

    if (!investor) {
      console.log('Investor sd.rakib36@gmail.com not found.');
      return;
    }

    // 2. Find an entrepreneur
    let entrepreneur = await prisma.user.findFirst({
      where: { role: 'ENTREPRENEUR' },
    });

    if (!entrepreneur) {
      // Find any other user
      entrepreneur = await prisma.user.findFirst({
        where: { id: { not: investor.id } },
      });
    }

    if (!entrepreneur) {
      console.log('No entrepreneur user found.');
      return;
    }

    console.log(`Investor: ${investor.email} (${investor.id})`);
    console.log(`Entrepreneur: ${entrepreneur.email} (${entrepreneur.id})`);

    // Ensure entrepreneur has an active subscription for testing
    const existingSub = await prisma.userSubscription.findFirst({
      where: { userId: entrepreneur.id },
    });

    if (!existingSub) {
      console.log('Creating active subscription for entrepreneur...');
      let plan = await prisma.planTier.findFirst({ where: { targetRole: 'ENTREPRENEUR' } });
      if (!plan) {
        plan = await prisma.planTier.create({
          data: {
            slug: 'entrepreneur-pro',
            name: 'Entrepreneur Pro',
            targetRole: 'ENTREPRENEUR',
            priceMonthly: 49.99,
            currency: 'USD',
            isActive: true,
          },
        });
      }

      await prisma.userSubscription.create({
        data: {
          userId: entrepreneur.id,
          planId: plan.id,
          status: 'ACTIVE',
          billingInterval: 'MONTHLY',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          featureSnapshot: { introsAllowed: true, dataRoomAccess: true },
        },
      });
    }

    // 3. Clear existing test intros for this pair to avoid duplicates
    await prisma.investorIntroRequest.deleteMany({
      where: {
        investorId: investor.id,
      },
    });

    // 4. Create 2 realistic deal introductions
    const intro1 = await prisma.investorIntroRequest.create({
      data: {
        entrepreneurId: entrepreneur.id,
        investorId: investor.id,
        investorProfileId: investor.investorProfile?.id || null,
        startupName: 'SolarFlow Grid Analytics',
        pitchMessage:
          'Hi Rakib, we saw your syndicate lead track record in clean energy and distributed infrastructure. We provide AI-driven battery load balancing and solar microgrid forecasting for manufacturing plants. We currently do $42K MRR with 14 paying industrial plants in South Asia and are closing a $600K Seed round.',
        businessOverview:
          'SaaS + hardware IoT gateways. 82% gross margins, 12-month contract lock-ins, zero churn in the last 3 quarters.',
        targetSector: 'CleanTech',
        roundStage: 'Seed',
        raisingAmount: '$600,000',
        deckUrl: 'https://docsend.com/view/solarflow-seed-deck',
        websiteUrl: 'https://solarflow.energy',
        contactEmail: entrepreneur.email,
        contactPhone: '+880 1711 000111',
        status: IntroRequestStatus.PENDING,
      },
    });

    const intro2 = await prisma.investorIntroRequest.create({
      data: {
        entrepreneurId: entrepreneur.id,
        investorId: investor.id,
        investorProfileId: investor.investorProfile?.id || null,
        startupName: 'Apex Ledger Banking API',
        pitchMessage:
          'We built an embedded corporate treasury routing engine for logistics operators. Processing $2.8M in GMV monthly with $18K net revenue. We are raising a $350K Angel syndicate allocation and would love your guidance on fintech regulatory partnerships.',
        businessOverview: 'Transaction take-rate of 0.65% + $499/mo enterprise subscription.',
        targetSector: 'FinTech',
        roundStage: 'Pre-Seed',
        raisingAmount: '$350,000',
        deckUrl: 'https://pitch.com/apex-ledger',
        websiteUrl: 'https://apexledger.io',
        contactEmail: entrepreneur.email,
        contactPhone: '+880 1711 222333',
        status: IntroRequestStatus.PENDING,
      },
    });

    console.log(`Seeded intro 1: ${intro1.startupName} (${intro1.id})`);
    console.log(`Seeded intro 2: ${intro2.startupName} (${intro2.id})`);
    console.log('Seeding finished successfully!');
  } catch (err) {
    console.error('Error seeding intros:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seedIntros();
