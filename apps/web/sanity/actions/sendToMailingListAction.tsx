import { useState } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { useClient } from "sanity";

function MailBroadcastIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export const SendToMailingListAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const { id, type, draft, published, onComplete } = props;
  const client = useClient({ apiVersion: "2024-11-01" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const doc = (draft || published) as Record<string, unknown> | null;
  const isPublished = Boolean(published);
  const broadcastStatus = doc?.broadcastStatus as string | undefined;
  const broadcastSentAt = doc?.broadcastSentAt as string | undefined;
  const isAlreadySent = broadcastStatus === "sent";

  const title = (doc?.title as string) || "Untitled";
  const slug = (doc?.slug as { current?: string } | undefined)?.current;
  const excerpt =
    (doc?.emailExcerpt as string) ||
    (doc?.excerpt as string) ||
    "";
  const issueNumber = doc?.issueNumber as number | undefined;

  const handleSend = async () => {
    setIsSending(true);

    try {
      const response = await fetch("/api/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: id,
          type,
          title,
          slug,
          excerpt,
          issueNumber,
          doc,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to broadcast email.");
      }

      // Update Sanity document to broadcastStatus = 'sent'
      const sentTimestamp = new Date().toISOString();
      const resendId = data.broadcastId || "sent";

      const targetId = published ? id.replace(/^drafts\./, "") : id;
      await client
        .patch(targetId)
        .set({
          broadcastStatus: "sent",
          broadcastSentAt: sentTimestamp,
          broadcastResendId: resendId,
        })
        .commit();

      if (draft) {
        await client
          .patch(`drafts.${targetId}`)
          .set({
            broadcastStatus: "sent",
            broadcastSentAt: sentTimestamp,
            broadcastResendId: resendId,
          })
          .commit();
      }

      setDialogOpen(false);
      onComplete();
      alert(`Broadcast successfully queued with Resend! (ID: ${resendId})`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(`Broadcast failed: ${message}`);
    } finally {
      setIsSending(false);
    }
  };

  if (type !== "post" && type !== "newsletter") {
    return null;
  }

  const label = isAlreadySent ? "Resend to Mailing List" : "Send to Mailing List";

  return {
    label: isSending ? "Broadcasting..." : label,
    disabled: !isPublished || isSending,
    title: !isPublished
      ? "You must publish this document before sending it to the mailing list."
      : undefined,
    icon: MailBroadcastIcon,
    onHandle: () => {
      setDialogOpen(true);
    },
    dialog: dialogOpen
      ? {
          type: "confirm",
          tone: isAlreadySent ? "caution" : "primary",
          onCancel: () => {
            if (!isSending) setDialogOpen(false);
          },
          onConfirm: handleSend,
          message: isAlreadySent
            ? `This document was already broadcasted on ${
                broadcastSentAt
                  ? new Date(broadcastSentAt).toLocaleString()
                  : "a previous date"
              }. Are you sure you want to broadcast it again to everyone on the Resend mailing list?`
            : `Send "${title}" directly to all subscribers on the Resend mailing list?\n\nThis will immediately format the teaser email and dispatch the broadcast to your audience.`,
        }
      : null,
  };
};
