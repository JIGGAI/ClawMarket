import { FadeIn } from "@/components/FadeIn";
import { CopyLineButton } from "@/components/CopyLineButton";
import { BackButton } from "@/components/BackButton";
import type { MarketplaceRecipe } from "@/lib/marketplace";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata = {
  title: "Recipe – Marketplace – ClawRecipes",
  description: "Recipe details and install commands.",
};

function kindLabel(kind: MarketplaceRecipe["kind"]) {
  return kind === "team" ? "Team Recipe" : "Agent Recipe";
}

function scaffoldCommand(r: MarketplaceRecipe) {
  return r.kind === "team"
    ? `openclaw recipes scaffold-team ${r.slug} -t my-${r.slug} --apply-config`
    : `openclaw recipes scaffold ${r.slug} --agent-id my-${r.slug.replace(/-/g, "")} --apply-config`;
}

function manualInstallCommand(r: MarketplaceRecipe) {
  return `mkdir -p ~/.openclaw/workspace/recipes
# then move/copy the recipe Markdown into that folder
# e.g. mv ~/Downloads/${r.slug}.md ~/.openclaw/workspace/recipes/`;
}

// (formatIsoDate removed: no longer needed after removing duplicate metadata card)

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
      bodyMd: true,
      sourceUrl: true,
    },
  });
}

function submissionToRecipe(sub: {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  tagsCsv: string;
  sourceUrl: string | null;
  bodyMd: string | null;
  authorDisplayName: string;
  contactEmail: string;
  license: string | null;
  createdAt: Date;
  updatedAt: Date;
}): MarketplaceRecipe {
  const slug = sub.slug ?? sub.id;
  const renderableSourceUrl = sub.sourceUrl ?? `/api/marketplace/recipes/${encodeURIComponent(slug)}/body`;

  return {
    slug,
    kind: "agent",
    origin: "ugc",
    name: sub.title,
    description: sub.description,
    version: "ugc",
    tags: String(sub.tagsCsv ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    sourceUrl: renderableSourceUrl,
    submissionId: sub.id,
    authorDisplayName: sub.authorDisplayName,
    contactEmail: sub.contactEmail,
    license: sub.license,
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
    ugcSourceUrl: sub.sourceUrl,
  };
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

function absoluteUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (!url.startsWith("/")) return url;

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return site ? `${site}${url}` : url;
}

async function fetchMarkdown(url: string): Promise<string | null> {
  try {
    const res = await fetch(absoluteUrl(url), { next: { revalidate: 300 } });
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

  const session = await getServerSession(authOptions);
  const role = session?.role ?? "user";
  const canModerate = role === "moderator" || role === "admin";

  let recipe: MarketplaceRecipe;
  try {
    recipe = await fetchRecipe(slug);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === "NOT_FOUND" && canModerate) {
      // Admin/moderator view: allow loading an unpublished submission directly.
      const sub = await prisma.submission.findFirst({
        where: { OR: [{ slug }, { id: slug }] },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          tagsCsv: true,
          sourceUrl: true,
          bodyMd: true,
          authorDisplayName: true,
          contactEmail: true,
          license: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (sub) {
        recipe = submissionToRecipe(sub);
      } else {
        // fall through to not-found UI
        recipe = null as unknown as MarketplaceRecipe;
      }
    } else if (msg === "NOT_FOUND") {
      recipe = null as unknown as MarketplaceRecipe;
    } else {
      throw e;
    }
  }

  if (!recipe) {
    return (
      <main className="w-full">
        <FadeIn>
          <section className="px-6 py-20 lg:px-16">
            <div className="mx-auto max-w-3xl">
              <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Marketplace</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">Recipe not found</h1>
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

  const scaffoldCmd = scaffoldCommand(recipe);
  const manualInstallCmd = manualInstallCommand(recipe);
  const moderation = canModerate ? await fetchModerationForRecipe(recipe) : null;

  // For unpublished UGC, recipe.sourceUrl may point at a route that requires moderator cookies;
  // fall back to DB body when present.
  const markdown = (moderation?.bodyMd ?? null) || (await fetchMarkdown(recipe.sourceUrl));

  return (
    <main className="w-full">
      <FadeIn>
        <section className="relative overflow-hidden px-6 py-16 lg:px-16">
          <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[color:color-mix(in_oklab,var(--coral-bright)_20%,transparent)] blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -top-20 h-56 w-56 rounded-full bg-[color:color-mix(in_oklab,var(--cyan-bright)_18%,transparent)] blur-3xl" />
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0 flex-1 sm:pr-4">
                <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">
                  Marketplace
                </p>
                <h1 className="mt-4 break-words text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
                  {recipe.name}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                  {recipe.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[var(--border)] bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--text)]">
                    {kindLabel(recipe.kind)}
                  </span>
                  <span className="rounded-full border border-[var(--border)] bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--text)]">
                    v{recipe.version}
                  </span>
                  {(recipe.tags ?? []).slice(0, 8).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--border)] bg-white/5 px-3 py-1 text-xs text-[var(--muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="order-first flex-none self-end sm:order-last sm:self-start">
                <BackButton
                  fallbackHref="/marketplace"
                  className="inline-block whitespace-nowrap rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[color:var(--coral-bright)] hover:bg-white/10"
                >
                  ← Back
                </BackButton>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="px-6 py-12 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-[var(--text)]">Install / Scaffold</h2>
            <p className="mt-2 text-[var(--muted)]">
              {recipe.origin === "bundled"
                ? "Built-in recipes can be scaffolded directly."
                : "Community recipes need to be copied into your local workspace first, then scaffolded."}
            </p>

            {recipe.origin === "bundled" ? (
              <div className="mt-5 max-w-full rounded-xl bg-slate-900/95 px-4 py-3 font-mono text-sm text-slate-200">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Scaffold command</div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="w-full overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
                    <span className="text-emerald-400">$</span> {scaffoldCmd}
                  </div>
                  <div className="self-end sm:self-auto">
                    <CopyLineButton text={scaffoldCmd} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid gap-4">
                <div className="max-w-full rounded-xl bg-slate-900/95 px-4 py-3 font-mono text-sm text-slate-200">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">1) Copy recipe into workspace</div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <pre className="w-full overflow-x-auto whitespace-pre-wrap break-words sm:whitespace-pre [-webkit-overflow-scrolling:touch]">
                      <code>{manualInstallCmd}</code>
                    </pre>
                    <div className="self-end sm:self-auto">
                      <CopyLineButton text={manualInstallCmd} />
                    </div>
                  </div>
                </div>

                <div className="max-w-full rounded-xl bg-slate-900/95 px-4 py-3 font-mono text-sm text-slate-200">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">2) Scaffold from that recipe</div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="w-full overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
                      <span className="text-emerald-400">$</span> {scaffoldCmd}
                    </div>
                    <div className="self-end sm:self-auto">
                      <CopyLineButton text={scaffoldCmd} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile-first layout: structured summary above raw recipe source */}
            <div className="mt-12 grid gap-10 lg:grid-cols-3">
              <aside className="min-w-0 lg:col-span-1">
                <details className="rounded-2xl border border-[var(--border)] bg-white/70 p-6" open>
                  <summary className="cursor-pointer text-lg font-bold text-[var(--text)]">Recipe information</summary>
                  <div className="mt-3 space-y-1 text-sm text-[var(--muted)]">
                    <div>
                      <span className="text-[var(--muted)]">Recipe id:</span> <span className="font-mono text-[var(--text)]">{recipe.id ?? recipe.slug}</span>
                    </div>
                    <div>
                      <span className="text-[var(--muted)]">Version:</span> <span className="text-[var(--text)]">{recipe.version}</span>
                    </div>
                    {recipe.kind === "team" ? (
                      <div>
                        <span className="text-[var(--muted)]">Team id:</span> <span className="font-mono text-[var(--text)]">{recipe.teamId ?? recipe.slug}</span>
                      </div>
                    ) : null}
                    {recipe.description ? <div className="pt-1 whitespace-pre-wrap text-[var(--text)]">{recipe.description}</div> : null}
                  </div>
                </details>

                <details className="mt-6 rounded-2xl border border-[var(--border)] bg-white/70 p-6" open>
                  <summary className="cursor-pointer text-lg font-bold text-[var(--text)]">Agents ({recipe.agents?.length ?? 0})</summary>
                  <div className="mt-3 space-y-2">
                    {(recipe.agents ?? []).map((a, idx) => (
                      <details key={`${a.role ?? "agent"}:${idx}`} className="rounded-xl border border-[var(--border)] bg-white/60 p-4">
                        <summary className="cursor-pointer text-sm text-[var(--text)]">
                          <span className="font-semibold">{a.name ?? a.role ?? "(unnamed)"}</span>
                          {a.role ? <span className="text-[var(--muted)]"> — {a.role}</span> : null}
                        </summary>
                        <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                          <div>
                            <span className="text-[var(--muted)]">Role:</span> <span className="text-[var(--text)]">{a.role ?? "(none)"}</span>
                          </div>
                          <div>
                            <span className="text-[var(--muted)]">Tools profile:</span> <span className="text-[var(--text)]">{a.tools?.profile ?? "(default)"}</span>
                          </div>
                          <div>
                            <span className="text-[var(--muted)]">Allow:</span>{" "}
                            <span className="text-[var(--text)]">{(a.tools?.allow ?? []).length ? (a.tools?.allow ?? []).join(", ") : "(none)"}</span>
                          </div>
                          <div>
                            <span className="text-[var(--muted)]">Deny:</span>{" "}
                            <span className="text-[var(--text)]">{(a.tools?.deny ?? []).length ? (a.tools?.deny ?? []).join(", ") : "(none)"}</span>
                          </div>
                          <div className="pt-1">
                            <span className="text-[var(--muted)]">Expected files:</span>{" "}
                            <span className="text-[var(--text)]">{(recipe.files ?? []).map((f) => f.path).filter(Boolean).join(", ") || "(not listed)"}</span>
                          </div>
                        </div>
                      </details>
                    ))}
                    {(!recipe.agents || recipe.agents.length === 0) ? (
                      <div className="text-sm text-[var(--muted)]">(No agents listed in frontmatter)</div>
                    ) : null}
                  </div>
                </details>

                <details className="mt-6 rounded-2xl border border-[var(--border)] bg-white/70 p-6" open>
                  <summary className="cursor-pointer text-lg font-bold text-[var(--text)]">Cron jobs ({recipe.cronJobs?.length ?? 0})</summary>
                  <div className="mt-3 space-y-2">
                    {(recipe.cronJobs ?? []).map((c, idx) => (
                      <details key={`${c.id ?? "cron"}:${idx}`} className="rounded-xl border border-[var(--border)] bg-white/60 p-4">
                        <summary className="cursor-pointer text-sm text-[var(--text)]">
                          <span className="font-semibold">{c.name ?? c.id ?? "(unnamed)"}</span>
                          {c.schedule ? <span className="text-[var(--muted)]"> — {c.schedule}</span> : null}
                        </summary>
                        <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                          {c.timezone ? (
                            <div>
                              <span className="text-[var(--muted)]">Timezone:</span> <span className="text-[var(--text)]">{c.timezone}</span>
                            </div>
                          ) : null}
                          {typeof c.enabledByDefault === "boolean" ? (
                            <div>
                              <span className="text-[var(--muted)]">Enabled by default:</span>{" "}
                              <span className="text-[var(--text)]">{c.enabledByDefault ? "yes" : "no"}</span>
                            </div>
                          ) : null}
                          {c.message ? (
                            <div className="mt-2 whitespace-pre-wrap rounded-lg border border-[var(--border)] bg-white/60 p-3 text-sm text-[var(--text)]">
                              {c.message}
                            </div>
                          ) : null}
                        </div>
                      </details>
                    ))}
                    {(!recipe.cronJobs || recipe.cronJobs.length === 0) ? (
                      <div className="text-sm text-[var(--muted)]">(No cron jobs listed in frontmatter)</div>
                    ) : null}
                  </div>
                </details>

                {/* removed duplicate top "How to install" (metadata) card per RJ */}

                <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white/70 p-6">
                  <h3 className="text-lg font-bold text-[var(--text)]">
                    {recipe.origin === "bundled" ? "How to scaffold" : "How to install"}
                  </h3>

                  {recipe.origin === "bundled" ? (
                    <>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        This recipe is built in, so you do not need to download or copy any Markdown first.
                      </p>
                      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--text)]">
                        <li>Open a terminal where OpenClaw is installed.</li>
                        <li>Run the scaffold command shown above.</li>
                        <li>Adjust the generated team or agent id if you want a different local name.</li>
                      </ol>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Community recipes need to be downloaded as Markdown, copied into your OpenClaw workspace, and
                        then scaffolded locally.
                      </p>

                      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--text)]">
                        <li>
                          Click <span className="font-semibold">View raw</span> below to open the recipe Markdown.
                        </li>
                        <li>
                          Save it locally as <span className="font-mono">{recipe.slug}.md</span>.
                        </li>
                        <li>Move it into your workspace recipes folder.</li>
                        <li>Run the scaffold command shown above.</li>
                      </ol>

                      <pre className="mt-3 max-w-full overflow-x-auto overflow-y-auto whitespace-pre-wrap break-words sm:whitespace-pre rounded-xl bg-slate-900/95 px-4 py-3 text-sm text-slate-200 [-webkit-overflow-scrolling:touch]">
                        <code>{manualInstallCmd}</code>
                      </pre>

                      <p className="mt-3 text-sm text-[var(--muted)]">After that, it should show up in your local OpenClaw recipes list and be ready to scaffold.</p>
                    </>
                  )}
                </div>
              </aside>

              <div className="min-w-0 lg:col-span-2">
                <h2 className="text-2xl font-bold text-[var(--text)]">Source</h2>
                <p className="mt-2 text-[var(--muted)]">This is the recipe’s Markdown source.</p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[color:var(--coral-bright)]"
                  >
                    View raw
                  </a>
                  {recipe.homepageUrl ? (
                    <a
                      href={recipe.homepageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[color:var(--coral-bright)]"
                    >
                      Project
                    </a>
                  ) : null}
                  {markdown ? <CopyLineButton text={markdown} size="default" /> : null}
                </div>

                <div className="mt-5 max-w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
                  {markdown ? (
                    <div className="max-h-none overflow-visible px-6 py-5 sm:max-h-[70vh] sm:overflow-auto">
                      <div className="space-y-4 text-[15px] leading-7 text-[var(--text)]">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)]">{children}</h3>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target={href?.startsWith("/") ? undefined : "_blank"}
                                rel={href?.startsWith("/") ? undefined : "noreferrer"}
                                className="text-[color:var(--coral-bright)] underline"
                              >
                                {children}
                              </a>
                            ),
                            code: ({ className, children }) => {
                              const isBlock = className?.includes("language-");
                              if (isBlock) return <code className={className}>{children}</code>;
                              return (
                                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.95em] text-slate-900">
                                  {children}
                                </code>
                              );
                            },
                            pre: ({ children }) => (
                              <pre className="max-w-full overflow-x-auto rounded-xl bg-slate-900/95 px-4 py-3 font-mono text-sm text-slate-200 [-webkit-overflow-scrolling:touch]">
                                {children}
                              </pre>
                            ),
                            ul: ({ children }) => <ul className="list-disc space-y-1 pl-6">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal space-y-1 pl-6">{children}</ol>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-slate-200 pl-4 text-[var(--muted)]">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
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
            </div>

            {role === "admin" ? (
                <div className="mt-6 rounded-2xl border border-[var(--border)] bg-slate-50 p-6">
                  <h3 className="text-lg font-bold text-[var(--text)]">Moderation</h3>

                  {recipe.origin !== "ugc" ? (
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      This is a bundled recipe (no submission moderation state).
                    </p>
                  ) : !moderation ? (
                    <p className="mt-2 text-sm text-[var(--muted)]">No moderation record found for this submission.</p>
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
                        <dd className="font-mono text-[var(--text)]">{moderation.moderatedByUserId ?? "—"}</dd>
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
                        <dd className="font-mono text-[var(--text)]">{moderation.publishedByUserId ?? "—"}</dd>
                      </div>
                    </dl>
                  )}
                </div>
              ) : null}
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
