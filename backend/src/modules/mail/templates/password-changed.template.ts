import { renderBaseEmailLayout } from './base-layout.template';

export interface PasswordChangedEmailOptions {
  email: string;
  name?: string;
  timestamp?: string;
  frontendUrl?: string;
}

export function buildPasswordChangedEmail(options: PasswordChangedEmailOptions): {
  subject: string;
  html: string;
  text: string;
} {
  const name = options.name?.trim() || 'Partner';
  const timeStr = options.timestamp || new Date().toUTCString();
  const subject = 'Your Investra password was successfully updated';
  const preheader = `Security Alert: Your Investra account password was changed at ${timeStr}.`;

  const contentHtml = `
    <!-- Icon / Tag -->
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 6px 14px; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #064E3B; letter-spacing: 0.8px; text-transform: uppercase;">
        Security Notice
      </span>
    </div>

    <!-- Main Title -->
    <h1 style="margin: 0 0 16px 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 26px; font-weight: 800; color: #0F172A; line-height: 1.25; letter-spacing: -0.5px;">
      Password Changed Successfully
    </h1>

    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.7; color: #475569;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.7; color: #475569;">
      This email confirms that the password for your Investra account (<strong>${options.email}</strong>) was recently changed at <strong>${timeStr}</strong>.
    </p>

    <!-- Security Check Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 18px 20px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #334155;">
            As an added security precaution, you have been signed out of all other active sessions and devices. You can now log in securely using your new password.
          </p>
        </td>
      </tr>
    </table>

    <!-- Unauthorized Alert Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 18px 20px;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #991B1B;">
            <strong>Did not make this change?</strong> If you did not update your password, your account may have been compromised. Please contact our security operations center immediately at <a href="mailto:security@investra.com" style="color: #991B1B; font-weight: bold; text-decoration: underline;">security@investra.com</a>.
          </p>
        </td>
      </tr>
    </table>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader,
    contentHtml,
    frontendUrl: options.frontendUrl,
  });

  const text = `Hello ${name},\n\n` +
    `Your Investra account password (${options.email}) was successfully changed at ${timeStr}.\n\n` +
    `If you did not make this change, please immediately contact security@investra.com.\n\n` +
    `— The Investra Team\nhttps://investra.com`;

  return { subject, html, text };
}
