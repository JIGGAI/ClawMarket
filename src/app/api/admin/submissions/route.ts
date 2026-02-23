import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const r = await requireRole("moderator");
  if (!r.ok) return r.res;

  try {
    const rows = await prisma.submission.findMany({
      where: { status: { not: "draft" } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, count: rows.length, submissions: rows });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("/api/admin/submissions GET failed", msg);
    return NextResponse.json({ ok: false, error: "Failed to load submissions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Moderate (status update)
  const r = await requireRole("moderator");
  if (!r.ok) return r.res;

  let body: {
    id?: string;
    status?: "rejected" | "needs_changes" | "approved" | "published" | "unpublished";
    reason?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const id = String(body.id ?? "").trim();
  const status = body.status;
  const reason = typeof body.reason === "string" ? body.reason : undefined;

  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  if (!status) return NextResponse.json({ ok: false, error: "status is required" }, { status: 400 });

  const allowed: Array<"rejected" | "needs_changes" | "approved" | "published" | "unpublished"> = [
    "rejected",
    "needs_changes",
    "approved",
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

  try {
    const next = await prisma.submission.update({ where: { id }, data });
    return NextResponse.json({ ok: true, submission: next });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("/api/admin/submissions POST failed", msg);
    // Prisma throws on not found; treat as 404
    if (String(msg).toLowerCase().includes("record") && String(msg).toLowerCase().includes("not found")) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: "Failed to update submission" }, { status: 500 });
  }
}
