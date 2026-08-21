import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { MailModule } from '../mail/mail.module';
import { AuthRateLimitGuard } from './guards/auth-rate-limit.guard';
import { CsrfOriginGuard } from '../../common/guards/csrf-origin.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    AuthRateLimitGuard,
    CsrfOriginGuard,
    RolesGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
