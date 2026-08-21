import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AvatarUploadService } from './avatar-upload.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, AvatarUploadService],
})
export class ProfileModule {}
