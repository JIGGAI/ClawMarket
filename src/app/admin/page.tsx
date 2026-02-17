import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin – ClawRecipes",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin");

  const role = (session as unknown as { role?: string }).role ?? "user";
  if (role !== "admin" && role !== "moderator") redirect("/user");

  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { email: true, name: true } } },
  });

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Admin</h1>
            <p className="mt-2 text-[var(--muted)]">Latest recipe submissions (most recent 50).</p>
          </div>
          <div className="flex items-center gap-3">
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/admin/submissions">
              Submissions queue
            </Link>
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/user">
              User
            </Link>
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/marketplace">
              Marketplace
            </Link>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[var(--muted)]">
                <th className="py-3 pr-4">Created</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Author</th>
                <th className="py-3 pr-4">Contact</th>
                <th className="py-3 pr-4">Source</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">
                    {new Date(s.createdAt).toISOString().replace("T", " ").slice(0, 16)}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap font-semibold">{s.status}</td>
                  <td className="py-3 pr-4 min-w-[220px]">
                    <div className="font-semibold text-[var(--text)]">{s.title}</div>
                    <div className="mt-1 text-[var(--muted)] line-clamp-2">{s.description}</div>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">
                    {s.user?.name ?? ""}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">
                    <div>{s.contactEmail}</div>
                    <div className="text-xs">{s.user?.email ?? ""}</div>
                  </td>
                  <td className="py-3 pr-4 min-w-[260px]">
                    {s.sourceUrl ? (
                      <a className="text-[color:var(--coral-bright)] underline break-all" href={s.sourceUrl} target="_blank" rel="noreferrer">
                        sourceUrl
                      </a>
                    ) : s.zipUrl ? (
                      <a className="text-[color:var(--coral-bright)] underline break-all" href={s.zipUrl} target="_blank" rel="noreferrer">
                        zipUrl
                      </a>
                    ) : (
                      <span className="text-[var(--muted)]">(none)</span>
                    )}
                  </td>
                </tr>
              ))}
              {!submissions.length ? (
                <tr>
                  <td className="py-6 text-[var(--muted)]" colSpan={6}>
                    No submissions yet.
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
