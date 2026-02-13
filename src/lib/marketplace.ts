import fs from "node:fs/promises";
import path from "node:path";

export type MarketplaceRecipe = {
  slug: string;
  kind: "team" | "agent";
  name: string;
  description: string;
  version: string;
  tags: string[];
  sourceUrl: string;
  homepageUrl?: string;
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
  return data;
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
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  const obj = data as { ok?: boolean; recipes?: unknown };
  if (!obj?.ok || !Array.isArray(obj.recipes)) return null;
  return obj.recipes as MarketplaceRecipe[];
}
