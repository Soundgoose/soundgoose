"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";
import { getProjectId, dataset } from "../../../sanity/env";

export function Studio() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  // Sanity connection state
  const [currentProjectId, setCurrentProjectId] = useState<string>("");
  const [inputProjectId, setInputProjectId] = useState<string>("");
  const [inputDataset, setInputDataset] = useState<string>("production");
  const [connectionMessage, setConnectionMessage] = useState<string>("");

  useEffect(() => {
    // Check if already authenticated in this session
    try {
      const storedAuth = localStorage.getItem("sg_studio_authenticated");
      setIsAuthenticated(storedAuth === "true");

      const pid = getProjectId();
      setCurrentProjectId(pid);
      if (pid) {
        setInputProjectId(pid);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!passcode) {
      setError("Please enter the team passcode.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/studio/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        try {
          localStorage.setItem("sg_studio_authenticated", "true");
        } catch {
          // ignore storage error
        }
        setIsAuthenticated(true);
      } else {
        setError(data.error || "Incorrect passcode. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSaveSanityConfig(e: React.FormEvent) {
    e.preventDefault();
    const trimmedPid = inputProjectId.trim();
    if (!trimmedPid) {
      setConnectionMessage("Please enter a valid Sanity Project ID.");
      return;
    }

    try {
      localStorage.setItem("sg_sanity_project_id", trimmedPid);
      setConnectionMessage("Project ID saved. Connecting to Sanity Studio...");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch {
      setConnectionMessage(
        "Could not save to local storage. Please add NEXT_PUBLIC_SANITY_PROJECT_ID to .env.local",
      );
    }
  }

  function handleDisconnect() {
    try {
      localStorage.removeItem("sg_sanity_project_id");
      window.location.reload();
    } catch {
      // ignore
    }
  }

  function handleLockStudio() {
    try {
      localStorage.removeItem("sg_studio_authenticated");
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  }

  // Initial loading state while reading localStorage
  if (isAuthenticated === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eee5dc",
          fontFamily: "var(--font-body), system-ui, sans-serif",
          color: "#40271e",
        }}
      >
        Loading Sound Goose Studio...
      </div>
    );
  }

  // Passcode gate (First pass modal inside studio page)
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eee5dc",
          padding: "1.5rem",
          fontFamily: "var(--font-body), system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#faf7f4",
            border: "1px solid rgba(115, 81, 61, 0.2)",
            borderRadius: "14px",
            padding: "2.5rem 2rem",
            boxShadow: "0 12px 32px rgba(64, 39, 30, 0.08)",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "1.25rem" }}>
            <Image
              src="/logo.png"
              alt="Sound Goose"
              width={140}
              height={46}
              style={{ height: "42px", width: "auto", objectFit: "contain" }}
              priority
            />
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#40271e",
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Sound Goose Studio
          </h1>

          <p
            style={{
              fontSize: "0.92rem",
              lineHeight: 1.55,
              color: "#73513d",
              marginBottom: "1.75rem",
            }}
          >
            Protected team portal. Enter your team passcode below to unlock the
            content studio.
          </p>

          <form onSubmit={handleUnlock} style={{ textAlign: "left" }}>
            <label
              htmlFor="studio-passcode"
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#40271e",
                marginBottom: "0.5rem",
              }}
            >
              Team Passcode
            </label>

            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <input
                id="studio-passcode"
                type={showPasscode ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                autoFocus
                required
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "0.75rem 2.5rem 0.75rem 1rem",
                  fontSize: "1rem",
                  border: "1px solid rgba(115, 81, 61, 0.25)",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#0a0609",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                title={showPasscode ? "Hide passcode" : "Show passcode"}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#73513d",
                  fontSize: "0.85rem",
                  padding: "0.25rem",
                }}
              >
                {showPasscode ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <div
                style={{
                  padding: "0.6rem 0.85rem",
                  borderRadius: "6px",
                  background: "#fdf2f2",
                  border: "1px solid #f8b4b4",
                  color: "#9b1c1c",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.8rem 1.25rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                background: "#40271e",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s ease",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Verifying..." : "Unlock Studio →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Once authenticated, if Sanity Project ID is missing or placeholder, provide direct setup guide
  const hasValidProject = Boolean(
    currentProjectId && currentProjectId !== "placeholder-project-id",
  );

  if (!hasValidProject) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eee5dc",
          padding: "2rem 1.5rem",
          fontFamily: "var(--font-body), system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            background: "#faf7f4",
            border: "1px solid rgba(115, 81, 61, 0.2)",
            borderRadius: "14px",
            padding: "2.5rem",
            boxShadow: "0 12px 32px rgba(64, 39, 30, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
            }}
          >
            <Image
              src="/logo.png"
              alt="Sound Goose"
              width={130}
              height={42}
              style={{ height: "38px", width: "auto", objectFit: "contain" }}
              priority
            />
            <button
              onClick={handleLockStudio}
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#73513d",
                background: "transparent",
                border: "1px solid rgba(115, 81, 61, 0.25)",
                padding: "0.35rem 0.75rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Lock Studio
            </button>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "1.65rem",
              fontWeight: 700,
              color: "#40271e",
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Connect Sanity Project
          </h2>

          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "#73513d",
              marginBottom: "1.75rem",
            }}
          >
            Sanity Studio is unlocked and ready to manage Liner Notes and Weekly
            Digest issues. Enter your Sanity Project ID below to link your
            content repository.
          </p>

          <form onSubmit={handleSaveSanityConfig}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                htmlFor="sanity-project-id"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#40271e",
                  marginBottom: "0.4rem",
                }}
              >
                Sanity Project ID
              </label>
              <input
                id="sanity-project-id"
                type="text"
                value={inputProjectId}
                onChange={(e) => setInputProjectId(e.target.value)}
                placeholder="e.g. 5x72vkm1"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  border: "1px solid rgba(115, 81, 61, 0.25)",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#0a0609",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="sanity-dataset"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#40271e",
                  marginBottom: "0.4rem",
                }}
              >
                Dataset
              </label>
              <input
                id="sanity-dataset"
                type="text"
                value={inputDataset}
                onChange={(e) => setInputDataset(e.target.value)}
                placeholder="production"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  border: "1px solid rgba(115, 81, 61, 0.25)",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#0a0609",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {connectionMessage && (
              <div
                style={{
                  padding: "0.65rem 0.85rem",
                  borderRadius: "6px",
                  background: "rgba(217, 166, 137, 0.2)",
                  border: "1px solid #d9a689",
                  color: "#40271e",
                  fontSize: "0.88rem",
                  marginBottom: "1.25rem",
                }}
              >
                {connectionMessage}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.85rem 1.25rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                background: "#40271e",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Save &amp; Launch Studio →
            </button>
          </form>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(115, 81, 61, 0.15)",
              fontSize: "0.85rem",
              color: "#73513d",
              lineHeight: 1.6,
            }}
          >
            <strong>Setup Checklist:</strong>
            <ol style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
              <li>
                Create or open your Sanity project at{" "}
                <a
                  href="https://sanity.io/manage"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#40271e", textDecoration: "underline" }}
                >
                  sanity.io/manage
                </a>
              </li>
              <li>
                In Sanity Manage &rarr; <em>API</em> &rarr;{" "}
                <em>CORS Origins</em>, add{" "}
                <code>http://studio.localhost:3000</code> and{" "}
                <code>https://studio.soundgoose.com</code> with credentials
                enabled.
              </li>
              <li>
                For persistent deployments, set{" "}
                <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in Vercel or{" "}
                <code>apps/web/.env.local</code>.
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // If unlocked and Sanity is configured, render the full embedded Sanity Studio!
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <NextStudio config={config} />

      {/* Floating Status Bar / Lock Controller */}
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 99999,
          background: "rgba(64, 39, 30, 0.92)",
          backdropFilter: "blur(8px)",
          color: "#ffffff",
          padding: "0.45rem 0.85rem",
          borderRadius: "9999px",
          fontSize: "0.78rem",
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
          fontFamily: "var(--font-body), system-ui, sans-serif",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#34d399",
          }}
        />
        <span>
          Project: <strong>{currentProjectId}</strong> ({dataset})
        </span>
        <button
          onClick={handleDisconnect}
          title="Change project ID"
          style={{
            background: "transparent",
            border: "none",
            color: "#d9a689",
            cursor: "pointer",
            fontSize: "0.75rem",
            textDecoration: "underline",
            padding: 0,
          }}
        >
          Change
        </button>
        <span style={{ opacity: 0.5 }}>|</span>
        <button
          onClick={handleLockStudio}
          title="Lock studio session"
          style={{
            background: "transparent",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "0.75rem",
            textDecoration: "underline",
            padding: 0,
          }}
        >
          Lock
        </button>
      </div>
    </div>
  );
}
