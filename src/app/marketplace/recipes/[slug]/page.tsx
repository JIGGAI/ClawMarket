import { FadeIn } from "@/components/FadeIn";
import { CopyLineButton } from "@/components/CopyLineButton";
import type { MarketplaceRecipe } from "@/lib/marketplace";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata = {
  title: "Recipe – Marketplace – ClawRecipes",
  description: "Recipe details and install commands.",
};

function kindLabel(kind: MarketplaceRecipe["kind"]) {
  return kind === "team" ? "Team Recipe" : "Agent Recipe";
}

const markdownComponents: Components = {
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="codeblock mt-4 overflow-auto rounded-xl bg-slate-900/95 px-4 py-3 text-sm text-slate-200"
      {...props}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="code-dot h-3 w-3 rounded-full" />
        <span className="code-dot h-3 w-3 rounded-full" />
        <span className="code-dot h-3 w-3 rounded-full" />
      </div>
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = (className ?? "").includes("language-");
    if (isBlock) {
      return (
        <code className="block whitespace-pre" {...props}>
          {children}
        </code>
      );
    }

    return (
      <code
        className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.95em]"
        {...props}
      >
        {children}
      </code>
    );
  },
};

function installCommand(r: MarketplaceRecipe) {
  return r.kind === "team"
    ? `openclaw recipes scaffold-team ${r.slug} -t my-${r.slug} --apply-config`
    : `openclaw recipes scaffold ${r.slug} --agent-id my-${r.slug.replace(/-/g, "")} --apply-config`;
}

function formatIsoDate(iso: string | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "Z");
}

async function fetchModerationForRecipe(recipe: MarketplaceRecipe) {
  if (recipe.origin !== "ugc") return null;
  const id = recipe.submissionId;
  if (!id) return null;

  return prisma.submission.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      status: true,
      moderatedAt: true,
      moderatedByUserId: true,
      moderationReason: true,
      publishedAt: true,
      publishedByUserId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function fetchRecipe(slug: string): Promise<MarketplaceRecipe> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/marketplace/recipes/${encodeURIComponent(slug)}`,
    { next: { revalidate: 60 } }
  );

  if (res.status === 404) {
    throw new Error("NOT_FOUND");
  }
  if (!res.ok) {
    throw new Error(`Failed to load recipe (${res.status})`);
  }

  const data = (await res.json()) as { ok?: boolean; recipe?: MarketplaceRecipe };
  if (!data?.ok || !data.recipe) throw new Error("Invalid recipe payload");
  return data.recipe;
}

async function fetchMarkdown(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const text = await res.text();
    // Basic defense: avoid accidentally rendering HTML if a proxy returns an error page.
    if (text.trimStart().toLowerCase().startsWith("<!doctype html")) return null;
    return text;
  } catch {
    return null;
  }
}

export default async function MarketplaceRecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let recipe: MarketplaceRecipe;
  try {
    recipe = await fetchRecipe(slug);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === "NOT_FOUND") {
      return (
        <main className="w-full">
          <FadeIn>
            <section className="px-6 py-20 lg:px-16">
              <div className="mx-auto max-w-3xl">
                <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">
                  Marketplace
                </p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
                  Recipe not found
                </h1>
                <p className="mt-6 text-lg text-[var(--muted)]">
                  We couldn’t find a recipe with slug <span className="font-mono">{slug}</span>.
                </p>
                <div className="mt-8">
                  <a
                    href="/marketplace"
                    className="inline-block rounded-lg bg-[color:var(--coral-bright)] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:brightness-95"
                  >
                    Back to Marketplace
                  </a>
                </div>
              </div>
            </section>
          </FadeIn>
        </main>
      );
    }

    throw e;
  }

  const session = await getServerSession(authOptions);
  const role = session?.role ?? "user";
  const canModerate = role === "moderator" || role === "admin";

  const cmd = installCommand(recipe);
  const markdown = await fetchMarkdown(recipe.sourceUrl);
  const moderation = canModerate ? await fetchModerationForRecipe(recipe) : null;

  return (
    <main className="w-full">
      <FadeIn>
        <section className="bg-gradient-to-b from-slate-50 to-white px-6 py-16 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">
                  Marketplace
                </p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
                  {recipe.name}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                  {recipe.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--text)]">
                    {kindLabel(recipe.kind)}
                  </span>
                  <span className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--text)]">
                    v{recipe.version}
                  </span>
                  {(recipe.tags ?? []).slice(0, 8).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--border)] bg-white/50 px-3 py-1 text-xs text-[var(--muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0">
                <a
                  href="/marketplace"
                  className="inline-block rounded-lg border border-[var(--border)] bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[color:var(--coral-bright)]"
                >
                  ← Back
                </a>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="px-6 py-12 lg:px-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[var(--text)]">Install / Scaffold</h2>
              <p className="mt-2 text-[var(--muted)]">
                Copy-paste the command below in a terminal where OpenClaw is installed.
              </p>

              <div className="mt-5 rounded-xl bg-slate-900/95 px-4 py-3 font-mono text-sm text-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 overflow-x-auto">
                    <span className="text-emerald-400">$</span> {cmd}
                  </div>
                  <CopyLineButton text={cmd} />
                </div>
              </div>

              <h2 className="mt-12 text-2xl font-bold text-[var(--text)]">Source</h2>
              <p className="mt-2 text-[var(--muted)]">
                This is the recipe’s Markdown source.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-lg border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[color:var(--coral-bright)]"
                >
                  View raw
                </a>
                {recipe.homepageUrl ? (
                  <a
                    href={recipe.homepageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-lg border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[color:var(--coral-bright)]"
                  >
                    Project
                  </a>
                ) : null}
                {markdown ? <CopyLineButton text={markdown} /> : null}
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-white/70">
                {markdown ? (
                  <div className="max-h-[70vh] overflow-auto px-6 py-5">
                    <div className="markdown text-[var(--text)]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {markdown}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-5 text-[var(--muted)]">
                    Couldn’t load the recipe source right now. Use “View raw” to open it directly.
                  </div>
                )}
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="rounded-2xl border border-[var(--border)] bg-white/70 p-6">
                <h3 className="text-lg font-bold text-[var(--text)]">By the numbers</h3>

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[var(--muted)]">Slug</dt>
                    <dd className="font-mono text-[var(--text)]">{recipe.slug}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[var(--muted)]">Kind</dt>
                    <dd className="text-[var(--text)]">{recipe.kind}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[var(--muted)]">Origin</dt>
                    <dd className="text-[var(--text)]">{recipe.origin}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[var(--muted)]">Version</dt>
                    <dd className="text-[var(--text)]">{recipe.version}</dd>
                  </div>

                  {recipe.authorDisplayName ? (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[var(--muted)]">Author</dt>
                      <dd className="text-[var(--text)]">{recipe.authorDisplayName}</dd>
                    </div>
                  ) : null}

                  {formatIsoDate(recipe.updatedAt) ? (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[var(--muted)]">Updated</dt>
                      <dd className="font-mono text-[var(--text)]">{formatIsoDate(recipe.updatedAt)}</dd>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[var(--muted)]">Source</dt>
                    <dd className="text-[var(--text)]">{recipe.origin === "ugc" ? "Submission" : "GitHub"}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-slate-50 p-6">
                <h3 className="text-lg font-bold text-[var(--text)]">Moderation</h3>

                {!canModerate ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Moderation details are visible to moderators/admins.
                  </p>
                ) : recipe.origin !== "ugc" ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    This is a bundled recipe (no submission moderation state).
                  </p>
                ) : !moderation ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    No moderation record found for this submission.
                  </p>
                ) : (
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[var(--muted)]">Status</dt>
                      <dd className="font-mono text-[var(--text)]">{moderation.status}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[var(--muted)]">Moderated</dt>
                      <dd className="font-mono text-[var(--text)]">
                        {moderation.moderatedAt ? moderation.moderatedAt.toISOString() : "—"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[var(--muted)]">Moderated by</dt>
                      <dd className="font-mono text-[var(--text)]">
                        {moderation.moderatedByUserId ?? "—"}
                      </dd>
                    </div>
                    {moderation.moderationReason ? (
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-[var(--muted)]">Reason</dt>
                        <dd className="text-[var(--text)]">{moderation.moderationReason}</dd>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[var(--muted)]">Published</dt>
                      <dd className="font-mono text-[var(--text)]">
                        {moderation.publishedAt ? moderation.publishedAt.toISOString() : "—"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-[var(--muted)]">Published by</dt>
                      <dd className="font-mono text-[var(--text)]">
                        {moderation.publishedByUserId ?? "—"}
                      </dd>
                    </div>
                  </dl>
                )}
              </div>
            </aside>
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
