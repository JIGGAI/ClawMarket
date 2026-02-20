import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Users – ClawRecipes",
};

function fmt(dt: Date | null | undefined) {
  if (!dt) return "";
  return new Date(dt).toISOString().replace("T", " ").slice(0, 16);
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin/users");

  const role = (session as unknown as { role?: string }).role ?? "user";
  if (role !== "admin") redirect("/user");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Users</h1>
            <p className="mt-2 text-[var(--muted)]">Most recent 100 signups.</p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-start gap-3 sm:w-auto sm:justify-end">
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/admin">
              Admin
            </Link>
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/admin/submissions">
              Submissions queue
            </Link>
            {/* User link removed */}
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[var(--muted)]">
                <th className="py-3 pr-4">Created</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Verified</th>
                <th className="py-3 pr-4">Verified at</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{fmt(u.createdAt)}</td>
                  <td className="py-3 pr-4 whitespace-nowrap font-semibold text-[var(--text)]">{u.email ?? ""}</td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{u.name ?? ""}</td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{u.role}</td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{u.emailVerified ? "yes" : "no"}</td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{fmt(u.emailVerified)}</td>
                </tr>
              ))}
              {!users.length ? (
                <tr>
                  <td className="py-6 text-[var(--muted)]" colSpan={6}>
                    No users found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
