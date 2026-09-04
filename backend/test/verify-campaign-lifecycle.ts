import { PrismaClient, CampaignStatus, UserRole, BusinessStage, RiskLevel } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function verifyLifecycle() {
  console.log('🚀 Starting Campaign End-to-End Lifecycle Verification...');
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // 1. Fetch category
    const fintechCat = await prisma.category.findFirst({ where: { slug: 'fintech' } });
    if (!fintechCat) throw new Error('FinTech category not found');
    console.log('✓ Found FinTech category:', fintechCat.name);

    // 2. Fetch or create entrepreneur
    const entrepreneur = await prisma.user.findFirst({
      where: { role: UserRole.ENTREPRENEUR },
    });
    if (!entrepreneur) throw new Error('Entrepreneur user not found');
    console.log('✓ Entrepreneur:', entrepreneur.email);

    // 3. Create Draft Campaign
    const testSlug = `test-payflow-${Date.now()}`;
    const draft = await prisma.business.create({
      data: {
        entrepreneurId: entrepreneur.id,
        title: 'PayFlow NextGen Gateway',
        slug: testSlug,
        tagline: 'High-speed payment router for global marketplaces',
        pitchText: 'PayFlow provides next-generation multi-rail payment rails for cross-border e-commerce.',
        categoryId: fintechCat.id,
        stage: BusinessStage.MVP,
        targetAmount: 600000,
        minInvestment: 2000,
        projectedIrr: 24.5,
        riskLevel: RiskLevel.MEDIUM,
        status: CampaignStatus.DRAFT,
        milestones: {
          create: [
            {
              title: 'Alpha API Release',
              description: 'Sandbox API with simulated settlement',
              fundingNeeded: 200000,
              isCompleted: true,
              sortOrder: 1,
            },
            {
              title: 'Multi-Currency Settlement Engine',
              description: 'Integration with 10 global payment rails',
              fundingNeeded: 400000,
              isCompleted: false,
              sortOrder: 2,
            },
          ],
        },
      },
      include: { milestones: true, category: true },
    });
    console.log('✓ 1. Created draft campaign:', draft.title, '| Status:', draft.status, '| Milestones:', draft.milestones.length);
    if (draft.status !== CampaignStatus.DRAFT) throw new Error('Campaign status should be DRAFT');

    // 4. Verify Public Query excludes DRAFT
    const publicActiveListBefore = await prisma.business.findMany({
      where: { status: CampaignStatus.ACTIVE, slug: testSlug },
    });
    if (publicActiveListBefore.length > 0) throw new Error('DRAFT campaign should NOT appear in public ACTIVE query');
    console.log('✓ 2. Verified DRAFT campaign is hidden from public active directory');

    // 5. Submit for Review
    const underReview = await prisma.business.update({
      where: { id: draft.id },
      data: { status: CampaignStatus.UNDER_REVIEW },
    });
    console.log('✓ 3. Submitted for review. New status:', underReview.status);
    if (underReview.status !== CampaignStatus.UNDER_REVIEW) throw new Error('Status should be UNDER_REVIEW');

    // 6. Admin Approves Campaign
    const approved = await prisma.business.update({
      where: { id: draft.id },
      data: { status: CampaignStatus.ACTIVE, isFeatured: true },
      include: { category: true, milestones: true, entrepreneur: true },
    });
    console.log('✓ 4. Admin approved campaign. New status:', approved.status);
    if (approved.status !== CampaignStatus.ACTIVE) throw new Error('Status should be ACTIVE');

    // 7. Verify Public Directory Query includes approved campaign
    const publicActiveListAfter = await prisma.business.findMany({
      where: {
        status: CampaignStatus.ACTIVE,
        categoryId: fintechCat.id,
        projectedIrr: { gte: 20 },
      },
      include: { category: true, milestones: true },
    });
    const foundInDirectory = publicActiveListAfter.some((c) => c.slug === testSlug);
    if (!foundInDirectory) throw new Error('Approved campaign not found in public directory query');
    console.log('✓ 5. Verified approved campaign is discoverable in public directory with category & IRR filters');

    // 8. Clean up test record
    await prisma.business.delete({ where: { id: draft.id } });
    console.log('✓ 6. Cleanup successful');

    console.log('🎉 All campaign lifecycle verification checks PASSED!');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

verifyLifecycle().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
