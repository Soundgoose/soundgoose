"use client";

import { useState } from "react";
import styles from "./newsletter-signup-card.module.css";

interface NewsletterSignupCardProps {
  title?: string;
  description?: string;
  eyebrow?: string;
  source?: string;
}

export function NewsletterSignupCard({
  title = "Get the Sound Goose Dispatch",
  description = "A bi-weekly newsletter on spatial audio workflows, engine optimization, and tips for modern producers. No spam, ever.",
  eyebrow = "Newsletter",
  source = "web-component",
}: NewsletterSignupCardProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
        setMessage(
          data.alreadySubscribed
            ? "You're already subscribed! Look out for our next issue in your inbox."
            : "You're subscribed! Welcome to the Sound Goose Dispatch.",
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section className={styles.card} aria-label="Newsletter Subscription">
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      {status === "success" ? (
        <div className={`${styles.message} ${styles.success}`}>{message}</div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="producer@studio.com"
            required
            aria-label="Email address"
            className={styles.input}
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={styles.button}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <div className={`${styles.message} ${styles.error}`}>{message}</div>
      )}

      <p className={styles.privacy}>
        Unsubscribe anytime. We respect your attention and your inbox.
      </p>
    </section>
  );
}
