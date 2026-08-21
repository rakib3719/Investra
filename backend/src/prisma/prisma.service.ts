import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from '../common/config/env.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static pool: Pool | null = null;
  private static adapter: PrismaPg | null = null;
  private destroyed = false;

  constructor() {
    // Initialize the pg Pool and PrismaPg adapter if not already initialized
    if (!PrismaService.pool || !PrismaService.adapter) {
      PrismaService.pool = new Pool({
        connectionString: env.DATABASE_URL,
      });
      PrismaService.adapter = new PrismaPg(PrismaService.pool);
    }

    // Pass the adapter to PrismaClient constructor (Prisma 7 requirement)
    super({
      adapter: PrismaService.adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    if (this.destroyed) return;
    this.destroyed = true;

    await this.$disconnect();
    const pool = PrismaService.pool;
    PrismaService.pool = null;
    PrismaService.adapter = null;
    await pool?.end();
  }
}
