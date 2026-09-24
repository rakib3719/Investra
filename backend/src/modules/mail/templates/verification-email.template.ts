import { renderBaseEmailLayout } from './base-layout.template';

export interface VerificationEmailOptions {
  email: string;
  name?: string;
  verificationUrl: string;
  expiresInHours?: number;
  frontendUrl?: string;
}

export function buildVerificationEmail(options: VerificationEmailOptions): {
  subject: string;
  html: string;
  text: string;
} {
  const name = options.name?.trim() || 'Partner';
  const hours = options.expiresInHours || 24;
  const subject = 'Verify your Investra account email';
  const preheader = `Welcome to Investra, ${name}. Confirm your email to activate your secure platform workspace.`;

  const contentHtml = `
    <!-- Icon / Tag -->
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 6px 14px; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #064E3B; letter-spacing: 0.8px; text-transform: uppercase;">
        Account Verification
      </span>
    </div>

    <!-- Main Title -->
    <h1 style="margin: 0 0 16px 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 26px; font-weight: 800; color: #0F172A; line-height: 1.25; letter-spacing: -0.5px;">
      Welcome to Investra, ${name}
    </h1>

    <!-- Message Description -->
    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.7; color: #475569;">
      Thank you for registering on <strong>Investra</strong>—the premium platform connecting accredited investors, venture capital funds, and elite entrepreneurs.
    </p>

    <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.7; color: #475569;">
      To safeguard your identity and grant access to vetted investment opportunities and founder workspaces, please confirm that <strong>${options.email}</strong> belongs to you:
    </p>

    <!-- Call to Action Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #064E3B; box-shadow: 0 4px 12px rgba(6, 78, 59, 0.25);">
          <a href="${options.verificationUrl}" target="_blank" class="cta-button" style="display: inline-block; padding: 15px 36px; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px; border: 1px solid #064E3B;">
            Verify Email Address &rarr;
          </a>
        </td>
      </tr>
    </table>

    <!-- Expiration Security Note Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 28px;">
      <tr>
        <td style="padding: 18px 20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="vertical-align: top; width: 24px; padding-right: 12px;">
                <div style="width: 22px; height: 22px; border-radius: 6px; background-color: #ECFDF5; border: 1px solid #A7F3D0; text-align: center; line-height: 22px;">
                  <span style="color: #064E3B; font-size: 12px; font-weight: 900;">&#10003;</span>
                </div>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #334155;">
                  <strong>Security notice:</strong> This verification link will expire in <strong>${hours} hours</strong>. If you did not create an Investra account, you can safely ignore this email—no further action is needed.
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
        <a href="${options.verificationUrl}" target="_blank" style="color: #064E3B; text-decoration: underline;">
          ${options.verificationUrl}
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

  const text = `Welcome to Investra, ${name}!\n\n` +
    `Please verify your email address to activate your account:\n` +
    `${options.verificationUrl}\n\n` +
    `This link expires in ${hours} hours.\n\n` +
    `If you did not sign up for Investra, please ignore this email.\n\n` +
    `— The Investra Team\nhttps://investra.com`;

  return { subject, html, text };
}
