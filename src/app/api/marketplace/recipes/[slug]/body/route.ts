import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns the published submission's recipe JSON body.
// This lets MarketplaceRecipe.sourceUrl point at a safe, same-origin fetchable artifact.

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const s = slug.trim();

  const sub = await prisma.submission.findFirst({
    where: { status: "published", OR: [{ slug: s }, { id: s }] },
    select: { id: true, slug: true, bodyJson: true },
  });

  if (!sub || sub.bodyJson == null) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  // Intentionally return as application/json.
  return NextResponse.json({ ok: true, slug: sub.slug ?? sub.id, body: sub.bodyJson });
}
