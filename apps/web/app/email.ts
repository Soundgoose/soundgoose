import nodemailer from "nodemailer";
import { LOGO_BASE64 } from "./logo-base64";

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.purelymail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.PURELYMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.PURELYMAIL_PASSWORD || process.env.SMTP_PASS;

  if (!user || !pass) {
    return { transporter: null, missingCredentials: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return { transporter, missingCredentials: false, host, port, user };
}

export function generateWaitlistEmailHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're on the waitlist, gosling</title>
  <!-- Plus Jakarta Sans & Fraunces web fonts -->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    
    body, table, td, p, h1 {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    .headline-font {
      font-family: 'Fraunces', Georgia, serif !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #EEE5DC; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; color: #0A0609;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 440px; margin: 0 auto; background-color: #FAF7F4; border-radius: 10px; border: 1px solid #E2D7CC; overflow: hidden;">
    <tr>
      <td style="padding: 32px 28px 24px 28px;">
        
        <!-- Logo & Wordmark Header -->
        <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td style="vertical-align: middle; padding-right: 10px;">
              <img 
                src="cid:soundgoose-logo" 
                alt="Sound Goose" 
                width="36" 
                height="26" 
                style="display: block; width: 36px; height: 26px; border: 0;"
              />
            </td>
            <td style="vertical-align: middle;">
              <span class="headline-font" style="font-family: 'Fraunces', Georgia, serif; font-size: 19px; font-weight: 700; color: #40271E; letter-spacing: -0.02em;">
                Sound Goose
              </span>
            </td>
          </tr>
        </table>

        <!-- Main Confirmation -->
        <h1 class="headline-font" style="margin: 0 0 14px 0; font-family: 'Fraunces', Georgia, serif; font-size: 20px; line-height: 28px; font-weight: 600; color: #40271E; letter-spacing: -0.02em;">
          You're on the list, gosling.
        </h1>

        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #2B1D16;">
          Thanks for dropping your email. We've saved your spot on the waitlist and will reach out the moment early access opens.
        </p>

        <p style="margin: 0; font-size: 15px; line-height: 24px; color: #2B1D16;">
          Until then, back to the studio.
        </p>

      </td>
    </tr>

    <!-- Grounded Card Footer Bar -->
    <tr>
      <td style="background-color: #F2EAE2; padding: 14px 24px; border-top: 1px solid #E8DDD2; text-align: center;">
        <span style="font-size: 13px; font-weight: 600; color: #40271E;">Team&nbsp;Sound&nbsp;Goose</span>
        <span style="display: inline-block; padding: 0 8px; font-size: 11px; color: #9E8578; vertical-align: baseline;">•</span>
        <a href="https://soundgoose.com" style="font-size: 13px; color: #73513D; text-decoration: none;">soundgoose.com</a>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendWaitlistConfirmation(toEmail: string): Promise<EmailSendResult> {
  const timestamp = new Date().toISOString();
  console.log(`[Email Dispatch] [${timestamp}] Starting confirmation email flow for: ${toEmail}`);

  const { transporter, missingCredentials, host, port, user } = getTransporter();

  if (missingCredentials || !transporter) {
    const errorMsg = "SMTP credentials missing (PURELYMAIL_USER / PURELYMAIL_PASSWORD not set in environment).";
    console.error(`[Email Dispatch] [${timestamp}] Error: ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
      timestamp,
    };
  }

  const fromEmail = process.env.EMAIL_FROM_ADDRESS || "hello@soundgoose.com";
  const fromHeader = `"Sound Goose" <${fromEmail}>`;

  const htmlContent = generateWaitlistEmailHtml();
  const textContent = `Sound Goose

You're on the list, gosling.

Thanks for dropping your email. We've saved your spot on the waitlist and will reach out the moment early access opens.

Until then, back to the studio.

Team Sound Goose — https://soundgoose.com
`;

  try {
    console.log(
      `[Email Dispatch] Connecting to SMTP server ${host}:${port} as ${user} (sending from ${fromHeader})`
    );

    // Using in-memory Buffer from LOGO_BASE64 to avoid filesystem/CWD resolution bugs in Vercel serverless
    const logoBuffer = Buffer.from(LOGO_BASE64, "base64");

    const info = await transporter.sendMail({
      from: fromHeader,
      replyTo: fromEmail,
      to: toEmail,
      subject: "You're on the list, gosling 🪿",
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          content: logoBuffer,
          cid: "soundgoose-logo",
        },
      ],
    });

    console.log(
      `[Email Dispatch] [SUCCESS] Email delivered to Purelymail queue for ${toEmail}. Message ID: ${info.messageId}`
    );

    return {
      success: true,
      messageId: info.messageId,
      timestamp,
      details: {
        envelope: info.envelope,
        accepted: info.accepted,
      },
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    console.error(`[Email Dispatch] [FAILURE] Error sending email to ${toEmail}:`, errorMessage);
    if (errorStack) {
      console.error(`[Email Dispatch] Error Stack:`, errorStack);
    }

    return {
      success: false,
      error: errorMessage,
      timestamp,
    };
  }
}
