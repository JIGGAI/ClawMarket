import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session) {
    return { ok: false as const, res: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const, session };
}

export async function requireRole(role: "moderator" | "admin") {
  const r = await requireAuth();
  if (!r.ok) return r;

  const userRole = r.session.role ?? "user";
  const allowed = userRole === role || userRole === "admin";
  if (!allowed) {
    return { ok: false as const, res: NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true as const, session: r.session };
}
