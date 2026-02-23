import { NextResponse } from "next/server";
import { loadRegistry, search, type MarketplaceRecipe } from "@/lib/marketplace";
import { prisma } from "@/lib/prisma";

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

  // Prefer explicit sourceUrl; otherwise, if bodyMd exists, expose it via same-origin API.
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q");

    const registry = await loadRegistry();

    // Published UGC lives in the DB (avoid server-side writes to registry.json).
    const publishedSubs = await prisma.submission.findMany({
      where: { status: { in: ["published"] } },
      orderBy: { publishedAt: "desc" },
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

    const ugcRecipes = publishedSubs
      .map(submissionToRecipe)
      .filter((r): r is MarketplaceRecipe => Boolean(r));

    // De-dupe by slug, preferring UGC (so it can override bundled entries if needed).
    const bySlug = new Map<string, MarketplaceRecipe>();
    for (const r of registry.recipes) bySlug.set(r.slug.toLowerCase(), r);
    for (const r of ugcRecipes) bySlug.set(r.slug.toLowerCase(), r);

    const merged = Array.from(bySlug.values());
    const recipes = search(merged, q);

    return NextResponse.json({
      ok: true,
      version: registry.version,
      generatedAt: registry.generatedAt,
      count: recipes.length,
      recipes,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
