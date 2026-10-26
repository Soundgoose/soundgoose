"use server";

import { sendWaitlistConfirmation } from "./email";

export async function joinWaitlist(
  email: string
): Promise<{ ok: boolean; error?: string }> {
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
    // Upsert person record – safe to call multiple times with the same email.
    // Uses matching_attribute so existing contacts are updated, not duplicated.
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

    // Send confirmation email asynchronously (fails gracefully without blocking signup)
    sendWaitlistConfirmation(email).catch((err) =>
      console.error("Async email error:", err)
    );

    return { ok: true };
  } catch (err) {
    console.error("Attio request failed:", err);
    return { ok: false, error: "Network error. Please try again." };
  }
}
