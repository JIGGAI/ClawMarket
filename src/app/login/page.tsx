import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Login – ClawMarket",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <main className="px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-[var(--text)]">You’re signed in</h1>
          <p className="mt-2 text-[var(--muted)]">Return to the marketplace.</p>
          <div className="mt-6">
            <Link className="text-[color:var(--coral-bright)] underline" href="/marketplace">
              Go to Marketplace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // NextAuth uses /api/auth/signin for provider list; our UI just links there.
  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-[var(--text)]">Sign in</h1>
        <p className="mt-3 text-[var(--muted)]">
          Use a social login (Google/GitHub/X/Discord) or email magic link. Available options depend on environment
          variables.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            className="rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:brightness-110"
            href="/api/auth/signin"
          >
            Continue to sign-in options
          </Link>
          <Link className="text-center text-sm text-[var(--muted)] underline" href="/marketplace">
            Back to marketplace
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-[var(--muted)]">
          <div className="font-semibold text-[var(--text)]">Admin seeding</div>
          <div className="mt-1">
            Set <code>ADMIN_EMAILS</code> to a comma-separated list of emails to auto-promote on first sign-in.
          </div>
        </div>
      </div>
    </main>
  );
}
