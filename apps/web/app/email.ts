import nodemailer from "nodemailer";

function getTransporter() {
  // Purelymail SMTP Authentication using primary account user + pass
  const host = process.env.SMTP_HOST || "smtp.purelymail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.PURELYMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.PURELYMAIL_PASSWORD || process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
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

export async function sendWaitlistConfirmation(toEmail: string) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "Purelymail SMTP credentials missing (PURELYMAIL_USER / PURELYMAIL_PASSWORD). Skipping confirmation email."
    );
    return;
  }

  // Sender & Reply-To alias (e.g. hello@soundgoose.com)
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
    const path = await import("path");
    const logoAttachmentPath = path.join(process.cwd(), "public", "logo.png");

    await transporter.sendMail({
      from: fromHeader,
      replyTo: fromEmail,
      to: toEmail,
      subject: "You're on the list, gosling 🪿",
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          path: logoAttachmentPath,
          cid: "soundgoose-logo",
        },
      ],
    });
    console.log(`Confirmation email sent via Purelymail to ${toEmail}`);
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }
}
