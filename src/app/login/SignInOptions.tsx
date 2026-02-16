"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";

type Provider = {
  id: string;
  name: string;
  type: string;
};

export default function SignInOptions({ callbackUrl }: { callbackUrl: string }) {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/providers", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to load providers (${res.status})`);
        }
        const data = (await res.json()) as Record<string, Provider>;
        if (!cancelled) setProviders(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const providerList = useMemo(() => {
    if (!providers) return [];
    return Object.values(providers)
      .filter((p) => p.type === "oauth" || p.type === "email")
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [providers]);

  if (error) {
    return (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Couldn’t load sign-in options: {error}
      </div>
    );
  }

  if (!providers) {
    return <div className="mt-6 text-sm text-[var(--muted)]">Loading sign-in options…</div>;
  }

  if (!providerList.length) {
    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-[var(--muted)]">
        No sign-in providers are enabled. Configure OAuth env vars (e.g. AUTH_GITHUB_ID/AUTH_GITHUB_SECRET) for this
        environment.
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3">
      {providerList.map((p) => (
        <button
          key={p.id}
          className="rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:brightness-110"
          onClick={() => signIn(p.id, { callbackUrl })}
          type="button"
        >
          Continue with {p.name}
        </button>
      ))}
    </div>
  );
}
