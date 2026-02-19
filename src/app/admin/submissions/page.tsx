import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SubmissionsQueue } from "@/components/admin/SubmissionsQueue";

export const metadata = {
  title: "Admin Submissions – ClawRecipes",
};

export default async function AdminSubmissionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin/submissions");

  const role = (session as unknown as { role?: string }).role ?? "user";
  if (role !== "admin" && role !== "moderator") redirect("/user");

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Submissions queue</h1>
            <p className="mt-2 text-[var(--muted)]">Review and moderate recipe submissions.</p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-start gap-3 sm:w-auto sm:justify-end">
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/admin">
              Admin
            </Link>
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/marketplace">
              Marketplace
            </Link>
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/user">
              User
            </Link>
          </div>
        </div>

        <SubmissionsQueue />
      </div>
    </main>
  );
}
