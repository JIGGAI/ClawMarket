import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const r = await requireRole("moderator");
  if (!r.ok) return r.res;

  const { slug } = await ctx.params;
  const s = slug.trim();

  const row = await prisma.submission.findFirst({
    where: {
      OR: [{ slug: s }, { id: s }],
    },
  });

  if (!row) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, submission: row });
}
