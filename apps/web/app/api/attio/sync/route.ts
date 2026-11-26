import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getResendClient,
  getResendAudienceId,
  syncContactToResend,
} from "../../../lib/resend";

interface AttioEmailValue {
  email_address?: string;
  original_email_address?: string;
}

export async function POST(request: Request) {
  try {
    // Auth check: allow studio session, secret, or dev
    const cookieStore = await cookies();
    const hasStudioSession =
      cookieStore.get("sg_studio_session")?.value === "authenticated";

    const authHeader = request.headers.get("authorization");
    const expectedSecret =
      process.env.NEWSLETTER_BROADCAST_SECRET ||
      "soundgoose-secret-broadcast-key";
    const isAuthorized =
      hasStudioSession ||
      authHeader === `Bearer ${expectedSecret}` ||
      process.env.NODE_ENV !== "production";

    if (!isAuthorized) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized sync request" },
        { status: 401 },
      );
    }

    const apiKey = process.env.ATTIO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "ATTIO_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        { ok: false, error: "RESEND_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const audienceId = await getResendAudienceId();
    if (!audienceId) {
      return NextResponse.json(
        { ok: false, error: "Could not find or create a Resend audience" },
        { status: 500 },
      );
    }

    const listIdentifier =
      process.env.ATTIO_WAITLIST_LIST_ID ||
      process.env.ATTIO_WAITLIST_LIST_SLUG ||
      "waitlist";

    // 1. Fetch waitlist entries from Attio
    const attioListRes = await fetch(
      `https://api.attio.com/v2/lists/${encodeURIComponent(listIdentifier)}/entries?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!attioListRes.ok) {
      const errText = await attioListRes.text();
      return NextResponse.json(
        {
          ok: false,
          error: `Attio list fetch failed (${attioListRes.status}): ${errText}`,
        },
        { status: 502 },
      );
    }

    const attioListData = await attioListRes.json();
    const entries = attioListData.data || [];

    let totalEntries = entries.length;
    let syncedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // 2. Process each entry and sync to Resend Audience
    for (const entry of entries) {
      const parentRecordId = entry.parent_record_id;
      if (!parentRecordId) continue;

      try {
        // Fetch person record to get email address
        const personRes = await fetch(
          `https://api.attio.com/v2/objects/people/records/${encodeURIComponent(parentRecordId)}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!personRes.ok) continue;

        const personData = await personRes.json();
        const pValues = personData?.data?.values;
        const pEmails = pValues?.email_addresses as
          AttioEmailValue[] | undefined;
        const email =
          pEmails?.[0]?.email_address || pEmails?.[0]?.original_email_address;

        if (email && email.includes("@")) {
          const syncResult = await syncContactToResend({
            email,
            audienceId,
          });

          if (syncResult.ok) {
            syncedCount++;
          } else {
            failedCount++;
            if (syncResult.error) errors.push(syncResult.error);
          }
        }
      } catch (entryErr: unknown) {
        failedCount++;
        errors.push(
          entryErr instanceof Error ? entryErr.message : String(entryErr),
        );
      }
    }

    return NextResponse.json({
      ok: true,
      audienceId,
      totalWaitlistEntries: totalEntries,
      syncedToResend: syncedCount,
      failed: failedCount,
      errors: errors.slice(0, 5),
      message: `Successfully synced ${syncedCount} of ${totalEntries} contacts to Resend audience.`,
    });
  } catch (err: unknown) {
    console.error("[Attio Sync] Unhandled error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

export async function GET() {
  // Returns current Resend audience and contact count summary
  try {
    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        { ok: false, error: "RESEND_API_KEY missing" },
        { status: 500 },
      );
    }

    const audienceId = await getResendAudienceId();
    if (!audienceId) {
      return NextResponse.json(
        { ok: false, error: "No audience found" },
        { status: 404 },
      );
    }

    // List contacts count
    const contactsRes = await resend.contacts.list({ audienceId });
    const count = Array.isArray(contactsRes.data)
      ? contactsRes.data.length
      : ((contactsRes.data as { data?: unknown[] } | null)?.data?.length ?? 0);

    return NextResponse.json({
      ok: true,
      audienceId,
      subscriberCount: count,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
