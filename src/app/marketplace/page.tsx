import { FadeIn } from "@/components/FadeIn";
import { fetchMarketplaceRecipes } from "@/lib/marketplace";

export const metadata = {
  title: "Marketplace – Clawcipes",
  description: "Browse available Clawcipes recipes for OpenClaw.",
};

const repoBase = "https://github.com/rjdjohnston/clawcipes/blob/main/recipes/default";

const fallbackTeamRecipes = [
  {
    id: "development-team",
    name: "Development Team",
    icon: "👨‍💻",
    description:
      "A small engineering team with lead, dev, devops, and QA roles. Includes agile lanes, shared context, and cron-powered triage/execution loops.",
  },
  { id: "product-team", name: "Product Team", icon: "📦", description: "Product-focused team with lead, PM, designer, dev, and QA." },
  { id: "research-team", name: "Research Team", icon: "🔬", description: "Citations-first research pipeline: sources → notes → briefs." },
  { id: "writing-team", name: "Writing Team", icon: "✍️", description: "Briefs → outlines → drafts → review/edit (testing) → done." },
  { id: "social-team", name: "Social Team", icon: "📱", description: "Draft → approval/review (testing) → schedule/publish." },
  { id: "customer-support-team", name: "Customer Support Team", icon: "🎧", description: "Triage → resolve → verification (testing) → done/outbox." },
];

const fallbackAgentRecipes = [
  { id: "developer", name: "Developer", icon: "🧑‍🔧", description: "Standalone software engineer agent." },
  { id: "researcher", name: "Researcher", icon: "🔍", description: "Standalone research agent." },
  { id: "editor", name: "Editor", icon: "📝", description: "Standalone editor agent." },
  { id: "project-manager", name: "Project Manager", icon: "📋", description: "Standalone PM agent." },
];

function RecipeCard({
  id,
  name,
  icon,
  description,
  kind,
}: {
  id: string;
  name: string;
  icon: string;
  description: string;
  kind: "team" | "agent";
}) {
  const url = `${repoBase}/${id}.md`;
  const command =
    kind === "team"
      ? `openclaw recipes scaffold-team ${id} -t my-${id} --apply-config`
      : `openclaw recipes scaffold ${id} --agent-id my-${id.replace("-", "")} --apply-config`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-2xl bg-white/70 p-6 transition hover:bg-white"
    >
      <div className="flex items-start gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-md">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="min-w-0">
          <div className="text-xl font-semibold text-[var(--text)] group-hover:text-[color:var(--coral-bright)]">
            {name}
          </div>
          <div className="mt-1 text-sm uppercase tracking-wide text-[var(--muted)]">
            {kind === "team" ? "Team Recipe" : "Agent Recipe"}
          </div>
        </div>
      </div>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">{description}</p>
      <div className="mt-4 overflow-x-auto rounded-lg bg-slate-900/95 px-4 py-3 font-mono text-xs text-slate-300">
        <span className="text-emerald-400">$</span> {command}
      </div>
    </a>
  );
}

export default async function MarketplacePage() {
  const live = await fetchMarketplaceRecipes();

  const teamRecipes = live
    ? live.filter((r) => r.kind === "team").map((r) => ({ id: r.slug, name: r.name, icon: "🍳", description: r.description }))
    : fallbackTeamRecipes;

  const agentRecipes = live
    ? live.filter((r) => r.kind === "agent").map((r) => ({ id: r.slug, name: r.name, icon: "🤖", description: r.description }))
    : fallbackAgentRecipes;

  return (
    <main className="w-full">
      <FadeIn>
        <section className="bg-gradient-to-b from-slate-50 to-white px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">
              Marketplace
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-[var(--text)] lg:text-6xl">
              Browse Recipes
            </h1>
            <p className="mt-6 text-xl leading-8 text-[var(--muted)]">
              Pre-built recipes for teams and agents. Click any card to view the recipe source on GitHub.
            </p>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="px-6 py-16 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-[var(--text)]">Team Recipes</h2>
            <p className="mt-2 text-lg text-[var(--muted)]">
              Multi-agent teams with shared workspaces, roles, and agile workflows.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamRecipes.map((r) => (
                <RecipeCard key={r.id} {...r} kind="team" />
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="bg-slate-50 px-6 py-16 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-[var(--text)]">Agent Recipes</h2>
            <p className="mt-2 text-lg text-[var(--muted)]">
              Standalone agents for specific tasks. Scaffold one and start working.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {agentRecipes.map((r) => (
                <RecipeCard key={r.id} {...r} kind="agent" />
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="px-6 py-16 lg:px-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-[var(--text)]">Create Your Own</h2>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Recipes are just Markdown files with YAML frontmatter. Fork an existing recipe or start from scratch.
            </p>
            <div className="mt-8">
              <a
                href="https://github.com/rjdjohnston/clawcipes/tree/main/recipes/default"
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-lg bg-[color:var(--coral-bright)] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:brightness-95"
              >
                View All Recipes on GitHub
              </a>
            </div>
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
