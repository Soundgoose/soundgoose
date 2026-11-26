"use client";

import { useState } from "react";

export function SyncAttioButton({
  style,
  label = "Sync Attio to Resend ↻",
}: {
  style?: React.CSSProperties;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/attio/sync", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Sync request failed.");
      }

      setResult(`✓ Synced ${data.syncedToResend} contacts to Resend Audience`);
      setTimeout(() => setResult(null), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setResult(`✕ Error: ${msg}`);
      setTimeout(() => setResult(null), 8000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
      <button
        onClick={handleSync}
        disabled={loading}
        style={{
          backgroundColor: "#201b18",
          color: "#f5f0eb",
          border: "1px solid rgba(194, 157, 116, 0.4)",
          fontWeight: 600,
          fontSize: "0.85rem",
          padding: "0.6rem 1.15rem",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "all 0.15s ease",
          ...style,
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#c29d74",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Syncing Attio...
          </>
        ) : (
          label
        )}
      </button>

      {result && (
        <span
          style={{
            fontSize: "0.78rem",
            color: result.startsWith("✓") ? "#10b981" : "#ef4444",
            backgroundColor: result.startsWith("✓")
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(239, 68, 68, 0.1)",
            padding: "0.25rem 0.6rem",
            borderRadius: "4px",
            border: `1px solid ${
              result.startsWith("✓")
                ? "rgba(16, 185, 129, 0.2)"
                : "rgba(239, 68, 68, 0.2)"
            }`,
          }}
        >
          {result}
        </span>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
