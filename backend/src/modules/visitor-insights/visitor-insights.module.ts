import { Module } from '@nestjs/common';
import { VisitorInsightsController } from './visitor-insights.controller';
import { VisitorInsightsService } from './visitor-insights.service';
import { VisitorInsightRateLimitGuard } from './visitor-insight-rate-limit.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [VisitorInsightsController],
  providers: [VisitorInsightsService, VisitorInsightRateLimitGuard],
})
export class VisitorInsightsModule {}
