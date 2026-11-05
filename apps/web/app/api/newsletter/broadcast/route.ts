import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateNewsletterEmailHtml } from "../../../components/newsletter-email-template";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { issueNumber, title, slug, emailExcerpt, secretKey } = body;

    const expectedSecret =
      process.env.NEWSLETTER_BROADCAST_SECRET ||
      "soundgoose-secret-broadcast-key";

    if (secretKey !== expectedSecret) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized broadcast request." },
        { status: 401 },
      );
    }

    if (!title || !slug || !emailExcerpt) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing required issue data (title, slug, or excerpt).",
        },
        { status: 400 },
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

    if (!resendApiKey) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "RESEND_API_KEY is not set. Please configure Resend credentials to broadcast.",
        },
        { status: 500 },
      );
    }

    const resend = new Resend(resendApiKey);
    const html = generateNewsletterEmailHtml({
      issueNumber: Number(issueNumber) || 1,
      title,
      slug,
      emailExcerpt,
    });

    const fromAddress =
      process.env.EMAIL_FROM_ADDRESS || "hello@soundgoose.com";
    const subject = `Sound Goose Issue #${issueNumber || 1}: ${title}`;

    if (resendAudienceId) {
      // Use Resend Broadcast API
      const broadcastRes = await resend.broadcasts.create({
        audienceId: resendAudienceId,
        from: `Sound Goose <${fromAddress}>`,
        subject,
        html,
      });

      if (broadcastRes.error) {
        return NextResponse.json(
          { ok: false, error: broadcastRes.error.message },
          { status: 500 },
        );
      }

      // Trigger the broadcast send
      if (broadcastRes.data?.id) {
        await resend.broadcasts.send(broadcastRes.data.id);
      }

      return NextResponse.json({
        ok: true,
        broadcastId: broadcastRes.data?.id,
        message: "Newsletter successfully queued and broadcasted to audience.",
      });
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "RESEND_AUDIENCE_ID is not configured. Please create an audience in Resend.",
      },
      { status: 500 },
    );
  } catch (err: unknown) {
    console.error("[Newsletter Broadcast] Error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
