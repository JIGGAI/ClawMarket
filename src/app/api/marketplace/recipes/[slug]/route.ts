import { NextResponse } from "next/server";
import { getBySlug, loadRegistry, type MarketplaceRecipe } from "@/lib/marketplace";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require";

function tagsFromCsv(tagsCsv: string | null | undefined): string[] {
  return (tagsCsv ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function submissionToRecipe(sub: {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  tagsCsv: string;
  sourceUrl: string | null;
  zipUrl: string | null;
  bodyMd: string | null;
  authorDisplayName: string;
  contactEmail: string;
  license: string | null;
  createdAt: Date;
  updatedAt: Date;
}): MarketplaceRecipe | null {
  const slug = sub.slug ?? sub.id;
  const renderableSourceUrl =
    sub.sourceUrl ??
    (sub.bodyMd != null ? `/api/marketplace/recipes/${encodeURIComponent(slug)}/body` : null);
  if (!renderableSourceUrl) return null;

  return {
    slug,
    kind: "agent",
    origin: "ugc",
    name: sub.title,
    description: sub.description,
    version: "ugc",
    tags: tagsFromCsv(sub.tagsCsv),
    sourceUrl: renderableSourceUrl,

    submissionId: sub.id,
    authorDisplayName: sub.authorDisplayName,
    contactEmail: sub.contactEmail,
    license: sub.license,
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),

    ugcSourceUrl: sub.sourceUrl,
    zipUrl: sub.zipUrl,
  };
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await ctx.params;
    const s = slug.trim();

    // Prefer DB-backed published submissions first.
    const sub = await prisma.submission.findFirst({
      where: {
        status: { in: ["published"] },
        OR: [{ slug: s }, { id: s }],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        tagsCsv: true,
        sourceUrl: true,
        zipUrl: true,
        bodyMd: true,
        authorDisplayName: true,
        contactEmail: true,
        license: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (sub) {
      const recipe = submissionToRecipe(sub);
      if (recipe) {
        return NextResponse.json({ ok: true, recipe });
      }
    }

    // Admin/moderator view: allow viewing unpublished submissions by id/slug.
    const mod = await requireRole("moderator");
    if (mod.ok) {
      const anySub = await prisma.submission.findFirst({
        where: { OR: [{ slug: s }, { id: s }] },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          tagsCsv: true,
          sourceUrl: true,
          zipUrl: true,
          bodyMd: true,
          authorDisplayName: true,
          contactEmail: true,
          license: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (anySub) {
        const recipe = submissionToRecipe(anySub);
        if (recipe) return NextResponse.json({ ok: true, recipe });
      }
    }

    // Fallback to bundled/file-backed registry.
    const registry = await loadRegistry();
    const recipe = getBySlug(registry.recipes, s);

    if (!recipe) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, recipe });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
