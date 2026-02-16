import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const r = await requireRole("moderator");
  if (!r.ok) return r.res;

  const rows = await prisma.submission.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, count: rows.length, submissions: rows });
}

export async function POST(req: Request) {
  // Approve/reject
  const r = await requireRole("moderator");
  if (!r.ok) return r.res;

  const body = (await req.json()) as {
    id?: string;
    status?: "approved" | "rejected" | "needs_changes" | "published" | "unpublished";
    reason?: string;
  };
  const id = String(body.id ?? "").trim();
  const status = body.status;
  const reason = typeof body.reason === "string" ? body.reason : undefined;

  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  if (!status) return NextResponse.json({ ok: false, error: "status is required" }, { status: 400 });

  const allowed: Array<"approved" | "rejected" | "needs_changes" | "published" | "unpublished"> = [
    "approved",
    "rejected",
    "needs_changes",
    "published",
    "unpublished",
  ];
  if (!allowed.includes(status)) {
    return NextResponse.json({ ok: false, error: `status must be one of: ${allowed.join(", ")}` }, { status: 400 });
  }

  const now = new Date();
  const data: Record<string, unknown> = {
    status,
    moderatedAt: now,
    moderatedByUserId: r.session.userId,
    moderationReason: reason,
  };

  if (status === "published") {
    data.publishedAt = now;
    data.publishedByUserId = r.session.userId;
  }

  const next = await prisma.submission.update({ where: { id }, data });
  return NextResponse.json({ ok: true, submission: next });
}
