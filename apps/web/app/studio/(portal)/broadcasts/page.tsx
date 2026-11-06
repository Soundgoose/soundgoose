import Link from "next/link";

export const metadata = {
  title: "Broadcasts | Sound Goose Studio",
};

export default function StudioBroadcastsPage() {
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
      {/* Header */}
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
            Direct Editorial Delivery
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
            Weekly Digest Broadcasts
          </h1>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link
            href="/content"
            style={{
              backgroundColor: "#c29d74",
              color: "#12100e",
              fontWeight: 600,
              fontSize: "0.85rem",
              padding: "0.6rem 1.15rem",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Compose New Issue in Sanity →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#1a1614",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9e9188",
              marginBottom: "0.35rem",
            }}
          >
            Active Subscribers
          </div>
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f5f0eb" }}
          >
            2,450
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#10b981",
              marginTop: "0.35rem",
            }}
          >
            Verified double opt-in
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#1a1614",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9e9188",
              marginBottom: "0.35rem",
            }}
          >
            Average Open Rate
          </div>
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#c29d74" }}
          >
            54.2%
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9e9188",
              marginTop: "0.35rem",
            }}
          >
            Industry avg: 21.5%
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#1a1614",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9e9188",
              marginBottom: "0.35rem",
            }}
          >
            Delivery Engine
          </div>
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#10b981" }}
          >
            Resend
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9e9188",
              marginTop: "0.35rem",
            }}
          >
            DKIM / SPF Verified
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#1a1614",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9e9188",
              marginBottom: "0.35rem",
            }}
          >
            Broadcast Schedule
          </div>
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f5f0eb" }}
          >
            Thursdays
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#9e9188",
              marginTop: "0.35rem",
            }}
          >
            10:00 AM EST (Weekly)
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div
        style={{
          backgroundColor: "#1a1614",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ fontWeight: 600, fontSize: "0.95rem", color: "#f5f0eb" }}
          >
            Recent Newsletter Editions
          </div>
          <span style={{ fontSize: "0.75rem", color: "#9e9188" }}>
            Synchronized with Sanity schema <code>newsletter</code>
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "0.82rem",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                  color: "#8f847d",
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                }}
              >
                <th style={{ padding: "0.85rem 1.5rem" }}>Issue #</th>
                <th style={{ padding: "0.85rem 1.5rem" }}>Subject Title</th>
                <th style={{ padding: "0.85rem 1.5rem" }}>Status</th>
                <th style={{ padding: "0.85rem 1.5rem" }}>Subscribers</th>
                <th style={{ padding: "0.85rem 1.5rem" }}>Open Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  issue: "Issue #03",
                  title:
                    "Stem Isolation Standards and Frequency Clarity in 2026",
                  status: "Ready to Broadcast",
                  subs: "2,450",
                  open: "Pending",
                },
                {
                  issue: "Issue #02",
                  title: "Why Traditional Music Demos Get Lost in A&R Inboxes",
                  status: "Sent",
                  subs: "2,180",
                  open: "56.4%",
                },
                {
                  issue: "Issue #01",
                  title:
                    "Welcome to Sound Goose: The Architecture of Audio Velocity",
                  status: "Sent",
                  subs: "1,890",
                  open: "61.2%",
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  <td
                    style={{
                      padding: "0.85rem 1.5rem",
                      color: "#c29d74",
                      fontWeight: 600,
                    }}
                  >
                    {row.issue}
                  </td>
                  <td
                    style={{
                      padding: "0.85rem 1.5rem",
                      color: "#f5f0eb",
                      fontWeight: 500,
                    }}
                  >
                    {row.title}
                  </td>
                  <td style={{ padding: "0.85rem 1.5rem" }}>
                    <span
                      style={{
                        color: row.status === "Sent" ? "#10b981" : "#c29d74",
                        backgroundColor:
                          row.status === "Sent"
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(194, 157, 116, 0.1)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.72rem",
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1.5rem", color: "#d1c7bf" }}>
                    {row.subs}
                  </td>
                  <td
                    style={{
                      padding: "0.85rem 1.5rem",
                      color: row.open === "Pending" ? "#8f847d" : "#10b981",
                      fontWeight: 600,
                    }}
                  >
                    {row.open}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
