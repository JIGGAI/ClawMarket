import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { fetchMarketplaceRecipes } from "@/lib/marketplace";
// auth handled via /login page; marketplace landing is public

export const metadata = {
  title: "Marketplace – ClawRecipes",
  description: "Browse available ClawRecipes recipes for OpenClaw.",
};


const fallbackTeamRecipes = [
  {
    id: "development-team",
    name: "Development Team",
    icon: "👨‍💻",
    description:
      "A small engineering team with lead, dev, devops, and QA roles. Includes agile lanes, shared context, and cron-powered triage/execution loops.",
  },
  { id: "product-team", name: "Product Team", icon: "📦", description: "Product-focused team with lead, PM, designer, dev, and QA." },
  { id: "marketing-team", name: "Marketing Team", icon: "📣", description: "Full marketing execution loop: SEO + copy + ads + design + analytics + video + compliance." },
  { id: "research-team", name: "Research Team", icon: "🔬", description: "Citations-first research pipeline: sources → notes → briefs." },
  { id: "writing-team", name: "Writing Team", icon: "✍️", description: "Briefs → outlines → drafts → review/edit (testing) → done." },
  { id: "social-team", name: "Social Team", icon: "📱", description: "Platform-specialist social execution: listening + editorial + distributor + platform roles; reports learnings back to marketing." },
  { id: "customer-support-team", name: "Customer Support Team", icon: "🎧", description: "Triage → resolve → verification (testing) → done/outbox." },

  // Vertical packs (bundled defaults)
  { id: "business-team", name: "Business Team", icon: "💼", description: "Generalist business execution team: ops, sales, marketing, finance, analyst." },
  { id: "law-firm-team", name: "Law Firm Team", icon: "⚖️", description: "Legal workflow: intake → research → drafting → compliance/ops." },
  { id: "clinic-team", name: "Clinic Team", icon: "🩺", description: "Clinic operations: intake, scheduling, billing, compliance, patient education." },
  { id: "construction-team", name: "Construction Team", icon: "🏗️", description: "Project delivery: PM, estimator, scheduler, safety, procurement." },
  { id: "financial-planner-team", name: "Financial Planner Team", icon: "📈", description: "Planning practice: advisor, analyst, tax, insurance, client ops." },
  { id: "stock-trader-team", name: "Stock Trader Team", icon: "📊", description: "Trading support: research, signals, risk, journaling, ops." },
  { id: "crypto-trader-team", name: "Crypto Trader Team", icon: "🪙", description: "Crypto workflow with onchain research + catalysts + risk + journaling." },
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
  const detailUrl = `/marketplace/recipes/${id}`;
  const command =
    kind === "team"
      ? `openclaw recipes scaffold-team ${id} -t my-${id} --apply-config`
      : `openclaw recipes scaffold ${id} --agent-id my-${id.replace(/-/g, "")} --apply-config`;

  return (
    <a
      href={detailUrl}
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

  const liveTeam = (live ?? []).filter((r) => r.kind === "team");
  const liveAgent = (live ?? []).filter((r) => r.kind === "agent");

  // Merge strategy:
  // - Always include our bundled fallback cards (so the marketplace never "loses" recipes due to a stale registry.json)
  // - If the live registry includes a recipe with the same slug, prefer the live name/description.
  // - Include any extra live-only recipes too.
  const teamById = new Map(fallbackTeamRecipes.map((r) => [r.id, r] as const));
  for (const r of liveTeam) {
    teamById.set(r.slug, { id: r.slug, name: r.name, icon: "🍳", description: r.description });
  }
  const teamRecipes = Array.from(teamById.values());

  const agentById = new Map(fallbackAgentRecipes.map((r) => [r.id, r] as const));
  for (const r of liveAgent) {
    agentById.set(r.slug, { id: r.slug, name: r.name, icon: "🤖", description: r.description });
  }
  const agentRecipes = Array.from(agentById.values());

  return (
    <main className="w-full">
      <FadeIn>
        <section className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">
              Marketplace
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-[var(--text)] lg:text-6xl">
              Browse Recipes
            </h1>
            <p className="mt-6 text-xl leading-8 text-[var(--muted)]">
              Pre-built recipes for teams and agents. Click any card to view full details, install commands, and source.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/marketplace/submit"
                className="inline-block rounded-lg bg-[color:var(--coral-bright)] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:brightness-95"
              >
                Submit a recipe
              </a>
              <Link
                href="/marketplace/recipes"
                className="inline-block rounded-lg border border-[var(--border)] bg-white/70 px-6 py-3 text-base font-semibold text-[var(--text)] shadow-sm transition hover:border-[color:var(--coral-bright)]"
              >
                Community recipes
              </Link>
            </div>
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
                href="https://github.com/JIGGAI/ClawRecipes/tree/main/recipes/default"
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
