import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateEditorialEmailHtml } from "../../../components/newsletter-email-template";
import {
  getResendClient,
  getResendAudienceId,
  sendResendBroadcast,
} from "../../../lib/resend";
import { urlForImage } from "../../../../sanity/lib/image";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type = "post",
      issueNumber,
      title,
      slug,
      excerpt,
      emailExcerpt,
      tldr,
      actionableNextStep,
      secretKey,
      doc,
    } = body;

    // Check authorization: Secret key OR valid Studio session cookie
    const expectedSecret =
      process.env.NEWSLETTER_BROADCAST_SECRET ||
      "soundgoose-secret-broadcast-key";

    const cookieStore = await cookies();
    const hasStudioSession =
      cookieStore.get("sg_studio_session")?.value === "authenticated";

    const isAuthorized =
      secretKey === expectedSecret ||
      hasStudioSession ||
      process.env.NODE_ENV !== "production";

    if (!isAuthorized) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized broadcast request." },
        { status: 401 },
      );
    }

    const postTitle = title || doc?.title;
    const postSlug =
      typeof slug === "string" ? slug : slug?.current || doc?.slug?.current;
    const postExcerpt =
      emailExcerpt ||
      excerpt ||
      doc?.emailExcerpt ||
      doc?.excerpt ||
      "";

    if (!postTitle || !postSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing required post data (title and slug are required).",
        },
        { status: 400 },
      );
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "RESEND_API_KEY is not set. Please configure Resend credentials to broadcast.",
        },
        { status: 500 },
      );
    }

    const audienceId = await getResendAudienceId();
    if (!audienceId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "RESEND_AUDIENCE_ID is not configured and no existing audience was found in Resend.",
        },
        { status: 500 },
      );
    }

    // Resolve cover image if available
    let coverImageUrl: string | undefined;
    const rawCover = doc?.coverImage;
    if (rawCover) {
      try {
        coverImageUrl = urlForImage(rawCover)?.width(1080).height(560).url();
      } catch {
        // ignore image URL generation errors
      }
    }

    // Generate HTML with Teaser & CTA
    const isPost = type === "post" || !issueNumber;
    const effectiveType = isPost ? "post" : "newsletter";

    const html = generateEditorialEmailHtml({
      type: effectiveType,
      issueNumber: issueNumber ? Number(issueNumber) : undefined,
      title: postTitle,
      slug: postSlug,
      emailExcerpt:
        postExcerpt ||
        `We've published a new dispatch on Sound Goose: "${postTitle}". Read the complete article on our canonical web edition.`,
      tldr: tldr || doc?.tldr,
      actionableNextStep: actionableNextStep || doc?.actionableNextStep,
      authorName: doc?.author?.name,
      coverImageUrl,
    });

    const subject = isPost
      ? doc?.emailSubject || `Sound Goose: ${postTitle}`
      : doc?.emailSubject || `Sound Goose Issue #${issueNumber || 1}: ${postTitle}`;

    const broadcastResult = await sendResendBroadcast({
      subject,
      html,
      audienceId,
      previewText: postExcerpt ? postExcerpt.slice(0, 120) : undefined,
    });

    if (!broadcastResult.ok || !broadcastResult.broadcastId) {
      return NextResponse.json(
        {
          ok: false,
          error: broadcastResult.error || "Failed to trigger Resend broadcast.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      broadcastId: broadcastResult.broadcastId,
      message: `Broadcast successfully dispatched to Resend Audience (${audienceId}).`,
    });
  } catch (err: unknown) {
    console.error("[Broadcast API] Error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
