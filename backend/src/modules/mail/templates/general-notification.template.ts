import { renderBaseEmailLayout } from './base-layout.template';

export interface GeneralNotificationEmailOptions {
  recipientName: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  category?: string;
  frontendUrl?: string;
}

export function buildGeneralNotificationEmail(options: GeneralNotificationEmailOptions): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `[Investra] ${options.title}`;
  const preheader = options.message.slice(0, 140);
  const actionBtnText = options.actionText || 'View Details &rarr;';
  const categoryTag = options.category || 'Notification';

  const contentHtml = `
    <!-- Icon / Tag -->
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 6px 14px; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #064E3B; letter-spacing: 0.8px; text-transform: uppercase;">
        ${categoryTag}
      </span>
    </div>

    <!-- Main Title -->
    <h1 style="margin: 0 0 16px 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 24px; font-weight: 800; color: #0F172A; line-height: 1.25; letter-spacing: -0.5px;">
      ${options.title}
    </h1>

    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.7; color: #475569;">
      Hello ${options.recipientName},
    </p>

    <!-- Notification Message Box -->
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; margin-bottom: 28px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #334155;">
        ${options.message}
      </p>
    </div>

    ${
      options.actionUrl
        ? `
    <!-- Action Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 28px 0;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #064E3B; box-shadow: 0 4px 12px rgba(6, 78, 59, 0.25);">
          <a href="${options.actionUrl}" target="_blank" class="cta-button" style="display: inline-block; padding: 14px 32px; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px; border: 1px solid #064E3B;">
            ${actionBtnText}
          </a>
        </td>
      </tr>
    </table>
    `
        : ''
    }

    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #94A3B8;">
      You received this notification because your Investra account is configured to receive instant platform and deal activity alerts.
    </p>
  `;

  const text = `
Hello ${options.recipientName},

${options.title}

${options.message}

${options.actionUrl ? `View details: ${options.actionUrl}` : ''}

Best regards,
The Investra Team
  `.trim();

  const html = renderBaseEmailLayout({
    title: subject,
    preheader,
    contentHtml,
    frontendUrl: options.frontendUrl,
  });

  return { subject, html, text };
}
