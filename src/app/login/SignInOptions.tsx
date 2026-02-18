"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { ReCaptchaV2 } from "@/components/ReCaptchaV2";

type Provider = {
  id: string;
  name: string;
  type: string;
};

export default function SignInOptions({ callbackUrl }: { callbackUrl: string }) {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || "";

  const [email, setEmail] = useState("");
  const [emailSending, setEmailSending] = useState(false);

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

  async function ensureCaptcha() {
    if (!siteKey) throw new Error("Captcha is not configured (missing NEXT_PUBLIC_CAPTCHA_SITE_KEY)");
    if (!captchaToken) throw new Error("Please complete the captcha challenge");

    const res = await fetch("/api/captcha/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: captchaToken }),
    });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !json.ok) throw new Error(json.error || `Captcha verify failed (${res.status})`);
  }

  const emailProvider = providerList.find((p) => p.type === "email");
  const oauthProviders = providerList.filter((p) => p.type === "oauth");

  return (
    <div className="mt-8">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-sm font-semibold text-[var(--text)]">Human check</div>
        <p className="mt-1 text-sm text-[var(--muted)]">Complete the captcha before signing in.</p>
        <div className="mt-3">
          {siteKey ? (
            <ReCaptchaV2 siteKey={siteKey} onToken={setCaptchaToken} />
          ) : (
            <div className="text-sm text-red-700">Missing NEXT_PUBLIC_CAPTCHA_SITE_KEY</div>
          )}
        </div>
      </div>

      {/* Email magic-link (passwordless). */}
      {emailProvider ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-lg font-semibold text-[var(--text)]">Sign in with email</div>
          <p className="mt-1 text-sm text-[var(--muted)]">We’ll send you a magic link.</p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <button
              type="button"
              disabled={emailSending}
              className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
              onClick={async () => {
                setError(null);
                setEmailSending(true);
                try {
                  await ensureCaptcha();
                  await signIn(emailProvider.id, { callbackUrl, email });
                } catch (e) {
                  setError(e instanceof Error ? e.message : String(e));
                } finally {
                  setEmailSending(false);
                }
              }}
            >
              {emailSending ? "Sending…" : "Send magic link"}
            </button>
          </div>
        </div>
      ) : null}

      {/* OAuth providers */}
      {oauthProviders.length ? (
        <div className="mt-6">
          <div className="text-sm font-semibold text-[var(--text)]">Or continue with</div>
          <div className="mt-3 flex flex-col gap-3">
            {oauthProviders.map((p) => (
              <button
                key={p.id}
                className="rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:brightness-110"
                onClick={async () => {
                  setError(null);
                  try {
                    await ensureCaptcha();
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
