"use server";

import { sendWaitlistConfirmation } from "./email";

export async function joinWaitlist(
  email: string
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
    // 1. Check if the contact already exists in Attio
    let isExistingContact = false;
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
        }
      }
    } catch (checkErr) {
      console.warn("Could not check existing contact status:", checkErr);
    }

    // 2. Upsert person record in Attio
    const res = await fetch(
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

    if (!res.ok) {
      const body = await res.text();
      console.error(`Attio API error (${res.status}):`, body);
      return {
        ok: false,
        error: "Could not join the waitlist right now. Please try again.",
      };
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
