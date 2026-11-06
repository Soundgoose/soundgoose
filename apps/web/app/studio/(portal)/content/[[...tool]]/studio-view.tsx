"use client";

import {
  useEffect,
  useState,
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import config from "../../../../../sanity.config";
import { projectId, dataset } from "../../../../../sanity/env";

// Dynamic import with SSR disabled to prevent React 19 SSR hydration mismatches
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <StudioLoadingState message="Initializing Content Studio..." />
    ),
  },
);

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class StudioErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Caught Studio render boundary error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.handleReset);
    }
    return this.props.children;
  }
}

export function StudioView() {
  const [origin, setOrigin] = useState<string>("");
  const [corsStatus, setCorsStatus] = useState<
    "checking" | "allowed" | "blocked" | "offline"
  >("checking");
  const [checkingAgain, setCheckingAgain] = useState(false);

  async function checkCors(targetOrigin: string) {
    try {
      // Test the Sanity project endpoint with credentials
      const res = await fetch(
        `https://${projectId}.api.sanity.io/v2024-11-01/projects/${projectId}`,
        {
          method: "GET",
          mode: "cors",
        },
      );

      // If we get 403 with CORS forbidden or blocked, we know CORS is missing
      if (res.status === 403) {
        const data = await res.json().catch(() => null);
        if (
          data?.message?.includes("CORS") ||
          data?.error?.includes("Forbidden")
        ) {
          setCorsStatus("blocked");
          return;
        }
      }

      // 401 or 200 means CORS origin is accepted by Sanity gateway
      if (res.status === 200 || res.status === 401) {
        setCorsStatus("allowed");
        return;
      }

      setCorsStatus("allowed");
    } catch {
      // Browser blocked fetch due to CORS policy
      setCorsStatus("blocked");
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentOrigin = window.location.origin;
      setOrigin(currentOrigin);
      checkCors(currentOrigin);
    }
  }, []);

  async function handleRetry() {
    setCheckingAgain(true);
    await checkCors(origin || window.location.origin);
    setCheckingAgain(false);
  }

  // 1. Initial Checking State
  if (corsStatus === "checking") {
    return (
      <StudioLoadingState message="Connecting to Sanity Content Lake..." />
    );
  }

  // 2. CORS Blocked State: Prevent React 19 crash and provide 1-click authorization
  if (corsStatus === "blocked") {
    const corsManageUrl = `https://sanity.io/manage/project/${projectId}/api?cors=add&origin=${encodeURIComponent(
      origin,
    )}&credentials=true`;

    return (
      <div
        style={{
          flex: 1,
          minHeight: "calc(100vh - 52px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          backgroundColor: "#12100e",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "580px",
            width: "100%",
            backgroundColor: "#1a1614",
            border: "1px solid rgba(194, 157, 116, 0.25)",
            borderRadius: "12px",
            padding: "2.5rem 2rem",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.45)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#c29d74",
              backgroundColor: "rgba(194, 157, 116, 0.12)",
              padding: "0.25rem 0.65rem",
              borderRadius: "4px",
              border: "1px solid rgba(194, 157, 116, 0.25)",
              marginBottom: "1rem",
            }}
          >
            One-Time Sanity Setup
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#f5f0eb",
              margin: "0 0 0.75rem 0",
              letterSpacing: "-0.01em",
            }}
          >
            Authorize CORS Origin in Sanity
          </h2>

          <p
            style={{
              fontSize: "0.85rem",
              color: "#a89d95",
              lineHeight: 1.6,
              margin: "0 0 1.5rem 0",
            }}
          >
            Your Sanity project <code>{projectId}</code> requires CORS origin
            permission for this domain so Studio can safely authenticate and
            load documents without browser security blocks.
          </p>

          <div
            style={{
              backgroundColor: "#201b18",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "1rem 1.25rem",
              marginBottom: "1.75rem",
              fontSize: "0.8rem",
            }}
          >
            <div style={{ color: "#8f847d", marginBottom: "0.35rem" }}>
              Origin to authorize:
            </div>
            <code
              style={{ color: "#34d399", fontSize: "0.9rem", fontWeight: 600 }}
            >
              {origin}
            </code>
            <div
              style={{
                color: "#8f847d",
                marginTop: "0.5rem",
                fontSize: "0.75rem",
              }}
            >
              Allow credentials: <strong>Enabled (checked)</strong>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.85rem",
              flexWrap: "wrap",
              marginBottom: "2rem",
            }}
          >
            <a
              href={corsManageUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#c29d74",
                color: "#12100e",
                fontWeight: 600,
                fontSize: "0.88rem",
                padding: "0.7rem 1.25rem",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "opacity 0.15s ease",
              }}
            >
              Authorize in Sanity Manage ↗
            </a>

            <button
              onClick={handleRetry}
              disabled={checkingAgain}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#2a231f",
                color: "#f5f0eb",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                fontWeight: 500,
                fontSize: "0.88rem",
                padding: "0.7rem 1.25rem",
                borderRadius: "6px",
                cursor: checkingAgain ? "not-allowed" : "pointer",
                opacity: checkingAgain ? 0.6 : 1,
              }}
            >
              {checkingAgain ? "Checking..." : "Verify & Launch Studio →"}
            </button>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              paddingTop: "1.25rem",
              fontSize: "0.76rem",
              color: "#73665c",
              lineHeight: 1.5,
            }}
          >
            <strong>Quick steps:</strong>
            <ol style={{ paddingLeft: "1.1rem", margin: "0.4rem 0 0 0" }}>
              <li>Click &ldquo;Authorize in Sanity Manage&rdquo; above.</li>
              <li>
                Confirm the pre-filled origin and click <em>Save</em>.
              </li>
              <li>
                Return here and click &ldquo;Verify &amp; Launch Studio&rdquo;.
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // 3. CORS Allowed: Render NextStudio safely within error boundary
  return (
    <div
      style={{
        flex: 1,
        height: "calc(100vh - 52px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <StudioErrorBoundary
        fallback={(error, reset) => (
          <div
            style={{
              padding: "3rem 2rem",
              textAlign: "center",
              color: "#f5f0eb",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              Studio Session Notice
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#9e9188",
                marginBottom: "1.5rem",
              }}
            >
              {error.message ||
                "An unexpected error occurred while loading Sanity Studio."}
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: "#c29d74",
                color: "#12100e",
                padding: "0.6rem 1.2rem",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Reload Studio
            </button>
          </div>
        )}
      >
        <NextStudio config={config} />
      </StudioErrorBoundary>
    </div>
  );
}

function StudioLoadingState({ message }: { message: string }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: "calc(100vh - 52px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#12100e",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          border: "2px solid rgba(194, 157, 116, 0.2)",
          borderTopColor: "#c29d74",
          borderRadius: "50%",
          animation: "sgSpin 0.8s linear infinite",
        }}
      />
      <div style={{ fontSize: "0.85rem", color: "#a89d95" }}>{message}</div>
      <style>{`
        @keyframes sgSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
