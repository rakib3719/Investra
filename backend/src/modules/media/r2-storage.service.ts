import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../common/config/env.config';

@Injectable()
export class R2StorageService {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly s3Client: S3Client;

  constructor() {
    // Cloudflare R2 uses standard S3 API with region "auto"
    const endpoint =
      env.R2_ENDPOINT ||
      (env.R2_ACCOUNT_ID
        ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
        : undefined);

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: endpoint || 'https://placeholder.r2.cloudflarestorage.com',
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID || 'placeholder',
        secretAccessKey: env.R2_SECRET_ACCESS_KEY || 'placeholder',
      },
      forcePathStyle: true,
    });
  }

  /**
   * Generates a temporary Presigned PUT URL allowing the browser to directly
   * upload binary content into Cloudflare R2 without burdening the application server.
   */
  async createPresignedPutUrl(
    bucket: string,
    key: string,
    contentType: string,
    expiresInSeconds = 900, // 15 minutes
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      });

      return await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to generate presigned PUT URL for bucket "${bucket}", key "${key}": ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to initialize direct upload. Please try again.',
      );
    }
  }

  /**
   * Generates a temporary Presigned GET URL allowing authorized users to directly
   * download/view private assets from the Private R2 bucket.
   */
  async createPresignedGetUrl(
    bucket: string,
    key: string,
    expiresInSeconds = 900, // 15 minutes
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to generate presigned GET URL for bucket "${bucket}", key "${key}": ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Unable to generate secure download link.',
      );
    }
  }

  /**
   * Verifies the presence and byte size of an object in Cloudflare R2 using HeadObject.
   * Throws NotFoundException if the object does not exist.
   */
  async headObject(
    bucket: string,
    key: string,
  ): Promise<HeadObjectCommandOutput> {
    try {
      const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      return await this.s3Client.send(command);
    } catch (error: any) {
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404 ||
        error.message?.includes('404')
      ) {
        throw new NotFoundException(
          `Object with key "${key}" was not found in storage bucket "${bucket}".`,
        );
      }
      this.logger.error(
        `Error querying HeadObject for key "${key}" in bucket "${bucket}": ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Storage verification failed unexpectedly.',
      );
    }
  }

  /**
   * Deletes an object from Cloudflare R2.
   * Returns true on success or if the object was already deleted.
   */
  async deleteObject(bucket: string, key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      this.logger.warn(
        `Failed to delete object "${key}" from bucket "${bucket}": ${error.message}`,
      );
      return false;
    }
  }
}
