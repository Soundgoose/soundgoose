import { ImageResponse } from "next/og";
import { getNewsletterIssueBySlug } from "../../../sanity/lib/queries";

export const runtime = "nodejs";
export const alt = "Sound Goose Dispatch Newsletter";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = await getNewsletterIssueBySlug(slug);

  const title = issue?.title || "Sound Goose Dispatch";
  const issueNum = issue?.issueNumber
    ? `Issue #${issue.issueNumber}`
    : "Dispatch";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#eee5dc",
        padding: "60px 80px",
        fontFamily: "system-ui, sans-serif",
        border: "16px solid #40271e",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#40271e",
            letterSpacing: "-0.02em",
          }}
        >
          Sound Goose Dispatch 🪿
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#40271e",
            backgroundColor: "rgba(217, 166, 137, 0.4)",
            padding: "6px 20px",
            borderRadius: "20px",
          }}
        >
          {issueNum}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#40271e",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxHeight: "260px",
            overflow: "hidden",
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "2px solid rgba(115, 81, 61, 0.2)",
          paddingTop: "24px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#40271e",
          }}
        >
          The Newsletter for Modern Sound Creators
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#73513d",
          }}
        >
          soundgoose.com/newsletter
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
