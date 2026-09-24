import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AvatarUploadService } from './avatar-upload.service';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [ProfileController],
  providers: [ProfileService, AvatarUploadService],
})
export class ProfileModule {}
