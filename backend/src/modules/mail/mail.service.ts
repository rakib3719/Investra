import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { env } from '../../common/config/env.config';
import {
  buildVerificationEmail,
  buildPasswordResetEmail,
  buildPasswordChangedEmail,
  buildSessionBookingEmail,
} from './templates';

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

  async sendVerificationEmail(
    email: string,
    token: string,
    name?: string,
  ): Promise<boolean> {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}`;

    const template = buildVerificationEmail({
      email,
      name,
      verificationUrl,
      expiresInHours: 24,
      frontendUrl: env.FRONTEND_URL,
    });

    return this.send({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    name?: string,
  ): Promise<boolean> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

    const template = buildPasswordResetEmail({
      email,
      name,
      resetUrl,
      expiresInMinutes: 60,
      frontendUrl: env.FRONTEND_URL,
    });

    return this.send({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  async sendPasswordChangedEmail(
    email: string,
    name?: string,
  ): Promise<boolean> {
    const template = buildPasswordChangedEmail({
      email,
      name,
      timestamp: new Date().toUTCString(),
      frontendUrl: env.FRONTEND_URL,
    });

    return this.send({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  async sendSessionBookingEmails(payload: {
    clientEmail: string;
    clientName: string;
    consultantEmail: string;
    consultantName: string;
    topic: string;
    dateStr: string;
    timeStr: string;
    durationMinutes: number;
    meetingLink: string;
    meetingPlatform: string;
    amount: string;
  }): Promise<void> {
    const clientTemplate = buildSessionBookingEmail({
      recipientName: payload.clientName,
      isConsultant: false,
      clientName: payload.clientName,
      consultantName: payload.consultantName,
      topic: payload.topic,
      dateStr: payload.dateStr,
      timeStr: payload.timeStr,
      durationMinutes: payload.durationMinutes,
      meetingLink: payload.meetingLink,
      meetingPlatform: payload.meetingPlatform,
      amount: payload.amount,
      frontendUrl: env.FRONTEND_URL,
    });

    const consultantTemplate = buildSessionBookingEmail({
      recipientName: payload.consultantName,
      isConsultant: true,
      clientName: payload.clientName,
      consultantName: payload.consultantName,
      topic: payload.topic,
      dateStr: payload.dateStr,
      timeStr: payload.timeStr,
      durationMinutes: payload.durationMinutes,
      meetingLink: payload.meetingLink,
      meetingPlatform: payload.meetingPlatform,
      amount: payload.amount,
      frontendUrl: env.FRONTEND_URL,
    });

    await Promise.allSettled([
      this.send({
        to: payload.clientEmail,
        subject: clientTemplate.subject,
        text: clientTemplate.text,
        html: clientTemplate.html,
      }),
      this.send({
        to: payload.consultantEmail,
        subject: consultantTemplate.subject,
        text: consultantTemplate.text,
        html: consultantTemplate.html,
      }),
    ]);
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
        from: env.SMTP_FROM || `Investra <${env.SMTP_USER}>`,
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
