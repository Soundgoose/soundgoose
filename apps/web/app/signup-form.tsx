"use client";

import { useState } from "react";
import { joinWaitlist } from "./actions";
import styles from "./signup-form.module.css";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setError("");

    const result = await joinWaitlist(email.trim());

    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setError(result.error ?? "Something went wrong. Try again.");
    }
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
