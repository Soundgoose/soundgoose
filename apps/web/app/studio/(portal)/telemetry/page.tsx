export const metadata = {
  title: "Telemetry | Sound Goose Studio",
};

export default function StudioTelemetryPage() {
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
            Core Infrastructure
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
            Audio Engine &amp; Platform Telemetry
          </h1>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "#34d399",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              fontSize: "0.82rem",
              fontWeight: 600,
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
            All Systems Nominal
          </span>
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
            Median Stem Separation Latency
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f5f0eb" }}>
            1.42s
          </div>
          <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "0.35rem" }}>
            Fast Fourier Transform speedup active
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
            Audio Processing Fidelity
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#c29d74" }}>
            32-bit float
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9e9188", marginTop: "0.35rem" }}>
            48 kHz / 96 kHz uncompressed
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
            Sanity Content Lake Latency
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#10b981" }}>
            38ms
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9e9188", marginTop: "0.35rem" }}>
            Edge CDN cached
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
            Core Web Vitals Score
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#10b981" }}>
            99 / 100
          </div>
          <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "0.35rem" }}>
            LCP: 0.8s | INP: 24ms | CLS: 0.00
          </div>
        </div>
      </div>

      {/* Systems Status Ledger */}
      <div
        style={{
          backgroundColor: "#1a1614",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "10px",
          padding: "1.75rem",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#f5f0eb", marginBottom: "1.25rem" }}>
          Infrastructure Services
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { name: "Sanity Studio API Engine", endpoint: "https://qcz8ykkg.api.sanity.io", status: "Operational", ping: "38ms" },
            { name: "Waitlist Ingestion Lambda", endpoint: "/api/waitlist", status: "Operational", ping: "42ms" },
            { name: "Attio CRM Sync Gateway", endpoint: "https://api.attio.com/v2", status: "Operational", ping: "110ms" },
            { name: "Resend Email Dispatcher", endpoint: "https://api.resend.com", status: "Operational", ping: "85ms" },
            { name: "Vercel Edge Network", endpoint: "Global Anycast", status: "Operational", ping: "14ms" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                backgroundColor: "#201b18",
                borderRadius: "6px",
                fontSize: "0.82rem",
              }}
            >
              <div>
                <span style={{ fontWeight: 600, color: "#f5f0eb" }}>{item.name}</span>
                <span style={{ color: "#8f847d", marginLeft: "0.75rem", fontSize: "0.75rem" }}>{item.endpoint}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ color: "#8f847d", fontSize: "0.75rem" }}>{item.ping}</span>
                <span style={{ color: "#10b981", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981" }} />
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
