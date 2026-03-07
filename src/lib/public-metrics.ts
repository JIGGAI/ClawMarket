type PublicMetrics = {
  stars: string;
  recipesInstalls: string;
  kitchenInstalls: string;
};

const FALLBACK: PublicMetrics = {
  stars: "Community-loved",
  recipesInstalls: "Growing daily",
  kitchenInstalls: "Growing daily",
};

function compact(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

async function fetchGitHubStars(): Promise<string | null> {
  const repo = process.env.METRICS_GITHUB_REPO ?? "JIGGAI/ClawRecipes";
  const token = process.env.GITHUB_TOKEN;

  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { stargazers_count?: number };
  const stars = typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  return stars === null ? null : compact(stars);
}

async function fetchNpmDownloads(pkg: string): Promise<string | null> {
  const encoded = encodeURIComponent(pkg);
  const res = await fetch(`https://api.npmjs.org/downloads/point/last-month/${encoded}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { downloads?: number };
  const downloads = typeof data.downloads === "number" ? data.downloads : null;
  return downloads === null ? null : `${compact(downloads)}/mo`;
}

export async function getPublicMetrics(): Promise<PublicMetrics> {
  try {
    const recipesPkg = process.env.METRICS_NPM_RECIPES_PACKAGE ?? "@jiggai/recipes";
    const kitchenPkg = process.env.METRICS_NPM_KITCHEN_PACKAGE ?? "@jiggai/kitchen";
    const [stars, recipesInstalls, kitchenInstalls] = await Promise.all([
      fetchGitHubStars(),
      fetchNpmDownloads(recipesPkg),
      fetchNpmDownloads(kitchenPkg),
    ]);
    return {
      stars: stars ?? FALLBACK.stars,
      recipesInstalls: recipesInstalls ?? FALLBACK.recipesInstalls,
      kitchenInstalls: kitchenInstalls ?? FALLBACK.kitchenInstalls,
    };
  } catch {
    return {
      stars: FALLBACK.stars,
      recipesInstalls: FALLBACK.recipesInstalls,
      kitchenInstalls: FALLBACK.kitchenInstalls,
    };
  }
}
