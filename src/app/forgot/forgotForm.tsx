"use client";

import { useState } from "react";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mt-6 flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
          const res = await fetch("/api/auth/forgot", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email }),
          });
          if (!res.ok) throw new Error(`Request failed (${res.status})`);
          setSent(true);
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e));
        } finally {
          setLoading(false);
        }
      }}
    >
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {sent ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-[var(--muted)]">
          If an account exists for that email, a reset link has been sent.
        </div>
      ) : null}

      <label className="text-sm font-semibold text-[var(--text)]">Email</label>
      <input
        className="w-full rounded-lg border border-slate-200 px-3 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@domain.com"
        type="email"
        autoComplete="email"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
