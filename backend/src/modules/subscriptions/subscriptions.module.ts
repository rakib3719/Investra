import { Module } from '@nestjs/common';
import {
  SubscriptionsPublicController,
  SubscriptionsAdminController,
} from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionsPublicController, SubscriptionsAdminController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
