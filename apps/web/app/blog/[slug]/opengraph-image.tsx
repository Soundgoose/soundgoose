import { ImageResponse } from "next/og";
import { getBlogPostBySlug } from "../../../sanity/lib/queries";

export const runtime = "nodejs";
export const alt = "Sound Goose Blog Post";
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
  const post = await getBlogPostBySlug(slug);

  const title = post?.title || "Sound Goose Dispatch";
  const authorName = post?.author?.name || "Sound Goose Team";
  const category = post?.categories?.[0]?.title || "Field Notes";

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
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#40271e",
            letterSpacing: "-0.02em",
          }}
        >
          Sound Goose 🪿
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 600,
            color: "#73513d",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            backgroundColor: "rgba(115, 81, 61, 0.12)",
            padding: "6px 16px",
            borderRadius: "20px",
          }}
        >
          {category}
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
            display: "flex",
            fontSize: 54,
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
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            color: "#40271e",
          }}
        >
          By {authorName}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#73513d",
          }}
        >
          soundgoose.com/blog
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
