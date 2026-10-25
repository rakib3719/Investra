import { renderBaseEmailLayout } from './base-layout.template';

export interface SessionBookingEmailOptions {
  recipientName: string;
  isConsultant: boolean;
  clientName: string;
  consultantName: string;
  topic: string;
  dateStr: string;
  timeStr: string;
  durationMinutes: number;
  meetingLink: string;
  meetingPlatform: string;
  amount: string;
  frontendUrl?: string;
}

export function buildSessionBookingEmail(options: SessionBookingEmailOptions): {
  subject: string;
  html: string;
  text: string;
} {
  const roleLabel = options.isConsultant ? 'New Consultation Session Booked' : '1-on-1 Consultation Confirmed';
  const subject = options.isConsultant
    ? `New Consultation Booked: ${options.topic} with ${options.clientName}`
    : `Confirmed: Consultation Session with ${options.consultantName}`;

  const preheader = options.isConsultant
    ? `You have a new confirmed 1-on-1 session with ${options.clientName} on ${options.dateStr} at ${options.timeStr}.`
    : `Your consultation session with ${options.consultantName} is scheduled for ${options.dateStr} at ${options.timeStr}.`;

  const otherPartyLabel = options.isConsultant ? 'Client / Attendee' : 'Consultant / Advisor';
  const otherPartyName = options.isConsultant ? options.clientName : options.consultantName;

  const contentHtml = `
    <!-- Icon / Tag -->
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 6px 14px; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #064E3B; letter-spacing: 0.8px; text-transform: uppercase;">
        ${roleLabel}
      </span>
    </div>

    <!-- Main Title -->
    <h1 style="margin: 0 0 16px 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 24px; font-weight: 800; color: #0F172A; line-height: 1.25; letter-spacing: -0.5px;">
      Hello ${options.recipientName},
    </h1>

    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.7; color: #475569;">
      ${
        options.isConsultant
          ? `A new 1-on-1 advisory session has been booked and paid for on <strong>Investra</strong>. Below are the details for your upcoming session:`
          : `Your 1-on-1 consultation session on <strong>Investra</strong> has been successfully booked and confirmed. You can join your video session directly via the meeting link below:`
      }
    </p>

    <!-- Session Details Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding: 6px 0; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; width: 35%;">Topic / Agenda:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #0F172A;">${options.topic}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase;">${otherPartyLabel}:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${otherPartyName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase;">Date:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #064E3B;">${options.dateStr}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase;">Time:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #064E3B;">${options.timeStr} (${options.durationMinutes} mins)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase;">Fee Paid:</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #10B981;">${options.amount}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Button to Join Meeting -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 28px 0;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #064E3B; box-shadow: 0 4px 12px rgba(6, 78, 59, 0.25);">
          <a href="${options.meetingLink}" target="_blank" class="cta-button" style="display: inline-block; padding: 14px 32px; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px; border: 1px solid #064E3B;">
            Join Video Meeting Room &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 16px 0; font-size: 12px; line-height: 1.6; color: #64748B;">
      Meeting Link: <a href="${options.meetingLink}" target="_blank" style="color: #064E3B; font-weight: 600; word-break: break-all;">${options.meetingLink}</a>
    </p>

    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #94A3B8;">
      Tip: Please join the room 2-3 minutes before the scheduled time. You can also access this session directly from your Investra dashboard.
    </p>
  `;

  const text = `
Hello ${options.recipientName},

Your consultation session on Investra has been confirmed!

Topic: ${options.topic}
${otherPartyLabel}: ${otherPartyName}
Date: ${options.dateStr}
Time: ${options.timeStr} (${options.durationMinutes} minutes)
Fee: ${options.amount}
Join Link: ${options.meetingLink}

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
