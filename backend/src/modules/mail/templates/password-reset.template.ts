import { renderBaseEmailLayout } from './base-layout.template';

export interface PasswordResetEmailOptions {
  email: string;
  name?: string;
  resetUrl: string;
  expiresInMinutes?: number;
  frontendUrl?: string;
}

export function buildPasswordResetEmail(options: PasswordResetEmailOptions): {
  subject: string;
  html: string;
  text: string;
} {
  const name = options.name?.trim() || 'Partner';
  const minutes = options.expiresInMinutes || 60;
  const subject = 'Reset your Investra password';
  const preheader = `A password reset was requested for your Investra account. Use this secure link within ${minutes} minutes.`;

  const contentHtml = `
    <!-- Icon / Tag -->
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 6px 14px; background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #92400E; letter-spacing: 0.8px; text-transform: uppercase;">
        Password Recovery
      </span>
    </div>

    <!-- Main Title -->
    <h1 style="margin: 0 0 16px 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 26px; font-weight: 800; color: #0F172A; line-height: 1.25; letter-spacing: -0.5px;">
      Reset your password
    </h1>

    <!-- Message Description -->
    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.7; color: #475569;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.7; color: #475569;">
      We received a request to reset the password for your Investra account associated with <strong>${options.email}</strong>. Click the button below to select a new, strong password:
    </p>

    <!-- Call to Action Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #064E3B; box-shadow: 0 4px 12px rgba(6, 78, 59, 0.25);">
          <a href="${options.resetUrl}" target="_blank" class="cta-button" style="display: inline-block; padding: 15px 36px; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px; border: 1px solid #064E3B;">
            Reset Password &rarr;
          </a>
        </td>
      </tr>
    </table>

    <!-- Expiration Security Note Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; margin-bottom: 28px;">
      <tr>
        <td style="padding: 18px 20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="vertical-align: top; width: 24px; padding-right: 12px;">
                <div style="width: 22px; height: 22px; border-radius: 6px; background-color: #FEF3C7; border: 1px solid #FCD34D; text-align: center; line-height: 22px;">
                  <span style="color: #92400E; font-size: 12px; font-weight: 900;">&#9888;</span>
                </div>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #78350F;">
                  <strong>Important:</strong> This password reset link expires in <strong>${minutes} minutes</strong>. If you did not initiate this request, you can safely ignore this email—your account password remains completely unchanged and secure.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Fallback Direct URL Box -->
    <div style="background-color: #F1F5F9; border-radius: 10px; padding: 14px 16px; border: 1px dashed #CBD5E1;">
      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">
        Button not working? Copy &amp; paste this URL:
      </p>
      <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #064E3B; word-break: break-all; font-family: monospace;">
        <a href="${options.resetUrl}" target="_blank" style="color: #064E3B; text-decoration: underline;">
          ${options.resetUrl}
        </a>
      </p>
    </div>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader,
    contentHtml,
    frontendUrl: options.frontendUrl,
  });

  const text = `Hello ${name},\n\n` +
    `A password reset was requested for your Investra account (${options.email}).\n\n` +
    `Please use the following link to choose a new password:\n` +
    `${options.resetUrl}\n\n` +
    `This link will expire in ${minutes} minutes.\n\n` +
    `If you did not request this, please ignore this email.\n\n` +
    `— The Investra Team\nhttps://investra.com`;

  return { subject, html, text };
}
