import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SubmissionsClient from "./SubmissionsClient";

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
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      status: true,
      sourceUrl: true,
      bodyMd: true,
      createdAt: true,
    },
  });

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Your submissions</h1>
            <p className="mt-2 text-[var(--muted)]">Submissions you’ve created from this account.</p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-start gap-3 sm:w-auto sm:justify-end">
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

        <SubmissionsClient
          submissions={submissions.map((s) => ({
            ...s,
            createdAt: s.createdAt.toISOString(),
          }))}
        />
      </div>
    </main>
  );
}
