export interface BaseEmailLayoutOptions {
  title: string;
  preheader?: string;
  contentHtml: string;
  frontendUrl?: string;
}

export function renderBaseEmailLayout(options: BaseEmailLayoutOptions): string {
  const currentYear = new Date().getFullYear();
  const frontendUrl = options.frontendUrl || 'https://investra.com';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${options.title}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; background-color: #F8FAFC; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; border-radius: 0 !important; }
      .email-padding { padding: 24px 20px !important; }
      .header-padding { padding: 24px 20px !important; }
      .cta-button { width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; color: #0F172A; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  ${
    options.preheader
      ? `<div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-width: 0px; opacity: 0;">
          ${options.preheader}
          &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
        </div>`
      : ''
  }

  <!-- Background Wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC;">
    <tr>
      <td align="center" style="padding: 40px 16px 48px 16px;">

        <!-- Main Card Container (600px Max) -->
        <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);">

          <!-- Premium Brand Header -->
          <tr>
            <td class="header-padding" align="center" style="background-color: #182B45; padding: 32px 36px; border-bottom: 3px solid #10B981;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${frontendUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <!-- Styled Brand Mark & Text -->
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align: middle; padding-right: 12px;">
                            <div style="width: 38px; height: 38px; border-radius: 10px; background-color: #064E3B; border: 1px solid #10B981; text-align: center; line-height: 38px;">
                              <span style="color: #10B981; font-size: 22px; font-weight: 900; font-family: 'Outfit', sans-serif;">I</span>
                            </div>
                          </td>
                          <td style="vertical-align: middle; text-align: left;">
                            <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 22px; font-weight: 800; letter-spacing: 1.5px; color: #FFFFFF; line-height: 1.1;">
                              INVESTRA
                            </div>
                            <div style="font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #10B981; margin-top: 3px;">
                              VENTURE & CAPITAL ECOSYSTEM
                            </div>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td class="email-padding" style="padding: 36px 36px 28px 36px; background-color: #FFFFFF;">
              ${options.contentHtml}
            </td>
          </tr>

          <!-- Institutional Trust & Security Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <div style="border-top: 1px solid #E2E8F0; width: 100%;"></div>
            </td>
          </tr>

          <!-- Support & Help Strip -->
          <tr>
            <td style="padding: 24px 36px; background-color: #F8FAFC;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size: 12px; color: #64748B; line-height: 1.6; text-align: center;">
                    Questions or need security assistance? Contact our team at
                    <a href="mailto:support@investra.com" style="color: #064E3B; font-weight: 700; text-decoration: none;">support@investra.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Global Footer -->
          <tr>
            <td style="background-color: #182B45; padding: 28px 36px; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 11px; line-height: 1.6; color: #94A3B8;">
                This automated message was sent from a notification-only address by
                <strong style="color: #FFFFFF;">Investra</strong>. Please do not reply directly to this email.
              </p>
              <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #64748B;">
                &copy; ${currentYear} Investra Inc. All rights reserved. Connecting institutional investors, venture capital, and elite founders.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Card Container -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}
