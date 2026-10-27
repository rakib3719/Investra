/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();

const { PrismaClient, SlotStatus } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function seedSlots() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const consultants = await prisma.user.findMany({
      where: { role: 'CONSULTANT' },
      include: { consultantProfile: true },
    });

    console.log(`Found ${consultants.length} consultants. Creating slots...`);

    // Helper to get formatted date string YYYY-MM-DD
    const getDatePlusDays = (days) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    const slotConfigs = [
      { dayOffset: 1, startTime: '10:00', endTime: '11:00' },
      { dayOffset: 1, startTime: '14:00', endTime: '15:00' },
      { dayOffset: 2, startTime: '11:00', endTime: '12:00' },
      { dayOffset: 2, startTime: '16:00', endTime: '17:00' },
      { dayOffset: 3, startTime: '15:00', endTime: '16:00' },
    ];

    for (const c of consultants) {
      // Ensure fees exist
      await prisma.consultantProfile.update({
        where: { userId: c.id },
        data: {
          sessionFee: c.consultantProfile?.sessionFee || 150.0,
          consultationFee: c.consultantProfile?.consultationFee || 150.0,
        },
      });

      for (const cfg of slotConfigs) {
        const slotDate = new Date(`${getDatePlusDays(cfg.dayOffset)}T00:00:00.000Z`);
        await prisma.consultantSlot.upsert({
          where: {
            consultantId_slotDate_startTime: {
              consultantId: c.id,
              slotDate,
              startTime: cfg.startTime,
            },
          },
          update: {
            status: SlotStatus.AVAILABLE,
          },
          create: {
            consultantId: c.id,
            slotDate,
            startTime: cfg.startTime,
            endTime: cfg.endTime,
            durationMinutes: 60,
            status: SlotStatus.AVAILABLE,
          },
        });
      }
      console.log(`Seeded slots for consultant ${c.firstName} ${c.lastName}`);
    }

    console.log('Slots seeded successfully!');
  } catch (error) {
    console.error('Error seeding slots:', error);
  } finally {
    await pool.end();
  }
}

seedSlots();
