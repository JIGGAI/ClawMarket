import Link from "next/link";

import { CodeBlock } from "@/components/plugins/CodeBlock";
import { ScreenshotGrid } from "@/components/ScreenshotGrid";
import { ManagedServiceInterestForm } from "@/components/ManagedServiceInterestForm";

export const metadata = {
  title: "Recipes Plugin – ClawRecipes",
};

const featureSections = [
  {
    eyebrow: "Feature 1",
    title: "Orchestrators that turn prompts into operating systems",
    body:
      "ClawRecipes is not just a scaffold command. It is the install layer for real operating models. Teams can install recipes that already define roles, file structure, workflow expectations, escalation paths, and ticket discipline. Instead of inventing a team from scratch every time, you start from a known-good operating shape and adapt from there.",
    bullets: [
      "Install ready-made multi-agent team blueprints",
      "Keep role boundaries, authority, and handoffs explicit",
      "Start from repeatable structure instead of vibes",
    ],
    images: [
      { src: "/images/recipes/recipes-1.png", alt: "Recipes marketplace" },
      { src: "/images/recipes/recipes-2.png", alt: "Recipes marketplace detail" },
      { src: "/images/workflows/workflow-runs.png", alt: "Workflow runs" },
      { src: "/images/tickets/tickets-1.png", alt: "Tickets" },
    ],
  },
  {
    eyebrow: "Feature 2",
    title: "Workflow triggers for real execution, not demos",
    body:
      "Recipes pair naturally with orchestrated workflows. Trigger work from cron schedules, events, or manual launches, then move it through research, LLM steps, approvals, handoffs, media generation, and publishing. The result is not just agent output, it is a repeatable delivery system.",
    bullets: [
      "Manual, scheduled, and event-driven workflow entry points",
      "Structured movement across node types and roles",
      "Artifacts and outputs preserved in the workspace",
    ],
    images: [
      { src: "/images/workflows/workflow-runs-detail.png", alt: "Workflow run detail" },
      { src: "/images/tickets/edit-tickets.png", alt: "Edit ticket" },
      { src: "/images/cron/cron-1.png", alt: "Cron jobs" },
      { src: "/images/agents/agents-1.png", alt: "Agents" },
    ],
  },
  {
    eyebrow: "Feature 3",
    title: "Managed memory that survives the next run",
    body:
      "Most agent setups lose the plot as soon as context shifts. ClawRecipes keeps team memory, instructions, tickets, and artifacts grounded in files the whole system can read. That makes continuity inspectable, reviewable, and reusable across sessions, runs, and team members.",
    bullets: [
      "Durable workspace context instead of hidden state",
      "Managed team memory across runs and roles",
      "Clean history in git for review and trust",
    ],
    images: [
      { src: "/images/agents/agents-2.png", alt: "Agent detail" },
      { src: "/images/tickets/tickets-2.png", alt: "Tickets board" },
      { src: "/images/workflows/workflow-runs.png", alt: "Workflow runs" },
      { src: "/images/recipes/recipes-1.png", alt: "Recipes" },
    ],
  },
  {
    eyebrow: "Feature 4",
    title: "Skills for a team or for one specialist",
    body:
      "Some capabilities belong across the whole team. Others belong only to one role. ClawRecipes gives you that flexibility. Install skills at the right scope so teams share the right operating rules while individual agents can still specialize deeply where needed.",
    bullets: [
      "Attach skills to a team-wide operating model",
      "Give one role deeper tooling or domain behavior",
      "Keep capability packaging installable and maintainable",
    ],
    images: [
      { src: "/images/recipes/recipes-2.png", alt: "Recipes marketplace detail" },
      { src: "/images/workflows/workflow-runs-detail.png", alt: "Workflow detail" },
      { src: "/images/cron/cron-2.png", alt: "Cron jobs" },
      { src: "/images/agents/agents-1.png", alt: "Agents" },
    ],
  },
];

export default function RecipesPluginPage() {
  return (
    <main className="px-6 py-16 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-12">
          <div className="pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full bg-[color:color-mix(in_oklab,var(--coral-bright)_24%,transparent)] blur-3xl" />
          <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Plugin</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-6xl">ClawRecipes</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-[var(--muted)]">
            The installation layer for OpenClaw teams. Scaffold roles, workflows, memory structure, and repeatable operating patterns so your agent stack feels like a real system, not a pile of prompts.
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
          {[
            ["Scaffold full teams", "Generate production-shaped teams with roles, shared workspace conventions, ticket flow, and instructions already wired together."],
            ["Scaffold single agents", "Spin up one focused specialist fast when you want a single operator instead of an entire staffed team."],
            ["Managed memory", "Keep durable team context in files and structured memory instead of relying on one long fragile transcript."],
            ["Installable operating systems", "Use marketplace recipes, skills, and proven setups to get to a working system quickly instead of rebuilding process from scratch."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-[var(--border)] bg-[color:var(--card)] p-5 shadow-[var(--shadow)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
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

        <section className="mt-10 space-y-6">
          {featureSections.map((section) => (
            <div key={section.title} className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">{section.eyebrow}</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">{section.title}</h2>
                  <p className="mt-4 text-base leading-8 text-[var(--muted)]">{section.body}</p>
                  <ul className="mt-6 space-y-3 text-sm leading-6 text-[var(--muted)]">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-1 text-[color:var(--coral-bright)]">●</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <ScreenshotGrid items={section.images} columns="2" />
                </div>
              </div>
            </div>
          ))}
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

        <section className="mt-10 rounded-3xl border border-[color:color-mix(in_oklab,var(--coral-bright)_55%,transparent)] bg-[linear-gradient(135deg,rgba(255,77,77,0.14),rgba(255,77,77,0.04))] p-8 shadow-[var(--shadow)] lg:p-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#ffc1c1]">Coming soon</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">Managed AI teams</h3>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Want a team designed, installed, and tuned for your company? Join the list for the managed AI team product and service.
            </p>
          </div>
          <ManagedServiceInterestForm title="Tell us what kind of managed AI team help you want and we&apos;ll follow up when early spots open." source="recipes-page-managed-ai-team" />
        </section>
      </div>
    </main>
  );
}
