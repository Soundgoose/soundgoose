import { LOGO_BASE64 } from "../logo-base64";

export interface NewsletterEmailData {
  issueNumber: number;
  title: string;
  slug: string;
  emailExcerpt: string;
  baseUrl?: string;
  unsubscribeUrl?: string;
}

export function generateNewsletterEmailHtml({
  issueNumber,
  title,
  slug,
  emailExcerpt,
  baseUrl = "https://soundgoose.com",
  unsubscribeUrl = "https://soundgoose.com/unsubscribe",
}: NewsletterEmailData): string {
  const readMoreUrl = `${baseUrl}/newsletter/${slug}?utm_source=newsletter&utm_medium=email&utm_campaign=issue-${issueNumber}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sound Goose Dispatch — Issue #${issueNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    body, table, td, p, h1, h2 {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    .headline-font {
      font-family: 'Fraunces', Georgia, serif !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #EEE5DC; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; color: #0A0609;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #FAF7F4; border-radius: 12px; border: 1px solid #E2D7CC; overflow: hidden; box-shadow: 0 4px 16px rgba(64,39,30,0.06);">
    
    <!-- Top Header Bar -->
    <tr>
      <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #ECE3DA;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="vertical-align: middle;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 10px;">
                    <img 
                      src="cid:soundgoose-logo" 
                      alt="Sound Goose" 
                      width="34" 
                      height="24" 
                      style="display: block; width: 34px; height: 24px; border: 0;"
                    />
                  </td>
                  <td style="vertical-align: middle;">
                    <span class="headline-font" style="font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-weight: 700; color: #40271E; letter-spacing: -0.02em;">
                      Sound Goose
                    </span>
                  </td>
                </tr>
              </table>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="font-size: 12px; font-weight: 700; color: #40271E; background-color: #EDE2D6; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em;">
                Issue #${issueNumber}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Main Teaser Body -->
    <tr>
      <td style="padding: 32px 32px 28px 32px;">
        <h1 class="headline-font" style="margin: 0 0 16px 0; font-family: 'Fraunces', Georgia, serif; font-size: 22px; line-height: 30px; font-weight: 700; color: #40271E; letter-spacing: -0.02em;">
          ${title}
        </h1>

        <div style="margin: 0 0 28px 0; font-size: 15px; line-height: 25px; color: #2B1D16; white-space: pre-line;">
          ${emailExcerpt}
        </div>

        <!-- Read More Button (Drives traffic to website for SEO & full content) -->
        <table border="0" cellpadding="0" cellspacing="0" style="margin: 32px 0 16px 0;">
          <tr>
            <td align="center" style="background-color: #40271E; border-radius: 6px;">
              <a 
                href="${readMoreUrl}" 
                target="_blank" 
                style="display: inline-block; padding: 13px 26px; font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 6px; letter-spacing: 0.01em;"
              >
                Read Full Issue on Sound Goose &rarr;
              </a>
            </td>
          </tr>
        </table>

        <p style="margin: 16px 0 0 0; font-size: 13px; line-height: 20px; color: #73513D;">
          Enjoyed this preview? View the full deep dive with interactive diagrams, audio examples, and community commentary on our web portal.
        </p>
      </td>
    </tr>

    <!-- Grounded Footer -->
    <tr>
      <td style="background-color: #F2EAE2; padding: 18px 32px; border-top: 1px solid #E8DDD2; text-align: center;">
        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #40271E;">
          Team Sound Goose &bull; <a href="https://soundgoose.com" style="color: #73513D; text-decoration: none;">soundgoose.com</a>
        </p>
        <p style="margin: 0; font-size: 11px; color: #9E8578; line-height: 16px;">
          You are receiving this because you subscribed to the Sound Goose Dispatch or early access waitlist.<br />
          <a href="${unsubscribeUrl}" style="color: #73513D; text-decoration: underline;">Unsubscribe</a> from future editions.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
