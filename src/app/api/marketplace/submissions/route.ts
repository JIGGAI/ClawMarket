import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require";
import { prisma } from "@/lib/prisma";

async function canSubmit(userId: string) {
  // Social logins can submit immediately.
  // Email magic link users are considered verified if emailVerified is set.
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { emailVerified: true } });
  if (user?.emailVerified) return true;

  const accounts = await prisma.account.findMany({ where: { userId }, select: { provider: true } });
  const hasSocial = accounts.some((a) => a.provider !== "email");
  return hasSocial;
}

export async function POST(req: Request) {
  const r = await requireAuth();
  if (!r.ok) return r.res;

  const userId = r.session.userId;
  if (!userId) return NextResponse.json({ ok: false, error: "Missing userId in session" }, { status: 500 });

  const allowed = await canSubmit(userId);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "Account not verified for submissions. Use a social login or sign in via email magic link." },
      { status: 403 },
    );
  }

  const body = (await req.json()) as { title?: string; sourceUrl?: string; notes?: string };
  const title = String(body.title ?? "").trim();
  const sourceUrl = String(body.sourceUrl ?? "").trim();
  const notes = typeof body.notes === "string" ? body.notes : undefined;

  if (!title) return NextResponse.json({ ok: false, error: "title is required" }, { status: 400 });
  if (!sourceUrl) return NextResponse.json({ ok: false, error: "sourceUrl is required" }, { status: 400 });

  const sub = await prisma.submission.create({
    data: {
      title,
      sourceUrl,
      notes,
      createdBy: userId,
      status: "pending",
    },
  });

  return NextResponse.json({ ok: true, submission: sub });
}

export async function GET() {
  // For now: authenticated users can list their own submissions.
  const r = await requireAuth();
  if (!r.ok) return r.res;

  const userId = r.session.userId;
  if (!userId) return NextResponse.json({ ok: false, error: "Missing userId in session" }, { status: 500 });

  const rows = await prisma.submission.findMany({ where: { createdBy: userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, count: rows.length, submissions: rows });
}
