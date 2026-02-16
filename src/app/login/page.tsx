import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignInOptions from "./SignInOptions";

export const metadata = {
  title: "Login – ClawMarket",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const session = await getServerSession(authOptions);

  const callbackUrl = typeof searchParams?.callbackUrl === "string" && searchParams.callbackUrl.trim()
    ? searchParams.callbackUrl
    : "/";

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

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-[var(--text)]">Sign in</h1>
        <p className="mt-3 text-[var(--muted)]">
          Available options depend on environment variables.
        </p>

        <SignInOptions callbackUrl={callbackUrl} />

        <div className="mt-6">
          <Link className="block text-center text-sm text-[var(--muted)] underline" href="/marketplace">
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
