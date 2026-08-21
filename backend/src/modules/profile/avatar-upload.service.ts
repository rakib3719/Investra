import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { env } from '../../common/config/env.config';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface AvatarFile {
  buffer: Buffer;
  mimetype: string;
}

export function avatarFileFilter(
  _request: unknown,
  file: AvatarFile,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  callback(null, allowedMimeTypes.has(file.mimetype));
}

@Injectable()
export class AvatarUploadService {
  async upload(file: AvatarFile) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Please select an image to upload');
    }

    const extension = this.getVerifiedExtension(file.buffer);
    if (!extension || extension !== this.extensionForMime(file.mimetype)) {
      throw new BadRequestException('Upload a valid JPG, PNG, or WebP image');
    }

    const avatarDirectory = join(env.UPLOADS_DIR, 'avatars');
    await mkdir(avatarDirectory, { recursive: true });
    const filename = `${randomUUID()}.${extension}`;
    await writeFile(join(avatarDirectory, filename), file.buffer, { flag: 'wx' });

    return { url: `${env.API_PUBLIC_URL}/uploads/avatars/${filename}` };
  }

  private extensionForMime(mimeType: string): 'jpg' | 'png' | 'webp' | null {
    if (mimeType === 'image/jpeg') return 'jpg';
    if (mimeType === 'image/png') return 'png';
    if (mimeType === 'image/webp') return 'webp';
    return null;
  }

  private getVerifiedExtension(buffer: Buffer): 'jpg' | 'png' | 'webp' | null {
    if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
    if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
    if (buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
    return null;
  }
}
