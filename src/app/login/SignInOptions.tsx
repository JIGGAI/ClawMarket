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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

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
      // Only show interactive providers we support in this UI.
      .filter((p) => p.type === "oauth" || p.type === "credentials")
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

  const credentialsProvider = providerList.find((p) => p.type === "credentials");
  const oauthProviders = providerList.filter((p) => p.type === "oauth");

  return (
    <div className="mt-8">
      {/* Email + password */}
      {credentialsProvider ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-lg font-semibold text-[var(--text)]">Sign in with email</div>
          <p className="mt-1 text-sm text-[var(--muted)]">Use your email + password.</p>

          <div className="mt-4 flex flex-col gap-3">
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />

            <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <button
              type="button"
              disabled={signingIn}
              className="rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:brightness-110 disabled:opacity-60"
              onClick={async () => {
                setError(null);
                setSigningIn(true);
                try {
                  await signIn(credentialsProvider.id, { callbackUrl, email, password, rememberMe });
                } catch (e) {
                  setError(e instanceof Error ? e.message : String(e));
                } finally {
                  setSigningIn(false);
                }
              }}
            >
              {signingIn ? "Signing in…" : "Sign in"}
            </button>

            <div className="flex items-center justify-between text-sm">
              <a className="text-[color:var(--coral-bright)] underline" href="/signup">
                Create account
              </a>
              <a className="text-[var(--muted)] underline" href="/forgot">
                Forgot password
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {/* OAuth providers */}
      {oauthProviders.length ? (
        <div className={credentialsProvider ? "mt-6" : ""}>
          <div className="text-sm font-semibold text-[var(--text)]">Or continue with</div>
          <div className="mt-3 flex flex-col gap-3">
            {oauthProviders.map((p) => (
              <button
                key={p.id}
                className="rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:brightness-110"
                onClick={async () => {
                  setError(null);
                  try {
                    await signIn(p.id, { callbackUrl });
                  } catch (e) {
                    setError(e instanceof Error ? e.message : String(e));
                  }
                }}
                type="button"
              >
                Continue with {p.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
