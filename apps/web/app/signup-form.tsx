"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { joinWaitlist, type WaitlistMetadata } from "./actions";
import styles from "./signup-form.module.css";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [utmParams, setUtmParams] = useState<WaitlistMetadata>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "already_registered" | "error"
  >("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const utmKeys: (keyof WaitlistMetadata)[] = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "ref",
      ];

      const captured: WaitlistMetadata = {};
      let hasParams = false;

      for (const key of utmKeys) {
        const val = searchParams.get(key);
        if (val) {
          captured[key] = val;
          hasParams = true;
        }
      }

      if (hasParams) {
        sessionStorage.setItem("soundgoose_utm", JSON.stringify(captured));
        setUtmParams(captured);
      } else {
        const saved = sessionStorage.getItem("soundgoose_utm");
        if (saved) {
          setUtmParams(JSON.parse(saved));
        }
      }
    } catch {
      // Storage unavailable or blocked
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setError("");

    const result = await joinWaitlist(email.trim(), utmParams);

    if (result.ok) {
      if (result.alreadyRegistered) {
        track("waitlist_signup", {
          status: "already_registered",
          ...utmParams,
        });
        setStatus("already_registered");
      } else {
        track("waitlist_signup", {
          status: "success",
          ...utmParams,
        });
        setStatus("success");
      }
    } else {
      track("waitlist_signup_error", {
        reason: result.error ?? "unknown",
        ...utmParams,
      });
      setStatus("error");
      setError(result.error ?? "Something went wrong. Try again.");
    }
  }

  if (status === "already_registered") {
    return (
      <div className={styles.success}>
        <p className={styles.successHeading}>
          You&rsquo;re already on the waitlist!
        </p>
        <p className={styles.successNote}>
          Your spot is saved. We&rsquo;ll reach out when your access is ready.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={styles.success}>
        <p className={styles.successHeading}>
          You&rsquo;re on the list for early access.
        </p>
        <p className={styles.successNote}>
          We&rsquo;ll reach out when it&rsquo;s your turn.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          className={styles.input}
          disabled={status === "submitting"}
          autoComplete="email"
        />
        <button
          type="submit"
          className={styles.button}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Joining\u2026" : "Join the Waitlist"}
        </button>
      </div>
      {status === "error" && <p className={styles.error}>{error}</p>}
      <p className={styles.trust}>
        Free early pro access for the first 100 artists. No spam.
      </p>
    </form>
  );
}
