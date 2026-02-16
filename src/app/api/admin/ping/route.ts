import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require";

export async function GET() {
  const r = await requireRole("admin");
  if (!r.ok) return r.res;
  return NextResponse.json({ ok: true, note: "admin ok" });
}
