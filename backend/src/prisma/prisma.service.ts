import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { parse } from 'pg-connection-string';
import { execSync } from 'child_process';
import * as net from 'net';
import { env } from '../common/config/env.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static pool: Pool;
  private static adapter: PrismaPg;

  constructor() {
    if (!PrismaService.pool) {
      const config = parse(env.DATABASE_URL);
      const originalHost = config.host;

      if (originalHost && !net.isIP(originalHost)) {
        try {
          const resolved = execSync(
            `host -t A ${originalHost} | grep "has address" | head -n1 | awk '{print $NF}'`,
            { timeout: 2000 }
          ).toString().trim();
          if (resolved && net.isIP(resolved)) {
            config.host = resolved;
          }
        } catch (err) {
          // Fall back to original host if DNS lookup command fails or times out
        }
      }

      const isSsl = env.DATABASE_URL.includes('sslmode=') || env.DATABASE_URL.includes('ssl=');

      PrismaService.pool = new Pool({
        host: config.host || undefined,
        port: config.port ? parseInt(config.port, 10) : 5432,
        user: config.user || undefined,
        password: config.password || undefined,
        database: config.database || undefined,
        ssl: isSsl ? {
          rejectUnauthorized: false,
          servername: originalHost || undefined,
        } : undefined,
      });

      PrismaService.adapter = new PrismaPg(PrismaService.pool);
    }

    super({
      adapter: PrismaService.adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    if (PrismaService.pool) {
      await PrismaService.pool.end();
    }
  }
}
