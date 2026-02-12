import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Marketplace – Clawcipes",
  description: "Browse available Clawcipes recipes for OpenClaw.",
};

const repoBase = "https://github.com/rjdjohnston/clawcipes/blob/main/recipes/default";

const teamRecipes = [
  {
    id: "development-team",
    name: "Development Team",
    icon: "👨‍💻",
    description: "A small engineering team with lead, dev, devops, and QA roles. Includes agile lanes, shared context, and cron-powered triage/execution loops.",
  },
  {
    id: "product-team",
    name: "Product Team",
    icon: "📦",
    description: "Product-focused team with lead, PM, designer, dev, and QA. Great for product development workflows with design and spec handoffs.",
  },
  {
    id: "research-team",
    name: "Research Team",
    icon: "🔬",
    description: "Research-oriented team for deep dives, literature reviews, and synthesis. Includes lead, researchers, and analyst roles.",
  },
  {
    id: "writing-team",
    name: "Writing Team",
    icon: "✍️",
    description: "Content creation team with lead, writers, and editors. Perfect for blogs, documentation, and marketing content pipelines.",
  },
  {
    id: "social-team",
    name: "Social Team",
    icon: "📱",
    description: "Social media and community team with lead, writer, editor, and research roles. Manage content calendars and engagement.",
  },
  {
    id: "customer-support-team",
    name: "Customer Support Team",
    icon: "🎧",
    description: "Support-focused team for handling tickets, escalations, and knowledge base maintenance.",
  },
];

const agentRecipes = [
  {
    id: "developer",
    name: "Developer",
    icon: "🧑‍🔧",
    description: "A standalone software engineer agent. Implements features, writes tests, and keeps code quality high.",
  },
  {
    id: "researcher",
    name: "Researcher",
    icon: "🔍",
    description: "A standalone research agent. Performs deep dives, gathers sources, and synthesizes findings into reports.",
  },
  {
    id: "editor",
    name: "Editor",
    icon: "📝",
    description: "A standalone editor agent. Reviews and refines written content for clarity, style, and correctness.",
  },
  {
    id: "project-manager",
    name: "Project Manager",
    icon: "📋",
    description: "A standalone PM agent. Tracks tasks, coordinates work, and keeps projects on schedule.",
  },
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
      className="group block rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
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
      <div className="mt-4 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 font-mono text-xs text-slate-300">
        <span className="text-emerald-400">$</span> {command}
      </div>
    </a>
  );
}

export default function MarketplacePage() {
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
