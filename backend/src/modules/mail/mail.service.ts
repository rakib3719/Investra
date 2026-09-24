import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { env } from '../../common/config/env.config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth:
        env.SMTP_USER && env.SMTP_PASSWORD
          ? {
              user: env.SMTP_USER,
              pass: env.SMTP_PASSWORD,
            }
          : undefined,
      connectionTimeout: 4000, // 4 seconds max
      greetingTimeout: 4000,
      socketTimeout: 5000,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}`;

    return this.send({
      to: email,
      subject: 'Verify your Investra email address',
      text: `Welcome to Investra. Verify your email address: ${verificationUrl}`,
      html: `<p>Welcome to Investra.</p><p><a href="${verificationUrl}">Verify your email address</a></p><p>This link expires in 24 hours.</p>`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

    return this.send({
      to: email,
      subject: 'Reset your Investra password',
      text: `Reset your Investra password: ${resetUrl}`,
      html: `<p>Reset your Investra password.</p><p><a href="${resetUrl}">Choose a new password</a></p><p>This link expires in 1 hour.</p>`,
    });
  }

  private async send(message: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<boolean> {
    if (!env.SMTP_USER || !env.SMTP_PASSWORD) {
      this.logger.warn(
        `SMTP credentials not configured (SMTP_USER/SMTP_PASSWORD). Skipped sending email to ${message.to}.`,
      );
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM || env.SMTP_USER,
        ...message,
      });
      this.logger.log(`Email successfully sent to ${message.to}`);
      return true;
    } catch (error: any) {
      this.logger.error(
        `Unable to send email to ${message.to}: ${error?.message || error}`,
      );
      return false;
    }
  }
}
