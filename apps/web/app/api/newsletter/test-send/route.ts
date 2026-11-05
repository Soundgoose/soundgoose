import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { generateNewsletterEmailHtml } from "../../../components/newsletter-email-template";
import { LOGO_BASE64 } from "../../../logo-base64";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testEmail, issueNumber, title, slug, emailExcerpt } = body;

    if (!testEmail || !testEmail.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid test recipient email." },
        { status: 400 },
      );
    }

    if (!title || !slug || !emailExcerpt) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing issue details (title, slug, or excerpt).",
        },
        { status: 400 },
      );
    }

    const html = generateNewsletterEmailHtml({
      issueNumber: Number(issueNumber) || 1,
      title,
      slug,
      emailExcerpt,
    });

    const fromAddress =
      process.env.EMAIL_FROM_ADDRESS || "hello@soundgoose.com";
    const subject = `[TEST PREVIEW] Sound Goose Issue #${issueNumber || 1}: ${title}`;

    // Option A: Send via Resend if API key is provided
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const { data, error } = await resend.emails.send({
        from: `Sound Goose <${fromAddress}>`,
        to: testEmail,
        subject,
        html,
      });

      if (error) {
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json({
        ok: true,
        provider: "resend",
        id: data?.id,
        message: `Preview email sent successfully to ${testEmail} via Resend.`,
      });
    }

    // Option B: Fallback to existing Purelymail SMTP
    const user = process.env.PURELYMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.PURELYMAIL_PASSWORD || process.env.SMTP_PASS;

    if (user && pass) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.purelymail.com",
        port: Number(process.env.SMTP_PORT || 465),
        secure: true,
        auth: { user, pass },
      });

      const info = await transporter.sendMail({
        from: `"Sound Goose" <${fromAddress}>`,
        to: testEmail,
        subject,
        html,
        attachments: [
          {
            filename: "logo.png",
            content: Buffer.from(LOGO_BASE64, "base64"),
            cid: "soundgoose-logo",
          },
        ],
      });

      return NextResponse.json({
        ok: true,
        provider: "smtp",
        messageId: info.messageId,
        message: `Preview email sent successfully to ${testEmail} via SMTP.`,
      });
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "Neither RESEND_API_KEY nor SMTP credentials (PURELYMAIL_USER/PASSWORD) are configured in the environment.",
      },
      { status: 500 },
    );
  } catch (err: unknown) {
    console.error("[Newsletter Test Send] Error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
