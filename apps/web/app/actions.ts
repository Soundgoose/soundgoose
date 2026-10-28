"use server";

import { headers } from "next/headers";
import { sendWaitlistConfirmation } from "./email";

export interface WaitlistMetadata {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ref?: string;
}

export async function joinWaitlist(
  email: string,
  metadata?: WaitlistMetadata
): Promise<{ ok: boolean; alreadyRegistered?: boolean; error?: string }> {
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const apiKey = process.env.ATTIO_API_KEY;

  if (!apiKey) {
    console.error("Missing ATTIO_API_KEY environment variable");
    return {
      ok: false,
      error: "Server configuration error. Please try again later.",
    };
  }

  try {
    // 1. Check if the contact already exists in Attio People
    let isExistingContact = false;
    let existingPersonRecordId: string | null = null;
    try {
      const searchRes = await fetch(
        "https://api.attio.com/v2/objects/people/records/query",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: {
              email_addresses: email,
            },
            limit: 1,
          }),
        }
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.data && searchData.data.length > 0) {
          isExistingContact = true;
          existingPersonRecordId = searchData.data[0]?.id?.record_id ?? null;
        }
      }
    } catch (checkErr) {
      console.warn("Could not check existing contact status:", checkErr);
    }

    // 2. Ensure person record exists in Attio People
    const personUpsertRes = await fetch(
      "https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            values: {
              email_addresses: [email],
            },
          },
        }),
      }
    );

    if (!personUpsertRes.ok) {
      const body = await personUpsertRes.text();
      console.error(`Attio Person API error (${personUpsertRes.status}):`, body);
      return {
        ok: false,
        error: "Could not join the waitlist right now. Please try again.",
      };
    }

    const personData = await personUpsertRes.json();
    const personRecordId =
      personData?.data?.id?.record_id || existingPersonRecordId;

    // 3. Capture signup timestamp & Vercel geolocation headers
    const signedUpAt = new Date().toISOString();
    let country: string | null = null;
    let city: string | null = null;
    let region: string | null = null;
    let timezone: string | null = null;

    try {
      const headerList = await headers();
      country = headerList.get("x-vercel-ip-country");
      city = headerList.get("x-vercel-ip-city");
      region = headerList.get("x-vercel-ip-country-region");
      timezone = headerList.get("x-vercel-ip-timezone");
      if (city) {
        city = decodeURIComponent(city);
      }
    } catch (headerErr) {
      console.warn("Could not read incoming headers:", headerErr);
    }

    // Prepare List Entry attribute values
    const entryValues: Record<string, unknown> = {
      signed_up_at: signedUpAt,
    };

    if (metadata?.utm_source) entryValues.utm_source = metadata.utm_source;
    if (metadata?.utm_medium) entryValues.utm_medium = metadata.utm_medium;
    if (metadata?.utm_campaign) entryValues.utm_campaign = metadata.utm_campaign;
    if (metadata?.utm_term) entryValues.utm_term = metadata.utm_term;
    if (metadata?.utm_content) entryValues.utm_content = metadata.utm_content;
    if (metadata?.ref) entryValues.referral = metadata.ref;

    if (country) entryValues.country = country;
    if (city) entryValues.city = city;
    if (region) entryValues.region = region;
    if (timezone) entryValues.timezone = timezone;

    // 4. Add/upsert entry into the Attio Waitlist List
    const listIdentifier =
      process.env.ATTIO_WAITLIST_LIST_ID ||
      process.env.ATTIO_WAITLIST_LIST_SLUG ||
      "waitlist";

    if (personRecordId) {
      try {
        let listRes = await fetch(
          `https://api.attio.com/v2/lists/${encodeURIComponent(listIdentifier)}/entries`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                parent_record_id: personRecordId,
                parent_object: "people",
                entry_values: entryValues,
              },
            }),
          }
        );

        // Fallback: If custom list attributes fail (e.g. slug mismatch),
        // upsert entry without custom attributes so the person is still in the list
        if (!listRes.ok && Object.keys(entryValues).length > 0) {
          const failedBody = await listRes.text();
          console.warn(
            `Attio list entry with attributes failed on list '${listIdentifier}':`,
            failedBody
          );

          listRes = await fetch(
            `https://api.attio.com/v2/lists/${encodeURIComponent(listIdentifier)}/entries`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: {
                  parent_record_id: personRecordId,
                  parent_object: "people",
                },
              }),
            }
          );
        }

        if (!listRes.ok) {
          const errBody = await listRes.text();
          console.error(`Attio list entry error (${listRes.status}):`, errBody);
        }
      } catch (listErr) {
        console.error("Attio list entry request failed:", listErr);
      }
    }

    // 3. If already registered, skip sending email and return alreadyRegistered flag
    if (isExistingContact) {
      console.log(`Contact ${email} already on waitlist. Skipping duplicate confirmation email.`);
      return { ok: true, alreadyRegistered: true };
    }

    // 4. Send confirmation email for new signup (await so Vercel serverless doesn't freeze before completion)
    try {
      await sendWaitlistConfirmation(email);
    } catch (emailErr) {
      console.error("Confirmation email error:", emailErr);
    }

    return { ok: true, alreadyRegistered: false };
  } catch (err) {
    console.error("Attio request failed:", err);
    return { ok: false, error: "Network error. Please try again." };
  }
}
