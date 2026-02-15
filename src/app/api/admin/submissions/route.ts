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

  const body = (await req.json()) as { id?: string; status?: "approved" | "rejected" };
  const id = String(body.id ?? "").trim();
  const status = body.status;

  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ ok: false, error: "status must be approved|rejected" }, { status: 400 });
  }

  const next = await prisma.submission.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true, submission: next });
}
