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

export async function fetchMarketplaceRecipes(): Promise<MarketplaceRecipe[] | null> {
  const base = process.env.NEXT_PUBLIC_MARKETPLACE_API_BASE;
  if (!base) return null;

  const url = base.replace(/\/$/, "") + "/api/marketplace/recipes";
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  const obj = data as { ok?: boolean; recipes?: unknown };
  if (!obj?.ok || !Array.isArray(obj.recipes)) return null;
  return obj.recipes as MarketplaceRecipe[];
}
