import { NextResponse } from "next/server";
import { syncContactToResend } from "../../../lib/resend";

interface AttioEmailValue {
  email_address?: string;
  original_email_address?: string;
}

interface AttioNameValue {
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let body: Record<string, unknown>;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    // Optional webhook secret verification
    const webhookSecret = process.env.ATTIO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = request.headers.get("authorization");
      const signatureHeader =
        request.headers.get("x-attio-signature") ||
        request.headers.get("x-webhook-secret");

      const isSecretValid =
        authHeader === `Bearer ${webhookSecret}` ||
        signatureHeader === webhookSecret;

      if (!isSecretValid) {
        return NextResponse.json(
          { ok: false, error: "Unauthorized Attio webhook signature" },
          { status: 401 },
        );
      }
    }

    const apiKey = process.env.ATTIO_API_KEY;
    const eventType = (body.event_type as string) || (body.type as string);
    const eventData = (body.data as Record<string, unknown>) || body;

    let email: string | null = null;
    let firstName: string | undefined;
    let lastName: string | undefined;

    // Case 1: Email is directly present in values.email_addresses
    const values = (eventData.values as Record<string, unknown>) || {};
    const emailList = values.email_addresses as AttioEmailValue[] | undefined;
    if (Array.isArray(emailList) && emailList.length > 0) {
      email =
        emailList[0]?.email_address ||
        emailList[0]?.original_email_address ||
        null;
    }

    const nameList = values.name as AttioNameValue[] | undefined;
    if (Array.isArray(nameList) && nameList.length > 0) {
      firstName = nameList[0]?.first_name;
      lastName = nameList[0]?.last_name;
    }

    // Case 2: Event is a list entry (waitlist entry) with parent_record_id
    const parentRecordId =
      (eventData.parent_record_id as string) ||
      (eventData.id as Record<string, string>)?.record_id;

    if (!email && parentRecordId && apiKey) {
      try {
        const personRes = await fetch(
          `https://api.attio.com/v2/objects/people/records/${encodeURIComponent(parentRecordId)}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (personRes.ok) {
          const personData = await personRes.json();
          const personValues = personData?.data?.values;
          const pEmails = personValues?.email_addresses as
            AttioEmailValue[] | undefined;
          if (Array.isArray(pEmails) && pEmails.length > 0) {
            email =
              pEmails[0]?.email_address ||
              pEmails[0]?.original_email_address ||
              null;
          }

          const pNames = personValues?.name as AttioNameValue[] | undefined;
          if (Array.isArray(pNames) && pNames.length > 0) {
            firstName = pNames[0]?.first_name;
            lastName = pNames[0]?.last_name;
          }
        }
      } catch (attioErr) {
        console.warn(
          "[Attio Webhook] Could not resolve person details from Attio API:",
          attioErr,
        );
      }
    }

    if (!email) {
      return NextResponse.json({
        ok: true,
        message: "Webhook processed, no email found to sync.",
        eventType,
      });
    }

    // Sync to Resend Audience
    const syncRes = await syncContactToResend({
      email,
      firstName,
      lastName,
    });

    if (!syncRes.ok) {
      console.warn(
        `[Attio Webhook] Resend sync warning for ${email}:`,
        syncRes.error,
      );
    } else {
      console.log(
        `[Attio Webhook] Successfully synced contact ${email} to Resend Audience.`,
      );
    }

    return NextResponse.json({
      ok: true,
      email,
      syncedToResend: syncRes.ok,
      eventType,
    });
  } catch (err: unknown) {
    console.error("[Attio Webhook] Uncaught error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
