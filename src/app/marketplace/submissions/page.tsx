import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { badgeClass, uiStatusLabel } from "@/lib/submission-ui";

export const metadata = {
  title: "Your Submissions – ClawRecipes",
};

export default async function MarketplaceSubmissionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/marketplace/submissions");

  const userId = (session as unknown as { userId?: string }).userId;
  if (!userId) redirect("/user");

  const submissions = await prisma.submission.findMany({
    where: { createdBy: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Your submissions</h1>
            <p className="mt-2 text-[var(--muted)]">Submissions you’ve created from this account.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/marketplace">
              Marketplace
            </Link>
            {(session as unknown as { role?: string })?.role === "admin" || (session as unknown as { role?: string })?.role === "moderator" ? (
              <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/admin/submissions">
                Admin
              </Link>
            ) : null}
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/user">
              User
            </Link>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {submissions.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="font-semibold text-[var(--text)]">{s.title}</div>
                  {s.status === "draft" || s.status === "submitted" || s.status === "needs_changes" ? (
                    <Link
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-[var(--text)] hover:bg-slate-50"
                      href={`/marketplace/submit?edit=${encodeURIComponent(s.id)}`}
                    >
                      Edit
                    </Link>
                  ) : null}
                </div>
                <div className="text-sm text-[var(--muted)]">
                  {new Date(s.createdAt).toISOString().replace("T", " ").slice(0, 16)}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-[var(--muted)]">Status:</span>
                {(() => {
                  const u = uiStatusLabel(String(s.status));
                  return (
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClass(u.tone)}`}>{u.label}</span>
                  );
                })()}
              </div>
              <div className="mt-3 text-[var(--muted)]">{s.description}</div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {s.sourceUrl ? (
                  <a className="text-[color:var(--coral-bright)] underline break-all" href={s.sourceUrl} target="_blank" rel="noreferrer">
                    Source URL
                  </a>
                ) : null}
                {s.bodyMd ? (
                  <a className="text-[color:var(--coral-bright)] underline" href={`/api/marketplace/recipes/${encodeURIComponent(s.slug ?? s.id)}/body`} target="_blank" rel="noreferrer">
                    Recipe body
                  </a>
                ) : null}
              </div>
            </div>
          ))}

          {!submissions.length ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[var(--muted)]">
              No submissions yet.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
