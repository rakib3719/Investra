import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { R2StorageService } from './r2-storage.service';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MediaController],
  providers: [R2StorageService, MediaService],
  exports: [MediaService, R2StorageService],
})
export class MediaModule {}
