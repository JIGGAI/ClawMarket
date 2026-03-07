"use client";

import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { ReCaptchaV2 } from "@/components/ReCaptchaV2";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const captchaSiteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || "";
  const onCaptcha = useCallback((t: string | null) => setCaptchaToken(t), []);

  return (
    <form
      className="mt-6 flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
          if (!captchaSiteKey) throw new Error("CAPTCHA is not configured (missing NEXT_PUBLIC_CAPTCHA_SITE_KEY)");
          if (!captchaToken) throw new Error("Please complete the CAPTCHA.");

          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email, password, name, captchaToken }),
          });
          const data = (await res.json()) as { ok?: boolean; error?: string };
          if (!res.ok) throw new Error(data.error || `Signup failed (${res.status})`);

          // Auto-sign-in after successful signup.
          const r = await signIn("credentials", { email, password, redirect: false });
          if (r?.error) throw new Error(r.error);
          // Show marketplace with verification notice (banner checks session.emailVerified).
          window.location.href = "/marketplace";
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

      <label className="text-sm font-semibold text-[var(--text)]">Name (optional)</label>
      <input
        className="w-full rounded-lg border border-slate-200 px-3 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />

      <label className="text-sm font-semibold text-[var(--text)]">Email</label>
      <input
        className="w-full rounded-lg border border-slate-200 px-3 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@domain.com"
        type="email"
      />

      <label className="text-sm font-semibold text-[var(--text)]">Password</label>
      <input
        className="w-full rounded-lg border border-slate-200 px-3 py-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 8 characters"
        type="password"
      />

      <div className="mt-3">
        <ReCaptchaV2 siteKey={captchaSiteKey} onToken={onCaptcha} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-lg bg-[color:var(--coral-bright)] px-4 py-3 text-center font-semibold text-white hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
