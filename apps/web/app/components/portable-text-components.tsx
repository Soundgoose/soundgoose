import Image from "next/image";
import Link from "next/link";
import { PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "../../sanity/lib/image";
import { slugify } from "../lib/toc";

function extractText(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node.props?.children) return extractText(node.props.children);
  return String(node);
}

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlForImage(value)?.url();
      if (!imageUrl) return null;

      return (
        <figure style={{ margin: "28px 0" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid rgba(115, 81, 61, 0.15)",
            }}
          >
            <Image
              src={imageUrl}
              alt={value.alt || "Sound Goose article illustration"}
              width={900}
              height={500}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
              }}
            />
          </div>
          {value.caption && (
            <figcaption
              style={{
                fontSize: "13px",
                color: "#73513d",
                marginTop: "8px",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          fontWeight: 700,
          color: "var(--brand)",
          margin: "36px 0 16px 0",
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
          scrollMarginTop: "90px",
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h2
          id={id}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 600,
            color: "var(--brand)",
            margin: "36px 0 14px 0",
            lineHeight: 1.3,
            letterSpacing: "-0.015em",
            scrollMarginTop: "90px",
          }}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h3
          id={id}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--brand)",
            margin: "26px 0 10px 0",
            lineHeight: 1.4,
            scrollMarginTop: "90px",
          }}
        >
          {children}
        </h3>
      );
    },
    normal: ({ children }) => (
      <p
        style={{
          fontSize: "16px",
          lineHeight: 1.75,
          color: "#2b1d16",
          marginBottom: "18px",
        }}
      >
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: "3px solid #d9a689",
          paddingLeft: "18px",
          margin: "24px 0",
          fontStyle: "italic",
          color: "#40271e",
          background: "rgba(229, 218, 208, 0.4)",
          padding: "16px 20px",
          borderRadius: "0 6px 6px 0",
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul
        style={{
          margin: "12px 0 20px 24px",
          color: "#2b1d16",
          lineHeight: 1.75,
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        style={{
          margin: "12px 0 20px 24px",
          color: "#2b1d16",
          lineHeight: 1.75,
        }}
      >
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isInternal = href.startsWith("/") || href.startsWith("#");
      const rel = !isInternal ? "noreferrer noopener" : undefined;
      const target = !isInternal ? "_blank" : undefined;
      return (
        <Link
          href={href}
          rel={rel}
          target={target}
          style={{
            color: "var(--brand)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            fontWeight: 500,
          }}
        >
          {children}
        </Link>
      );
    },
    code: ({ children }) => (
      <code
        style={{
          background: "rgba(64, 39, 30, 0.08)",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "14px",
          fontFamily: "monospace",
          color: "var(--brand)",
        }}
      >
        {children}
      </code>
    ),
  },
};
