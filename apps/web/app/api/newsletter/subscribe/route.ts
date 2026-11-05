import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();
    const source = body?.source || "newsletter-form";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    let alreadySubscribed = false;

    // 1. Sync to Attio CRM if API key exists
    const attioApiKey = process.env.ATTIO_API_KEY;
    if (attioApiKey) {
      try {
        // Upsert person in Attio
        const personRes = await fetch(
          "https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${attioApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                values: {
                  email_addresses: [email],
                },
              },
            }),
          },
        );

        if (personRes.ok) {
          const personData = await personRes.json();
          const personId = personData?.data?.id?.record_id;

          const listIdentifier =
            process.env.ATTIO_WAITLIST_LIST_ID ||
            process.env.ATTIO_WAITLIST_LIST_SLUG ||
            "waitlist";

          if (personId) {
            await fetch(
              `https://api.attio.com/v2/lists/${encodeURIComponent(listIdentifier)}/entries`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${attioApiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  data: {
                    parent_record_id: personId,
                    parent_object: "people",
                    entry_values: {
                      signed_up_at: new Date().toISOString(),
                      utm_source: source,
                    },
                  },
                }),
              },
            );
          }
        }
      } catch (attioErr) {
        console.warn("[Newsletter Subscribe] Attio sync error:", attioErr);
      }
    }

    // 2. Sync to Resend Audience if configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

    if (resendApiKey && resendAudienceId) {
      try {
        const resend = new Resend(resendApiKey);
        const contactRes = await resend.contacts.create({
          email,
          audienceId: resendAudienceId,
          unsubscribed: false,
        });

        if (contactRes.error) {
          console.warn(
            "[Newsletter Subscribe] Resend contact creation warning:",
            contactRes.error,
          );
        }
      } catch (resendErr) {
        console.warn("[Newsletter Subscribe] Resend exception:", resendErr);
      }
    }

    return NextResponse.json({
      ok: true,
      alreadySubscribed,
      message: "Successfully subscribed to the Sound Goose Dispatch.",
    });
  } catch (err: unknown) {
    console.error("[Newsletter Subscribe] Unhandled error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error. Please try again." },
      { status: 500 },
    );
  }
}
