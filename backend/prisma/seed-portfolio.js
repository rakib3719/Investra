/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();

const { PrismaClient, PortfolioItemType, BusinessStage } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function seedPortfolio() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    console.log('Connecting to database...');
    // Find investor users
    const investors = await prisma.user.findMany({
      where: {
        role: 'INVESTOR',
      },
      select: { id: true, email: true, username: true },
    });

    if (investors.length === 0) {
      console.log('No investors found in DB.');
      return;
    }

    console.log(`Found ${investors.length} investor(s). Seeding portfolios...`);

    for (const inv of investors) {
      // 1. Upsert InvestorProfile
      const profile = await prisma.investorProfile.upsert({
        where: { userId: inv.id },
        update: {
          headline: 'Venture Partner & Angel Syndicate Lead • FinTech & Climate Infrastructure',
          companyName: 'Northstar Horizon Ventures',
          designation: 'Managing Partner',
          investmentRangeMin: 50000,
          investmentRangeMax: 500000,
          yearsOfExperience: 9,
          accreditedInvestor: true,
          verificationStatus: 'VERIFIED',
          preferredStage: BusinessStage.GROWTH,
          investmentThesis:
            'We back visionary founders leveraging modular banking APIs, distributed clean-tech grids, and AI workflow automation across emerging and high-growth markets. We lead or co-invest in Seed and Series A rounds with high governance standards, providing hands-on capital allocation, regulatory licensing counsel, and cross-border expansion support.',
          linkedinUrl: 'https://linkedin.com/in/syedrakibhasan',
          twitterUrl: 'https://x.com/syedrakibhasan',
          crunchbaseUrl: 'https://crunchbase.com/person/syed-rakib-hasan',
          websiteUrl: 'https://investra.io',
          videoIntroUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sectors: ['FinTech', 'CleanTech', 'SaaS', 'AI & Automation', 'AgriTech'],
          totalInvestmentsCount: 8,
          totalExitsCount: 3,
          totalCapitalDeployed: 2850000,
        },
        create: {
          userId: inv.id,
          headline: 'Venture Partner & Angel Syndicate Lead • FinTech & Climate Infrastructure',
          companyName: 'Northstar Horizon Ventures',
          designation: 'Managing Partner',
          investmentRangeMin: 50000,
          investmentRangeMax: 500000,
          yearsOfExperience: 9,
          accreditedInvestor: true,
          verificationStatus: 'VERIFIED',
          preferredStage: BusinessStage.GROWTH,
          investmentThesis:
            'We back visionary founders leveraging modular banking APIs, distributed clean-tech grids, and AI workflow automation across emerging and high-growth markets. We lead or co-invest in Seed and Series A rounds with high governance standards, providing hands-on capital allocation, regulatory licensing counsel, and cross-border expansion support.',
          linkedinUrl: 'https://linkedin.com/in/syedrakibhasan',
          twitterUrl: 'https://x.com/syedrakibhasan',
          crunchbaseUrl: 'https://crunchbase.com/person/syed-rakib-hasan',
          websiteUrl: 'https://investra.io',
          videoIntroUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          sectors: ['FinTech', 'CleanTech', 'SaaS', 'AI & Automation', 'AgriTech'],
          totalInvestmentsCount: 8,
          totalExitsCount: 3,
          totalCapitalDeployed: 2850000,
        },
      });

      console.log(`Seeded profile for ${inv.email} (${profile.id})`);

      // 2. Check existing items
      const existingItemsCount = await prisma.investorPortfolioItem.count({
        where: { investorProfileId: profile.id },
      });

      if (existingItemsCount === 0) {
        const sampleHoldings = [
          // Investments
          {
            type: PortfolioItemType.INVESTMENT,
            title: 'Solstice Clean Energy',
            subtitle: 'Lead Seed Syndicate',
            description:
              'Decentralized solar microgrid distribution and real-time smart metering for manufacturing clusters.',
            sector: 'CleanTech',
            stage: 'Series A',
            amountInvested: 185000,
            valuation: 8500000,
            returnMultiple: '3.8x',
            status: 'ACTIVE',
            year: 2022,
            externalUrl: 'https://investra.io',
            isFeatured: true,
            sortOrder: 1,
          },
          {
            type: PortfolioItemType.INVESTMENT,
            title: 'Apex Banking API',
            subtitle: 'Angel Co-Investor',
            description:
              'Core transaction routing infrastructure and micro-merchant settlement engines for South Asian banks.',
            sector: 'FinTech',
            stage: 'Series Seed',
            amountInvested: 250000,
            valuation: 18000000,
            returnMultiple: '7.2x',
            status: 'ACTIVE',
            year: 2021,
            externalUrl: 'https://investra.io',
            isFeatured: true,
            sortOrder: 2,
          },
          {
            type: PortfolioItemType.INVESTMENT,
            title: 'AgriNova Sensor Networks',
            subtitle: 'Early Stage Angel',
            description:
              'Precision IoT sensors monitoring soil nitrogen and automated drip irrigation across 14,000 hectares.',
            sector: 'AgriTech',
            stage: 'Seed',
            amountInvested: 120000,
            valuation: 12000000,
            returnMultiple: '4.5x',
            status: 'EXITED_ACQUISITION',
            year: 2020,
            externalUrl: 'https://investra.io',
            sortOrder: 3,
          },
          {
            type: PortfolioItemType.INVESTMENT,
            title: 'CloudLogix Automated Workflows',
            subtitle: 'Pre-Seed Lead',
            description:
              'Enterprise cloud orchestration and compliance audit automation, successfully acquired by global tech conglomerate.',
            sector: 'SaaS',
            stage: 'Pre-Seed',
            amountInvested: 80000,
            valuation: 45000000,
            returnMultiple: '12.0x',
            status: 'EXITED_IPO',
            year: 2019,
            externalUrl: 'https://investra.io',
            sortOrder: 4,
          },
          // Certifications
          {
            type: PortfolioItemType.CERTIFICATION,
            title: 'Chartered Financial Analyst (CFA) Charterholder',
            subtitle: 'CFA Institute Active Charter',
            description:
              'Global gold standard in investment analysis, asset management, and financial market ethics.',
            issuer: 'CFA Institute',
            credentialId: 'CFA-892147',
            credentialUrl: 'https://cfainstitute.org',
            year: 2018,
            sortOrder: 5,
          },
          {
            type: PortfolioItemType.CERTIFICATION,
            title: 'Accredited Angel Syndicate Lead License',
            subtitle: 'Global Capital Alliance Compliance',
            description:
              'Verified accredited investor and LP syndicate lead compliance credential for private placements.',
            issuer: 'Angel Capital Association & SEC Regulation D',
            credentialId: 'SEC-ACC-2023-998',
            year: 2022,
            sortOrder: 6,
          },
          // Advisory Experience
          {
            type: PortfolioItemType.EXPERIENCE,
            title: 'Managing Partner',
            subtitle: 'Northstar Horizon Ventures',
            description:
              'Heading early-stage cross-border allocations into emerging market financial inclusion and energy grids.',
            sector: 'Venture Capital',
            year: 2019,
            externalUrl: 'https://investra.io',
            sortOrder: 7,
          },
          {
            type: PortfolioItemType.EXPERIENCE,
            title: 'Board Observer & Growth Mentor',
            subtitle: 'Apex Banking API',
            description:
              'Assisting executive leadership in multi-currency regulatory compliance and foreign bank partnerships.',
            sector: 'FinTech',
            year: 2021,
            externalUrl: 'https://investra.io',
            sortOrder: 8,
          },
          // Video Introduction
          {
            type: PortfolioItemType.VIDEO_PRESENTATION,
            title: '2025 Deal Selection Criteria & Founder Pitch Guide',
            subtitle: 'Recorded Founder Masterclass',
            description:
              'A 12-minute deep dive on unit economics, churn mitigation, and what makes a startup stand out in diligence.',
            videoProvider: 'YOUTUBE',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            sortOrder: 9,
          },
        ];

        for (const item of sampleHoldings) {
          await prisma.investorPortfolioItem.create({
            data: {
              ...item,
              investorProfileId: profile.id,
            },
          });
        }
        console.log(`Created ${sampleHoldings.length} portfolio items for ${inv.email}`);
      }
    }

    console.log('Portfolio seeding complete!');
  } catch (err) {
    console.error('Error seeding portfolio:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seedPortfolio();
