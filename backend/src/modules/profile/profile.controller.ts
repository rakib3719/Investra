import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { env } from '../../common/config/env.config';
import {
  AvatarUploadService,
  avatarFileFilter,
  type AvatarFile,
} from './avatar-upload.service';
import { CsrfOriginGuard } from '../../common/guards/csrf-origin.guard';

interface AuthenticatedUser {
  id: string;
}

@ApiTags('Profile')
@ApiCookieAuth('accessToken')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CsrfOriginGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly avatarUploadService: AvatarUploadService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile and role details' })
  getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.profileService.getMyProfile(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the current user profile and role details' })
  updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateMyProfile(user.id, dto);
  }

  @Post('avatar')
  @ApiOperation({
    summary: 'Upload a profile avatar',
    description:
      'Accepts one JPG, PNG, or WebP image up to 5 MB. Local storage can later be replaced by Cloudinary or Cloudflare R2 without changing the API contract.',
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: env.MAX_AVATAR_FILE_SIZE, files: 1 },
      fileFilter: avatarFileFilter,
    }),
  )
  uploadAvatar(
    @UploadedFile() file: AvatarFile | undefined,
  ) {
    return this.avatarUploadService.upload(file as AvatarFile);
  }
}
