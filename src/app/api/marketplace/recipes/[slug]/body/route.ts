import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require";

// Returns the published submission's recipe JSON body.
// This lets MarketplaceRecipe.sourceUrl point at a safe, same-origin fetchable artifact.

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const s = slug.trim();

  // Prefer published.
  let sub = await prisma.submission.findFirst({
    where: { status: { in: ["published", "approved"] }, OR: [{ slug: s }, { id: s }] },
    select: { id: true, slug: true, bodyMd: true },
  });

  if (!sub || sub.bodyMd == null) {
    // Allow moderators to view unpublished bodies.
    const mod = await requireRole("moderator");
    if (mod.ok) {
      sub = await prisma.submission.findFirst({
        where: { OR: [{ slug: s }, { id: s }] },
        select: { id: true, slug: true, bodyMd: true },
      });
    }
  }

  if (!sub || sub.bodyMd == null) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  // Return as plain text markdown.
  return new NextResponse(sub.bodyMd, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
