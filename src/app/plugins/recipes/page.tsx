import Link from "next/link";

import { CodeBlock } from "@/components/plugins/CodeBlock";
import { ScreenshotGrid } from "@/components/ScreenshotGrid";

export const metadata = {
  title: "Recipes Plugin – ClawRecipes",
};

const recipeScreens = [
  { src: "/images/recipes/recipes-1.png", alt: "Recipes marketplace" },
  { src: "/images/recipes/recipes-2.png", alt: "Recipes marketplace detail" },
];

const workflowScreens = [
  { src: "/images/workflows/workflow-runs.png", alt: "Workflow runs" },
  { src: "/images/workflows/workflow-runs-detail.png", alt: "Workflow run detail" },
  { src: "/images/tickets/tickets-1.png", alt: "Tickets" },
  { src: "/images/tickets/edit-tickets.png", alt: "Edit ticket" },
];

const highlights = [
  { icon: "🧑‍🤝‍🧑", title: "Scaffold full teams", body: "Generate role-based teams with shared workspace and conventions." },
  { icon: "🤖", title: "Scaffold single agents", body: "Spin up one focused agent quickly when you do not need a full team." },
  { icon: "🗂️", title: "File-first workflow", body: "Keep AGENTS, tickets, artifacts, and team memory in your repository." },
  { icon: "🧩", title: "Marketplace install", body: "Install proven templates instead of rebuilding setup from scratch." },
];

export default function RecipesPluginPage() {
  return (
    <main className="px-6 py-16 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-12">
          <div className="pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full bg-[color:color-mix(in_oklab,var(--coral-bright)_24%,transparent)] blur-3xl" />
          <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Plugin</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-6xl">ClawRecipes</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Scaffold teams and agents from recipe templates, enforce repeatable structures, and run file-first delivery
            with clean handoffs.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/marketplace" className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
              Browse Marketplace
            </Link>
            <Link href="/plugins/kitchen" className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10">
              Explore ClawKitchen
            </Link>
            <a href="https://github.com/JIGGAI/ClawRecipes" target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10">
              GitHub
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--border)] bg-[color:var(--card)] p-5 shadow-[var(--shadow)]">
              <div className="inline-grid size-10 place-items-center rounded-xl bg-white/10 text-lg">{item.icon}</div>
              <h2 className="mt-3 text-lg font-semibold text-[var(--text)]">{item.title}</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Quick Install</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <CodeBlock title="OpenClaw plugin" code="openclaw plugins install @jiggai/recipes" />
            <CodeBlock title="Restart gateway" code="openclaw gateway restart" />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Product View</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">What it looks like in practice</h2>
          <div className="mt-6">
            <ScreenshotGrid items={recipeScreens} columns="2" />
          </div>
          <div className="mt-8">
            <ScreenshotGrid items={workflowScreens} columns="4" />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Command Reference</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <CodeBlock title="List + inspect recipes" code={"openclaw recipes list\nopenclaw recipes show <recipeId>"} />
            <CodeBlock title="Scaffold team + agent" code={"openclaw recipes scaffold-team <recipeId> -t <teamId> --apply-config\nopenclaw recipes scaffold <recipeId> --agent-id <agentId> --apply-config"} />
            <CodeBlock title="Tickets workflow" code={"openclaw recipes tickets --team-id <teamId>\nopenclaw recipes move-ticket --team-id <teamId> --ticket <ticket> --to testing\nopenclaw recipes complete --team-id <teamId> --ticket <ticket>"} />
            <CodeBlock title="Maintenance" code={"openclaw recipes remove-team --team-id <teamId>\nopenclaw recipes cleanup-workspaces --yes"} />
          </div>
        </section>
      </div>
    </main>
  );
}
