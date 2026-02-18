import fs from "node:fs/promises";
import path from "node:path";

export type MarketplaceRecipeOrigin = "bundled" | "ugc";

export type MarketplaceRecipe = {
  slug: string;
  kind: "team" | "agent";
  origin: MarketplaceRecipeOrigin;

  name: string;
  description: string;
  version: string;
  tags: string[];

  // Source (always something renderable/fetchable)
  sourceUrl: string;

  // Bundled-only conveniences
  homepageUrl?: string;

  // UGC-only / audit-ish fields (optional so registry-backed recipes stay minimal)
  submissionId?: string;
  authorDisplayName?: string;
  contactEmail?: string;
  license?: string | null;
  createdAt?: string;
  updatedAt?: string;

  // Additional UGC pointers (display-only; do not assume present)
  ugcSourceUrl?: string | null;
  zipUrl?: string | null;
};

export type MarketplaceRegistry = {
  version: number;
  generatedAt: string;
  recipes: MarketplaceRecipe[];
};

const REGISTRY_PATH = path.join(process.cwd(), "marketplace", "registry.json");

export async function loadRegistry(): Promise<MarketplaceRegistry> {
  const raw = await fs.readFile(REGISTRY_PATH, "utf8");
  const data = JSON.parse(raw) as MarketplaceRegistry;
  const obj = data as unknown as { recipes?: unknown };
  if (!data || typeof data !== "object" || !Array.isArray(obj.recipes)) {
    throw new Error("Invalid marketplace registry.json");
  }

  // Back-compat: older registry entries won’t include `origin`.
  const recipes = (data.recipes ?? []).map((r) => ({
    ...r,
    origin: (r as { origin?: MarketplaceRecipeOrigin }).origin ?? "bundled",
  }));

  return { ...data, recipes };
}

export function search(recipes: MarketplaceRecipe[], q: string | null) {
  const query = (q ?? "").trim().toLowerCase();
  if (!query) return recipes;

  return recipes.filter((r) => {
    const hay = [r.slug, r.name, r.description, ...(r.tags ?? [])].join(" ").toLowerCase();
    return hay.includes(query);
  });
}

export function getBySlug(recipes: MarketplaceRecipe[], slug: string) {
  const s = slug.trim().toLowerCase();
  return recipes.find((r) => r.slug.toLowerCase() === s) ?? null;
}

function resolveMarketplaceApiBase(): string | null {
  // Prefer explicit configuration (useful for local dev / pointing ClawKitchen at this site).
  const explicit = process.env.NEXT_PUBLIC_MARKETPLACE_API_BASE;
  if (explicit) return explicit.replace(/\/+$/, "");

  // In Vercel, VERCEL_URL is set (no scheme), so we can construct an absolute origin.
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) return siteUrl.replace(/\/+$/, "");

  return null;
}

export async function fetchMarketplaceRecipes(): Promise<MarketplaceRecipe[] | null> {
  const base = resolveMarketplaceApiBase();
  if (!base) return null;

  const url = base + "/api/marketplace/recipes";

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: 60 } });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  // Be defensive: on some hosts/proxies a 200 HTML error page can leak through here.
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return null;
  }

  let data: unknown;
  try {
    data = (await res.json()) as unknown;
  } catch {
    return null;
  }

  const obj = data as { ok?: boolean; recipes?: unknown };
  if (!obj?.ok || !Array.isArray(obj.recipes)) return null;
  return obj.recipes as MarketplaceRecipe[];
}
