import { Resend } from "resend";
import { logger } from "./logger";

// Initialize Resend Client
// If RESEND_API_KEY is missing, we fall back to logging the email to console in development
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey && apiKey !== "re_123456789" ? new Resend(apiKey) : null;

const senderEmail = process.env.SENDER_EMAIL ?? "onboarding@resend.dev";
const ownerEmail = process.env.PORTFOLIO_OWNER_EMAIL ?? "owner@example.com";

/**
 * Wait helper for retry backoff
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends an email with an exponential backoff retry mechanism.
 */
async function sendEmailWithRetry(
  to: string,
  subject: string,
  html: string,
  retries = 3,
  backoffMs = 1000
): Promise<boolean> {
  if (!resend) {
    logger.warn("Resend client not initialized (missing API key). Email logged to console:", {
      to,
      subject,
    });
    // In dev mode, we print the HTML to log to enable offline layout preview
    logger.info(`DEV EMAIL SIMULATION:\nSubject: ${subject}\nTo: ${to}\nHTML:\n${html}`);
    return true;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await resend.emails.send({
        from: `Aura Studio <${senderEmail}>`,
        to,
        subject,
        html,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      logger.info("Email sent successfully via Resend", {
        to: logger.maskPayload({ email: to }).email,
        subject,
        messageId: response.data?.id,
      });
      return true;
    } catch (error) {
      logger.warn(`Email send attempt ${attempt} failed`, {
        error: error instanceof Error ? error.message : String(error),
        to: logger.maskPayload({ email: to }).email,
      });

      if (attempt === retries) {
        logger.error(`Failed to send email after ${retries} attempts`, error, {
          to: logger.maskPayload({ email: to }).email,
          subject,
        });
        return false;
      }

      // Exponential backoff
      await delay(backoffMs * Math.pow(2, attempt - 1));
    }
  }

  return false;
}

/**
 * Sends a premium cinematic styled confirmation email to the visitor.
 */
export async function sendVisitorConfirmation(
  visitorEmail: string,
  visitorName: string
): Promise<boolean> {
  const subject = "Aura Studio // Collaboration Inquiry Received";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#08080a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f0f0f5;-webkit-font-smoothing:antialiased;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#08080a;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#0c0c10;border:1px solid rgba(255,255,255,0.05);border-radius:4px;overflow:hidden;">
                
                <!-- Premium Header -->
                <tr>
                  <td align="center" style="padding:40px 40px 20px 40px;border-bottom:1px solid rgba(197,168,128,0.15);">
                    <h1 style="margin:0;font-size:24px;letter-spacing:4px;text-transform:uppercase;color:#c5a880;font-weight:600;">
                      AURA STUDIO
                    </h1>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding:40px 40px;line-height:1.6;font-size:15px;color:#a0a0b0;font-weight:300;">
                    <p style="margin-top:0;font-size:18px;color:#ffffff;font-weight:400;">
                      Hello ${visitorName},
                    </p>
                    <p>Thank you for reaching out.</p>
                    <p>I appreciate your interest in collaborating. I have received your message and will review your idea carefully.</p>
                    <p>You can expect a response soon.</p>
                    <p style="margin-bottom:0;">Looking forward to building something amazing together.</p>
                  </td>
                </tr>

                <!-- Footer Signoff -->
                <tr>
                  <td style="padding:0 40px 40px 40px;font-size:14px;color:#606070;">
                    <p style="margin:0;border-top:1px solid rgba(255,255,255,0.05);padding-top:20px;font-style:italic;">
                      Warm regards,<br>
                      <span style="color:#c5a880;font-style:normal;font-weight:500;">AURA</span> // Creative Director
                    </p>
                  </td>
                </tr>

                <!-- Bottom Bar -->
                <tr>
                  <td align="center" style="background-color:#121218;padding:20px;font-size:11px;color:#555565;letter-spacing:1px;text-transform:uppercase;">
                    © ${new Date().getFullYear()} AURA STUDIO. ALL RIGHTS RESERVED.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmailWithRetry(visitorEmail, subject, html);
}

/**
 * Sends a structured notification email to the portfolio owner.
 */
export async function sendOwnerNotification(leadData: {
  fullName: string;
  email: string;
  company?: string | null;
  projectIdea: string;
  budget: string;
}): Promise<boolean> {
  const subject = `New Collaboration Lead // ${leadData.fullName}`;
  
  const companyRow = leadData.company
    ? `<tr>
        <td style="padding:12px;border-bottom:1px solid #1a1a24;font-weight:500;color:#ffffff;width:150px;">Company</td>
        <td style="padding:12px;border-bottom:1px solid #1a1a24;color:#a0a0b0;">${leadData.company}</td>
       </tr>`
    : "";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#08080a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f0f0f5;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#08080a;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#0c0c10;border:1px solid rgba(197,168,128,0.2);border-radius:4px;overflow:hidden;">
                
                <!-- Notification Header -->
                <tr>
                  <td style="padding:30px 40px;background-color:#121218;border-bottom:1px solid rgba(197,168,128,0.2);">
                    <h2 style="margin:0;font-size:18px;letter-spacing:2px;text-transform:uppercase;color:#c5a880;">
                      New Collaboration Lead
                    </h2>
                  </td>
                </tr>

                <!-- Details List -->
                <tr>
                  <td style="padding:30px 40px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size:14px;text-align:left;">
                      <tr>
                        <td style="padding:12px;border-bottom:1px solid #1a1a24;font-weight:500;color:#ffffff;width:150px;">Lead Name</td>
                        <td style="padding:12px;border-bottom:1px solid #1a1a24;color:#a0a0b0;">${leadData.fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px;border-bottom:1px solid #1a1a24;font-weight:500;color:#ffffff;">Email Address</td>
                        <td style="padding:12px;border-bottom:1px solid #1a1a24;color:#a0a0b0;"><a href="mailto:${leadData.email}" style="color:#3b82f6;text-decoration:none;">${leadData.email}</a></td>
                      </tr>
                      ${companyRow}
                      <tr>
                        <td style="padding:12px;border-bottom:1px solid #1a1a24;font-weight:500;color:#ffffff;">Budget Range</td>
                        <td style="padding:12px;border-bottom:1px solid #1a1a24;color:#c5a880;font-weight:600;">${leadData.budget}</td>
                      </tr>
                      <tr>
                        <td valign="top" style="padding:12px 12px 0 12px;font-weight:500;color:#ffffff;padding-top:16px;">Project Idea</td>
                        <td style="padding:12px 12px 0 12px;color:#a0a0b0;line-height:1.6;padding-top:16px;white-space:pre-wrap;">${leadData.projectIdea}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Bottom Status info -->
                <tr>
                  <td align="center" style="background-color:#121218;padding:15px;font-size:12px;color:#606070;">
                    Received on ${new Date().toLocaleString()} // Saved in Database
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmailWithRetry(ownerEmail, subject, html);
}
