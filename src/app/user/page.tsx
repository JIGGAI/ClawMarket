import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export const metadata = {
  title: "User – ClawRecipes",
};

export default async function UserPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/user");

  const email = session.user?.email ?? null;
  const name = session.user?.name ?? null;
  const role = (session as unknown as { role?: string }).role ?? "user";
  const userId = (session as unknown as { userId?: string }).userId ?? null;

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-[var(--text)]">Your account</h1>

        <dl className="mt-6 grid grid-cols-1 gap-4 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <dt className="font-semibold text-[var(--text)]">Email</dt>
            <dd className="mt-1 text-[var(--muted)]">{email ?? "(none)"}</dd>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <dt className="font-semibold text-[var(--text)]">Name</dt>
            <dd className="mt-1 text-[var(--muted)]">{name ?? "(none)"}</dd>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <dt className="font-semibold text-[var(--text)]">Role</dt>
            <dd className="mt-1 text-[var(--muted)]">{role}</dd>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <dt className="font-semibold text-[var(--text)]">User ID</dt>
            <dd className="mt-1 break-all font-mono text-[var(--muted)]">{userId ?? "(unknown)"}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/marketplace">
            Marketplace
          </Link>
          <Link
            className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50"
            href="/marketplace/submissions"
          >
            Your submissions
          </Link>
          {role === "admin" || role === "moderator" ? (
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/admin">
              Admin
            </Link>
          ) : null}
          <div className="flex-1" />
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
