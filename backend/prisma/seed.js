/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();

const bcrypt = require('bcrypt');
const { PrismaClient, AccountStatus, UserRole } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const primaryAdminEmail = 'admin@gmail.com';
  const primaryAdminPassword = 'admin@123';
  const primaryHashedPassword = await bcrypt.hash(primaryAdminPassword, 12);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const existingPrimary = await prisma.user.findFirst({
      where: {
        OR: [{ email: primaryAdminEmail }, { username: 'admin' }],
      },
    });

    let adminUser;
    if (existingPrimary) {
      adminUser = await prisma.user.update({
        where: { id: existingPrimary.id },
        data: {
          email: primaryAdminEmail,
          password: primaryHashedPassword,
          role: UserRole.ADMIN,
          accountStatus: AccountStatus.ACTIVE,
          isEmailVerified: true,
        },
      });
      console.log(`Administrator ${primaryAdminEmail} is active and updated with password ${primaryAdminPassword}.`);
    } else {
      adminUser = await prisma.user.create({
        data: {
          firstName: 'Platform',
          lastName: 'Admin',
          username: 'admin',
          email: primaryAdminEmail,
          password: primaryHashedPassword,
          role: UserRole.ADMIN,
          accountStatus: AccountStatus.ACTIVE,
          isEmailVerified: true,
        },
      });
      console.log(`Administrator ${primaryAdminEmail} created with password ${primaryAdminPassword}.`);
    }

    // Seed Categories
    const categoriesData = [
      { name: 'FinTech', slug: 'fintech', description: 'Financial technology, payments, and open banking', color: '#10b981', status: 'ACTIVE' },
      { name: 'SaaS', slug: 'saas', description: 'Software as a service, B2B workflows, and cloud infrastructure', color: '#3b82f6', status: 'ACTIVE' },
      { name: 'Clean Energy', slug: 'clean-energy', description: 'Renewable energy, solar microgrids, and green tech', color: '#059669', status: 'ACTIVE' },
      { name: 'AgriTech', slug: 'agritech', description: 'Smart precision agriculture, IoT sensors, and supply chain', color: '#84cc16', status: 'ACTIVE' },
      { name: 'HealthTech', slug: 'healthtech', description: 'Digital health, diagnostic AI, and telehealth solutions', color: '#8b5cf6', status: 'ACTIVE' },
      { name: 'AI & Automation', slug: 'ai-automation', description: 'Enterprise artificial intelligence and robotic automation', color: '#ec4899', status: 'ACTIVE' },
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      const createdCat = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, description: cat.description, color: cat.color, status: cat.status },
        create: { ...cat, createdBy: adminUser.id },
      });
      categoryMap[cat.slug] = createdCat.id;
    }
    console.log('Categories seeded.');

    // Seed Entrepreneurs
    const entrepreneursData = [
      {
        firstName: 'Tariqul',
        lastName: 'Islam',
        username: 'tariqul_founder',
        email: 'tariqul@apexfintech.io',
        companyName: 'Apex FinTech Solutions',
        headline: 'Serial FinTech entrepreneur building banking infrastructure for emerging markets',
      },
      {
        firstName: 'Farhana',
        lastName: 'Rahman',
        username: 'farhana_green',
        email: 'farhana@solargrid.io',
        companyName: 'SolarGrid Technologies',
        headline: 'Renewable energy engineer pioneering microgrid electrification across South Asia',
      },
      {
        firstName: 'Mahmudul',
        lastName: 'Hasan',
        username: 'mahmud_agri',
        email: 'mahmud@cropsense.ai',
        companyName: 'CropSense AI',
        headline: 'Agricultural technologist transforming precision yield farming with computer vision',
      },
    ];

    const entrepreneurMap = {};
    for (const ent of entrepreneursData) {
      const user = await prisma.user.upsert({
        where: { email: ent.email },
        update: { accountStatus: AccountStatus.ACTIVE },
        create: {
          firstName: ent.firstName,
          lastName: ent.lastName,
          username: ent.username,
          email: ent.email,
          password: await bcrypt.hash('Password123!', 12),
          role: UserRole.ENTREPRENEUR,
          accountStatus: AccountStatus.ACTIVE,
          isEmailVerified: true,
          entrepreneurProfile: {
            create: {
              companyName: ent.companyName,
              headline: ent.headline,
              yearsOfExperience: 7,
              verificationStatus: 'VERIFIED',
            },
          },
        },
      });
      entrepreneurMap[ent.email] = user.id;
    }
    console.log('Entrepreneurs seeded.');

    // Seed Sample Campaigns
    const sampleCampaigns = [
      {
        entrepreneurEmail: 'tariqul@apexfintech.io',
        title: 'Apex FinTech Core Banking API',
        slug: 'apex-fintech-core-banking-api',
        tagline: 'Next-gen banking infrastructure API and transaction processing layer for micro-merchants in emerging markets.',
        pitchText: 'Apex FinTech delivers embedded financial services and modular API pipelines designed to scale merchant banking and cross-border remittances across Southeast and South Asia. Our compliant gateway facilitates high-volume, low-latency microtransactions for tier-2 and tier-3 financial institutions.',
        categoryId: categoryMap['fintech'],
        stage: 'GROWTH',
        targetAmount: 1200000,
        raisedAmount: 780000,
        minInvestment: 2500,
        projectedIrr: 18.5,
        valuation: 6500000,
        riskLevel: 'LOW',
        esgRating: 'AA',
        impactMetric: '40K Active Merchants',
        status: 'ACTIVE',
        isFeatured: true,
        bannerImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        ],
        milestones: [
          { title: 'Core Banking Engine v2 Launch', description: 'Scalable ledger system with 99.999% uptime', fundingNeeded: 300000, isCompleted: true, sortOrder: 1 },
          { title: 'Regional Remittance Compliance License', description: 'Central bank approval for cross-border settlements', fundingNeeded: 450000, isCompleted: true, sortOrder: 2 },
          { title: 'Expansion to 100K Active POS Terminals', description: 'Broad commercial rollout to retail networks', fundingNeeded: 450000, isCompleted: false, sortOrder: 3 },
        ],
        pitchDecks: [
          { title: 'Apex FinTech Series A Pitch Deck.pdf', fileUrl: 'https://investra.storage/decks/apex-fintech-series-a.pdf', fileSize: 4200000, version: 2 },
        ],
      },
      {
        entrepreneurEmail: 'farhana@solargrid.io',
        title: 'SolarGrid Bangladesh Ltd',
        slug: 'solargrid-bangladesh-ltd',
        tagline: 'Decentralized smart solar microgrids powering rural industrial clusters with zero carbon emissions.',
        pitchText: 'SolarGrid builds modular microgrid infrastructure and smart metering networks to provide sustainable, 24/7 uninterrupted power to textile and agro-processing clusters. Backed by proprietary load-balancing IoT controllers.',
        categoryId: categoryMap['clean-energy'],
        stage: 'EARLY_STAGE',
        targetAmount: 2000000,
        raisedAmount: 1450000,
        minInvestment: 5000,
        projectedIrr: 22.0,
        valuation: 8000000,
        riskLevel: 'MEDIUM',
        esgRating: 'AAA',
        impactMetric: '12MW Clean Power Delivered',
        status: 'ACTIVE',
        isFeatured: true,
        bannerImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=800&q=80',
        ],
        milestones: [
          { title: 'Phase 1 Solar Array Deployment (5MW)', description: 'Installation of high-efficiency monocrystalline solar panels', fundingNeeded: 800000, isCompleted: true, sortOrder: 1 },
          { title: 'Smart Battery Storage Integration', description: 'LiFePO4 battery banks installed at primary industrial substation', fundingNeeded: 650000, isCompleted: false, sortOrder: 2 },
          { title: 'Phase 2 Regional Interconnection', description: 'Grid feed-in infrastructure connected to national power grid', fundingNeeded: 550000, isCompleted: false, sortOrder: 3 },
        ],
        pitchDecks: [
          { title: 'SolarGrid Investment Memo 2026.pdf', fileUrl: 'https://investra.storage/decks/solargrid-memo.pdf', fileSize: 6800000, version: 1 },
        ],
      },
      {
        entrepreneurEmail: 'mahmud@cropsense.ai',
        title: 'CropSense AI Precision Farming',
        slug: 'cropsense-ai-precision-farming',
        tagline: 'Hyperlocal hyperspectral crop diagnostics and automated irrigation management via satellite and edge drone telemetry.',
        pitchText: 'CropSense empowers 15,000+ smallholder farms with actionable satellite AI diagnostics to prevent pest infestation, optimize NPK fertilizer dosage, and increase seasonal yields by up to 34%.',
        categoryId: categoryMap['agritech'],
        stage: 'MVP',
        targetAmount: 750000,
        raisedAmount: 510000,
        minInvestment: 1000,
        projectedIrr: 25.5,
        valuation: 3200000,
        riskLevel: 'HIGH',
        esgRating: 'AA',
        impactMetric: '15K Farmers Onboarded',
        status: 'ACTIVE',
        isFeatured: true,
        bannerImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
        ],
        milestones: [
          { title: 'AI Model Validation on 50 Sample Plots', description: '94% accuracy in early blast disease detection', fundingNeeded: 150000, isCompleted: true, sortOrder: 1 },
          { title: 'Mobile Farmer App Localization (Bangla & Hindi)', description: 'Offline-first advisory app with voice guidance', fundingNeeded: 250000, isCompleted: true, sortOrder: 2 },
          { title: 'Cooperative Distributor Partnership Rollout', description: 'Integrating with 5 leading fertilizer dealer networks', fundingNeeded: 350000, isCompleted: false, sortOrder: 3 },
        ],
        pitchDecks: [
          { title: 'CropSense AI Deck.pdf', fileUrl: 'https://investra.storage/decks/cropsense-deck.pdf', fileSize: 3100000, version: 1 },
        ],
      },
      {
        entrepreneurEmail: 'tariqul@apexfintech.io',
        title: 'CloudFlow DevOps Automation Engine',
        slug: 'cloudflow-devops-automation-engine',
        tagline: 'Autonomous AI-driven Kubernetes cost optimization and continuous deployment guardrails for enterprise SaaS.',
        pitchText: 'CloudFlow analyzes cloud telemetry in real time, automatically rightsizing container workloads and slashing monthly AWS/GCP bills by an average of 42% while guaranteeing SLA compliance.',
        categoryId: categoryMap['saas'],
        stage: 'EARLY_STAGE',
        targetAmount: 900000,
        raisedAmount: 320000,
        minInvestment: 1500,
        projectedIrr: 20.0,
        valuation: 4500000,
        riskLevel: 'MEDIUM',
        esgRating: 'A',
        impactMetric: '$1.2M Cloud Waste Saved',
        status: 'ACTIVE',
        isFeatured: false,
        bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        gallery: [],
        milestones: [
          { title: 'Multi-Cloud AWS & GCP Agent GA', description: 'Support for EKS and GKE clusters', fundingNeeded: 300000, isCompleted: true, sortOrder: 1 },
          { title: 'SOC 2 Type II Certification', description: 'Enterprise compliance audit completion', fundingNeeded: 200000, isCompleted: false, sortOrder: 2 },
        ],
        pitchDecks: [],
      },
    ];

    for (const camp of sampleCampaigns) {
      const { entrepreneurEmail, milestones, pitchDecks, ...campData } = camp;
      const entrepreneurId = entrepreneurMap[entrepreneurEmail];

      const createdCamp = await prisma.business.upsert({
        where: { slug: camp.slug },
        update: { ...campData, entrepreneurId },
        create: {
          ...campData,
          entrepreneurId,
          milestones: {
            create: milestones || [],
          },
          pitchDecks: {
            create: pitchDecks || [],
          },
        },
      });

      // Ensure milestones exist if updating
      if (milestones && milestones.length > 0) {
        for (const m of milestones) {
          const existingM = await prisma.campaignMilestone.findFirst({
            where: { businessId: createdCamp.id, title: m.title },
          });
          if (!existingM) {
            await prisma.campaignMilestone.create({
              data: { ...m, businessId: createdCamp.id },
            });
          }
        }
      }

      console.log(`Campaign "${createdCamp.title}" seeded successfully.`);
    }

    console.log('✅ Database seeding complete!');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('❌ Seed error:', error.message);
  process.exitCode = 1;
});
