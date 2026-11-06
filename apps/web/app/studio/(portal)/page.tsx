import Link from "next/link";
import { projectId, dataset } from "../../../sanity/env";

export const metadata = {
  title: "Overview | Sound Goose Studio",
};

export default function StudioOverviewPage() {
  return (
    <div
      style={{
        flex: 1,
        padding: "2.5rem 2rem 4rem 2rem",
        maxWidth: "1280px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header section */}
      <div
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          paddingBottom: "1.75rem",
          marginBottom: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#c29d74",
              marginBottom: "0.5rem",
            }}
          >
            Internal Operations &amp; Editorial Command
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "2.1rem",
              fontWeight: 600,
              color: "#f5f0eb",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Sound Goose Studio
          </h1>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link
            href="/content"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#c29d74",
              color: "#12100e",
              fontWeight: 600,
              fontSize: "0.85rem",
              padding: "0.6rem 1.15rem",
              borderRadius: "6px",
              transition: "opacity 0.15s ease",
            }}
          >
            Launch Content Studio →
          </Link>
          <a
            href="https://sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "#201b18",
              color: "#d1c7bf",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontWeight: 500,
              fontSize: "0.85rem",
              padding: "0.6rem 1.15rem",
              borderRadius: "6px",
            }}
          >
            Sanity Manage ↗
          </a>
        </div>
      </div>

      {/* KPI & Operations Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        {/* Card 1: Content Studio */}
        <div
          style={{
            backgroundColor: "#1a1614",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "10px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#c29d74",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Editorial Desk
            </div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#f5f0eb",
                margin: "0 0 0.5rem 0",
              }}
            >
              Sanity Content
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#9e9188",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Structured editorial schema for Liner Notes articles, Weekly Digest editions, and audio media metadata.
            </p>
          </div>

          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "#10b981", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
              Active ({projectId})
            </span>
            <Link
              href="/content"
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#c29d74",
              }}
            >
              Open Studio →
            </Link>
          </div>
        </div>

        {/* Card 2: Waitlist & CRM */}
        <div
          style={{
            backgroundColor: "#1a1614",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "10px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#c29d74",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Audience Pipeline
            </div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#f5f0eb",
                margin: "0 0 0.5rem 0",
              }}
            >
              Waitlist &amp; CRM
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#9e9188",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Producer signups, early access cohorts, Attio sync telemetry, and verified email invitations.
            </p>
          </div>

          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "#8f847d" }}>
              Attio Integration
            </span>
            <Link
              href="/waitlist"
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#c29d74",
              }}
            >
              View Queue →
            </Link>
          </div>
        </div>

        {/* Card 3: Email Broadcasts */}
        <div
          style={{
            backgroundColor: "#1a1614",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "10px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#c29d74",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Direct Messaging
            </div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#f5f0eb",
                margin: "0 0 0.5rem 0",
              }}
            >
              Email Broadcasts
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#9e9188",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Newsletter delivery engine, subscriber segmentation, open tracking, and HTML delivery previews.
            </p>
          </div>

          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "#8f847d" }}>
              Resend Delivery
            </span>
            <Link
              href="/broadcasts"
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#c29d74",
              }}
            >
              Manage Campaigns →
            </Link>
          </div>
        </div>

        {/* Card 4: Audio Telemetry */}
        <div
          style={{
            backgroundColor: "#1a1614",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "10px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#c29d74",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Core Engine
            </div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#f5f0eb",
                margin: "0 0 0.5rem 0",
              }}
            >
              Audio Telemetry
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#9e9188",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Stem separation engine status, pipeline latency, audio compression health, and model performance.
            </p>
          </div>

          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "#10b981", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
              Nominal
            </span>
            <Link
              href="/telemetry"
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#c29d74",
              }}
            >
              View Telemetry →
            </Link>
          </div>
        </div>
      </div>

      {/* Integration & Operational Health Details */}
      <div
        style={{
          backgroundColor: "#171412",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "10px",
          padding: "1.75rem",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#f5f0eb",
            margin: "0 0 1rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
          Connected Operational Services
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            fontSize: "0.82rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#1f1a17",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div style={{ fontWeight: 600, color: "#f5f0eb", marginBottom: "0.35rem" }}>
              Sanity Content Lake
            </div>
            <div style={{ color: "#9e9188", lineHeight: 1.5 }}>
              Project: <code>{projectId}</code>
              <br />
              Dataset: <code>{dataset}</code>
              <br />
              CORS Origins: <code>studio.localhost:3000</code>, <code>studio.soundgoose.com</code>
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              backgroundColor: "#1f1a17",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div style={{ fontWeight: 600, color: "#f5f0eb", marginBottom: "0.35rem" }}>
              Team Access Perimeter
            </div>
            <div style={{ color: "#9e9188", lineHeight: 1.5 }}>
              Domain: <code>studio.soundgoose.com</code>
              <br />
              Gate: Passcode session cookie (7 days)
              <br />
              Public website: <code>soundgoose.com/studio</code> strictly blocked (404)
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              backgroundColor: "#1f1a17",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div style={{ fontWeight: 600, color: "#f5f0eb", marginBottom: "0.35rem" }}>
              Monorepo Workspaces
            </div>
            <div style={{ color: "#9e9188", lineHeight: 1.5 }}>
              Next.js Web: <code>apps/web</code> (Port 3000)
              <br />
              Standalone Studio: <code>studio/</code> (Sanity v6 CLI)
              <br />
              Typegen: <code>sanity typegen generate</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
