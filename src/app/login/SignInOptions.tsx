"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [emailSending, setEmailSending] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;
  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const captchaWidgetIdRef = useRef<number | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);

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

  // Load and render reCAPTCHA v2 checkbox (explicit render).
  useEffect(() => {
    if (!siteKey) return;

    const w = window as unknown as {
      grecaptcha?: {
        render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void }) => number;
        reset: (id: number) => void;
      };
    };

    let cancelled = false;

    const ensureScript = async () => {
      if (w.grecaptcha) return;
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[data-oc-recaptcha="1"]');
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA script")));
          return;
        }

        const s = document.createElement("script");
        s.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        s.async = true;
        s.defer = true;
        s.dataset.ocRecaptcha = "1";
        s.addEventListener("load", () => resolve());
        s.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA script")));
        document.head.appendChild(s);
      });
    };

    (async () => {
      try {
        setCaptchaLoading(true);
        await ensureScript();
        if (cancelled) return;

        if (!captchaContainerRef.current) return;
        if (!w.grecaptcha) throw new Error("reCAPTCHA script loaded but grecaptcha is missing");

        if (captchaWidgetIdRef.current == null) {
          captchaWidgetIdRef.current = w.grecaptcha.render(captchaContainerRef.current, {
            sitekey: siteKey,
            callback: (token) => setCaptchaToken(token),
            "expired-callback": () => setCaptchaToken(null),
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setCaptchaLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  async function verifyCaptchaOrThrow() {
    if (!siteKey) return; // captcha not configured
    if (!captchaToken) {
      throw new Error("Please complete the captcha.");
    }

    const res = await fetch("/api/auth/captcha", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: captchaToken }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(data?.error || `Captcha verification failed (${res.status})`);
    }
  }

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

  const emailProvider = providerList.find((p) => p.type === "email");
  const oauthProviders = providerList.filter((p) => p.type === "oauth");

  return (
    <div className="mt-8">
      {/* reCAPTCHA */}
      {siteKey ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-[var(--text)]">Security check</div>
          <p className="mt-1 text-sm text-[var(--muted)]">Please complete the captcha to continue.</p>
          <div className="mt-4">
            <div ref={captchaContainerRef} />
            {captchaLoading ? <div className="mt-2 text-xs text-[var(--muted)]">Loading captcha…</div> : null}
          </div>
        </div>
      ) : null}

      {/* Email magic-link (passwordless). */}
      {emailProvider ? (
        <div className={siteKey ? "mt-6 rounded-2xl border border-slate-200 bg-white p-6" : "rounded-2xl border border-slate-200 bg-white p-6"}>
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
                  await verifyCaptchaOrThrow();
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
        <div className={emailProvider ? "mt-6" : ""}>
          <div className="text-sm font-semibold text-[var(--text)]">Or continue with</div>
          <div className="mt-3 flex flex-col gap-3">
            {oauthProviders.map((p) => (
              <button
                key={p.id}
                className="rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:brightness-110"
                onClick={async () => {
                  setError(null);
                  try {
                    await verifyCaptchaOrThrow();
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
