import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Submission as PrismaSubmission } from "@prisma/client";
import { SubmissionDetailClient } from "@/components/admin/SubmissionDetailClient";

export const metadata = {
  title: "Admin Submission – ClawRecipes",
};

export default async function AdminSubmissionDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/login?callbackUrl=/admin/submissions/${encodeURIComponent(params.id)}`);

  const role = (session as unknown as { role?: string }).role ?? "user";
  if (role !== "admin" && role !== "moderator") redirect("/user");

  const id = decodeURIComponent(params.id);
  const submission = await prisma.submission.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });

  if (!submission) {
    return (
      <main className="px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-[var(--text)]">Submission not found</h1>
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/admin/submissions">
              Back to queue
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">No submission matched: {id}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Submission detail</h1>
            <p className="mt-2 text-[var(--muted)]">Review, moderate, and publish/unpublish.</p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-start gap-3 sm:w-auto sm:justify-end">
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/admin/submissions">
              Queue
            </Link>
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/admin">
              Admin
            </Link>
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/marketplace">
              Marketplace
            </Link>
          </div>
        </div>

        <SubmissionDetailClient submission={submission as PrismaSubmission} />
      </div>
    </main>
  );
}
