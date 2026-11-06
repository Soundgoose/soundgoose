"use client";

import { useState } from "react";
import Image from "next/image";

export default function StudioLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/studio/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        // Redirect to portal root
        window.location.href = "/";
      } else {
        setError(data.error || "Incorrect passcode. Please try again.");
      }
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#12100e",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#1a1614",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "12px",
          padding: "2.5rem 2rem",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.45)",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <Image
            src="/logo.png"
            alt="Sound Goose"
            width={150}
            height={50}
            style={{ width: "auto", height: "38px", margin: "0 auto" }}
            priority
          />
          <div
            style={{
              display: "inline-block",
              marginTop: "0.85rem",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#c29d74",
              background: "rgba(194, 157, 116, 0.12)",
              padding: "0.25rem 0.65rem",
              borderRadius: "4px",
              border: "1px solid rgba(194, 157, 116, 0.25)",
            }}
          >
            Team Operations Portal
          </div>
        </div>

        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#f5f0eb",
            margin: "0 0 0.5rem 0",
            fontFamily: "var(--font-display), Georgia, serif",
          }}
        >
          Staff Passcode Gate
        </h1>

        <p
          style={{
            fontSize: "0.85rem",
            color: "#9e9188",
            margin: "0 0 1.75rem 0",
            lineHeight: 1.5,
          }}
        >
          Enter your team passcode to access editorial operations, Sanity
          Studio, waitlist intelligence, and email dispatches.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="studio-passcode"
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#c29d74",
                marginBottom: "0.5rem",
              }}
            >
              Passcode
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="studio-passcode"
                type={showPasscode ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter team passcode"
                required
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.75rem 2.75rem 0.75rem 0.9rem",
                  fontSize: "0.95rem",
                  backgroundColor: "#221d1a",
                  color: "#f5f0eb",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "6px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "#9e9188",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  padding: "4px",
                }}
              >
                {showPasscode ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: "0.7rem 0.9rem",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "6px",
                color: "#fca5a5",
                fontSize: "0.82rem",
                marginBottom: "1.25rem",
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !passcode.trim()}
            style={{
              width: "100%",
              padding: "0.8rem 1.25rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              backgroundColor: "#c29d74",
              color: "#12100e",
              border: "none",
              borderRadius: "6px",
              cursor: isLoading || !passcode.trim() ? "not-allowed" : "pointer",
              opacity: isLoading || !passcode.trim() ? 0.6 : 1,
              transition: "all 0.15s ease",
            }}
          >
            {isLoading ? "Authenticating..." : "Unlock Portal →"}
          </button>
        </form>

        <div
          style={{
            marginTop: "1.75rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            fontSize: "0.75rem",
            color: "#6b625b",
          }}
        >
          Protected team perimeter for Sound Goose staff.
        </div>
      </div>
    </div>
  );
}
