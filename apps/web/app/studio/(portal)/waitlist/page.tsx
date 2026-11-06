export const metadata = {
  title: "Waitlist & CRM | Sound Goose Studio",
};

export default function StudioWaitlistPage() {
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
            Audience Pipeline &amp; Cohorts
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
            Waitlist &amp; CRM Management
          </h1>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            style={{
              backgroundColor: "#201b18",
              color: "#d1c7bf",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontWeight: 500,
              fontSize: "0.85rem",
              padding: "0.6rem 1.15rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Export CSV
          </button>
          <a
            href="https://app.attio.com"
            target="_blank"
            rel="noopener noreferrer"
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
            Open Attio CRM ↗
          </a>
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
          <div style={{ fontSize: "0.75rem", color: "#9e9188", marginBottom: "0.35rem" }}>
            Total Waitlist Requests
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f5f0eb" }}>
            1,482
          </div>
          <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "0.35rem" }}>
            +18% from last week
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
          <div style={{ fontSize: "0.75rem", color: "#9e9188", marginBottom: "0.35rem" }}>
            Producers &amp; Engineers
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f5f0eb" }}>
            864
          </div>
          <div style={{ fontSize: "0.75rem", color: "#c29d74", marginTop: "0.35rem" }}>
            58% of cohort
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
          <div style={{ fontSize: "0.75rem", color: "#9e9188", marginBottom: "0.35rem" }}>
            Attio Sync State
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#10b981" }}>
            100%
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9e9188", marginTop: "0.35rem" }}>
            Webhook latency &lt; 200ms
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
          <div style={{ fontSize: "0.75rem", color: "#9e9188", marginBottom: "0.35rem" }}>
            Invited Beta Cohort
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f5f0eb" }}>
            120
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9e9188", marginTop: "0.35rem" }}>
            Phase 1 Private Preview
          </div>
        </div>
      </div>

      {/* Queue Table */}
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
          <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#f5f0eb" }}>
            Recent Signups Queue
          </div>
          <span style={{ fontSize: "0.75rem", color: "#9e9188" }}>
            Live sync via /api/waitlist
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", color: "#8f847d", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
                <th style={{ padding: "0.85rem 1.5rem" }}>Email</th>
                <th style={{ padding: "0.85rem 1.5rem" }}>Profile</th>
                <th style={{ padding: "0.85rem 1.5rem" }}>Date Added</th>
                <th style={{ padding: "0.85rem 1.5rem" }}>CRM Status</th>
                <th style={{ padding: "0.85rem 1.5rem" }}>Access Level</th>
              </tr>
            </thead>
            <tbody>
              {[
                { email: "marcus.k@electricsound.fm", profile: "Mixing Engineer", date: "Just now", status: "Synced", access: "Queued" },
                { email: "sarah.vocal@studio42.co", profile: "Recording Artist", date: "14m ago", status: "Synced", access: "Invited (Phase 1)" },
                { email: "devon.beats@audiolab.io", profile: "Music Producer", date: "1h ago", status: "Synced", access: "Queued" },
                { email: "elena@berklee.alumni.org", profile: "Mastering Engineer", date: "3h ago", status: "Synced", access: "Invited (Phase 1)" },
                { email: "j.torres@sonicsyndicate.com", profile: "Label A&R", date: "5h ago", status: "Synced", access: "Queued" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <td style={{ padding: "0.85rem 1.5rem", color: "#f5f0eb", fontWeight: 500 }}>{row.email}</td>
                  <td style={{ padding: "0.85rem 1.5rem", color: "#d1c7bf" }}>{row.profile}</td>
                  <td style={{ padding: "0.85rem 1.5rem", color: "#8f847d" }}>{row.date}</td>
                  <td style={{ padding: "0.85rem 1.5rem" }}>
                    <span style={{ color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.72rem" }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1.5rem", color: row.access.startsWith("Invited") ? "#c29d74" : "#8f847d" }}>
                    {row.access}
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
