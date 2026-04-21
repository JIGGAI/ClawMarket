"use client";

import { useState } from "react";

type Props = {
  title?: string;
  source?: string;
};

export function ManagedServiceInterestForm({
  title = "Tell us what kind of managed AI team help you want and we&apos;ll follow up when early spots open.",
  source = "managed-services-form",
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    interest: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/managed-services/interest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Unable to submit right now.");

      setMessage("Got it. We&apos;ll reach out when managed AI team spots open.");
      setForm({ name: "", email: "", company: "", interest: "", notes: "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to submit right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-[var(--border)] bg-black/10 p-6">
      <p className="text-sm leading-6 text-[var(--muted)]">{title}</p>
      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-lg border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="you@company.com"
            className="w-full rounded-lg border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Company"
            className="w-full rounded-lg border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
            value={form.company}
            onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
          />
          <input
            type="text"
            placeholder="What do you want help with?"
            className="w-full rounded-lg border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
            value={form.interest}
            onChange={(e) => setForm((prev) => ({ ...prev, interest: e.target.value }))}
            required
          />
        </div>

        <textarea
          placeholder="Tell us about your workflows, team, goals, or integration needs"
          className="min-h-32 w-full rounded-lg border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-[#0b1220] transition hover:brightness-95 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Request info"}
          </button>
          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </div>
      </form>
    </div>
  );
}
