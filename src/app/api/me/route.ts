import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require";

export async function GET() {
  const r = await requireAuth();
  if (!r.ok) return r.res;
  return NextResponse.json({ ok: true, userId: r.session.userId, role: r.session.role, user: r.session.user });
}
