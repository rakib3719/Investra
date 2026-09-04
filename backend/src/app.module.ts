import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { customValidationPipe } from './common/pipes/custom-validation.pipe';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { VisitorInsightsModule } from './modules/visitor-insights/visitor-insights.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';

@Module({
  imports: [PrismaModule, AuthModule, ProfileModule, VisitorInsightsModule, CampaignsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: customValidationPipe,
    },
  ],
})
export class AppModule {}
