"use client";

import { useState } from "react";

export function NewsletterSubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Unable to subscribe right now.");

      setMessage("Subscribed. Thanks for joining.");
      setEmail("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to subscribe right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="you@company.com"
        className="w-full rounded-lg border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-[#0b1220] transition hover:brightness-95 disabled:opacity-60"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {message ? <p className="w-full text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="w-full text-sm text-red-300">{error}</p> : null}
    </form>
  );
}
