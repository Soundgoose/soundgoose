import { Resend } from "resend";

export interface SyncContactOptions {
  email: string;
  firstName?: string;
  lastName?: string;
  audienceId?: string;
}

export interface BroadcastPayload {
  subject: string;
  html: string;
  previewText?: string;
  audienceId?: string;
  from?: string;
}

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return null;
  }
  return new Resend(apiKey.trim());
}

export async function getResendAudienceId(): Promise<string | null> {
  const envAudienceId = process.env.RESEND_AUDIENCE_ID;
  if (envAudienceId && envAudienceId.trim()) {
    return envAudienceId.trim();
  }

  const resend = getResendClient();
  if (!resend) return null;

  try {
    const listRes = await resend.audiences.list();
    if (listRes.data && Array.isArray(listRes.data) && listRes.data.length > 0) {
      const firstAudience = listRes.data[0];
      if (firstAudience?.id) {
        return firstAudience.id;
      }
    }

    // Attempt to create audience if none exist
    const createRes = await resend.audiences.create({
      name: "Sound Goose Community",
    });
    if (createRes.data?.id) {
      return createRes.data.id;
    }
  } catch (err) {
    console.warn("[Resend] Could not auto-discover audience:", err);
  }

  return null;
}

export async function syncContactToResend({
  email,
  firstName,
  lastName,
  audienceId,
}: SyncContactOptions): Promise<{ ok: boolean; id?: string; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY is not configured." };
  }

  const targetAudienceId = audienceId || (await getResendAudienceId());
  if (!targetAudienceId) {
    return {
      ok: false,
      error: "RESEND_AUDIENCE_ID is not configured and could not be discovered.",
    };
  }

  try {
    const createRes = await resend.contacts.create({
      audienceId: targetAudienceId,
      email: email.trim().toLowerCase(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      unsubscribed: false,
    });

    if (createRes.error) {
      // If contact already exists in audience, treat as success
      const errorMsg = createRes.error.message?.toLowerCase() || "";
      if (
        errorMsg.includes("already exists") ||
        errorMsg.includes("duplicate")
      ) {
        return { ok: true };
      }
      return { ok: false, error: createRes.error.message };
    }

    return { ok: true, id: createRes.data?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // Ignore duplicate errors gracefully
    if (msg.toLowerCase().includes("already exists")) {
      return { ok: true };
    }
    console.error("[Resend Contact Sync] Error:", err);
    return { ok: false, error: msg };
  }
}

export async function sendResendBroadcast({
  subject,
  html,
  previewText,
  audienceId,
  from,
}: BroadcastPayload): Promise<{ ok: boolean; broadcastId?: string; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY is not configured." };
  }

  const targetAudienceId = audienceId || (await getResendAudienceId());
  if (!targetAudienceId) {
    return {
      ok: false,
      error: "RESEND_AUDIENCE_ID is not configured and could not be discovered.",
    };
  }

  const fromAddress =
    from || process.env.EMAIL_FROM_ADDRESS || "Sound Goose <hello@soundgoose.com>";

  try {
    const broadcastRes = await resend.broadcasts.create({
      audienceId: targetAudienceId,
      from: fromAddress.includes("<") ? fromAddress : `Sound Goose <${fromAddress}>`,
      subject,
      html,
      previewText,
    });

    if (broadcastRes.error) {
      return { ok: false, error: broadcastRes.error.message };
    }

    const broadcastId = broadcastRes.data?.id;
    if (broadcastId) {
      const sendRes = await resend.broadcasts.send(broadcastId);
      if (sendRes.error) {
        return { ok: false, broadcastId, error: sendRes.error.message };
      }
    }

    return { ok: true, broadcastId };
  } catch (err: unknown) {
    console.error("[Resend Broadcast] Error:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
