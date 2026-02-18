"use client";

import { useSession } from "next-auth/react";

export function EmailVerificationBanner() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  const s = session as unknown as { emailVerified?: string | null };
  if (s.emailVerified) return null;

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white/70 p-4 text-sm text-[var(--text)] shadow-sm">
      <div className="font-semibold text-[color:var(--coral-bright)]">Verify your email</div>
      <div className="mt-1 text-[var(--muted)]">
        We sent you a verification email. You’re signed in, but you won’t be able to submit until your email is verified.
        After you verify, refresh this page and this notice will disappear.
      </div>
    </div>
  );
}
