type PublicMetrics = {
  stars: string;
  installs: string;
  countries: string;
};

const FALLBACK: PublicMetrics = {
  stars: "Community-loved",
  installs: "Growing daily",
  countries: "Used worldwide",
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

async function fetchNpmDownloads(): Promise<string | null> {
  const pkg = process.env.METRICS_NPM_PACKAGE ?? "@jiggai/recipes";
  const encoded = encodeURIComponent(pkg);
  const res = await fetch(`https://api.npmjs.org/downloads/point/last-month/${encoded}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { downloads?: number };
  const downloads = typeof data.downloads === "number" ? data.downloads : null;
  return downloads === null ? null : `${compact(downloads)}/mo`;
}

function getCountriesMetric(): string {
  const fromEnv = process.env.NEXT_PUBLIC_METRICS_COUNTRIES ?? process.env.METRICS_COUNTRIES;
  if (!fromEnv) return FALLBACK.countries;
  return fromEnv;
}

export async function getPublicMetrics(): Promise<PublicMetrics> {
  try {
    const [stars, installs] = await Promise.all([fetchGitHubStars(), fetchNpmDownloads()]);
    return {
      stars: stars ?? FALLBACK.stars,
      installs: installs ?? FALLBACK.installs,
      countries: getCountriesMetric(),
    };
  } catch {
    return {
      stars: FALLBACK.stars,
      installs: FALLBACK.installs,
      countries: getCountriesMetric(),
    };
  }
}
