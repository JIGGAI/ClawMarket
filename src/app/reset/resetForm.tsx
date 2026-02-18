"use client";

import { useState } from "react";

export default function ResetForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <form
      className="mt-6 flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
          const res = await fetch("/api/auth/reset", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ token, password }),
          });
          const data = (await res.json()) as { ok?: boolean; error?: string };
          if (!res.ok) throw new Error(data.error || `Reset failed (${res.status})`);
          setDone(true);

          // Attempt sign-in if we can (user will still need to enter email).
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

      {done ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-[var(--muted)]">
          Password updated. You can now sign in.
        </div>
      ) : null}

      <label className="text-sm font-semibold text-[var(--text)]">New password</label>
      <input
        className="w-full rounded-lg border border-slate-200 px-3 py-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 8 characters"
        type="password"
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={loading || !token}
        className="mt-2 rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Updating…" : "Update password"}
      </button>

      {!token ? (
        <div className="text-sm text-red-700">Missing reset token.</div>
      ) : null}
    </form>
  );
}
