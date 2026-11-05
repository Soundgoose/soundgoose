"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export function Studio() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  useEffect(() => {
    // Check if already authenticated in this session
    try {
      const stored = localStorage.getItem("sg_studio_authenticated");
      if (stored === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
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
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
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

  // If unlocked, render the full Sanity Studio
  if (isAuthenticated) {
    return <NextStudio config={config} />;
  }

  // Otherwise, render the in-page Passcode Gate (not a browser pop-up!)
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
