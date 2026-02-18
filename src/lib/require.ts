import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { ok: false as const, res: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const, session };
}

export async function requireVerified() {
  const r = await requireAuth();
  if (!r.ok) return r;

  const s = r.session as typeof r.session & { emailVerified?: string | null };
  if (!s.emailVerified) {
    return {
      ok: false as const,
      res: NextResponse.json(
        { ok: false, error: "Email verification required. Please check your inbox and verify your email." },
        { status: 403 },
      ),
    };
  }

  return { ok: true as const, session: r.session };
}

export async function requireRole(role: "moderator" | "admin") {
  const r = await requireVerified();
  if (!r.ok) return r;

  const userRole = (r.session as { role?: string }).role ?? "user";
  const allowed = userRole === role || userRole === "admin";
  if (!allowed) {
    return { ok: false as const, res: NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true as const, session: r.session };
}
