import Link from "next/link";

import { FadeIn } from "@/components/FadeIn";
import { CopyLineButton } from "@/components/CopyLineButton";
import { ScreenshotGrid } from "@/components/ScreenshotGrid";
import { getPublicMetrics } from "@/lib/public-metrics";
import { WorkflowsShowcase } from "@/components/WorkflowsShowcase";
import { NewsletterSubscribeForm } from "@/components/NewsletterSubscribeForm";
import { Chef3D } from "@/components/Chef3D";

const agents = [
  { name: "Lead", icon: "🧑‍🍳", blurb: "Owns the plan and keeps the kitchen moving." },
  { name: "Dev", icon: "🧑‍🔧", blurb: "Builds features and keeps quality high." },
  { name: "DevOps", icon: "🧯", blurb: "Keeps deployments, infra, and safety tight." },
  { name: "QA", icon: "🔍", blurb: "Verifies recipes and catches regressions." },
];

// Screenshots (openable in modal)
const kitchenImages = Array.from({ length: 8 }).map((_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/images/plugins/kitchen/kitchen-${n}.jpg`,
    alt: `ClawKitchen screenshot ${n}`,
  };
});

const teamSlides = [
  { label: "Team Builder", src: "/images/teams/team-building.png", alt: "Team builder" },
  { label: "Create Team", src: "/images/teams/create-custom-team.png", alt: "Create custom team" },
  { label: "Team Details", src: "/images/teams/custom-team-2.png", alt: "Custom team details" },
  { label: "Team Editor", src: "/images/teams/marketing-team-editor.png", alt: "Marketing team editor" },
];

const workflowSlides = [
  { label: "Workflow Board", src: "/images/workflows/workflow-1.png", alt: "Workflow board" },
  { label: "Run Queue", src: "/images/workflows/workflow-runs.png", alt: "Workflow run queue" },
  { label: "Run Detail", src: "/images/workflows/workflow-runs-detail.png", alt: "Workflow run detail" },
  { label: "Execution View", src: "/images/workflows/workflow-3.png", alt: "Workflow execution view" },
];

const ticketsImages = [
  { src: "/images/tickets/tickets-1.png", alt: "Tickets" },
  { src: "/images/tickets/tickets-2.png", alt: "Tickets" },
  { src: "/images/tickets/edit-tickets.png", alt: "Edit ticket" },
];

const agentsImages = [
  { src: "/images/agents/agents-1.png", alt: "Agents" },
  { src: "/images/agents/agents-2.png", alt: "Agents" },
];

const recipesImages = [
  { src: "/images/recipes/recipes-1.png", alt: "Recipes marketplace" },
  { src: "/images/recipes/recipes-2.png", alt: "Recipes marketplace" },
];

const cronImages = [
  { src: "/images/cron/cron-1.png", alt: "Cron jobs" },
  { src: "/images/cron/cron-2.png", alt: "Cron jobs" },
];

const whatYouGet = [
  {
    title: "Multi-agent teams",
    desc: "Lead, Dev, DevOps, QA templates ready to run.",
    icon: "🧑‍🤝‍🧑",
    iconBg: "bg-[#3b82f6]/20",
    iconColor: "text-[#93c5fd]",
  },
  {
    title: "Shared context",
    desc: "File-first workflows in git, readable and reviewable.",
    icon: "🧠",
    iconBg: "bg-[#14b8a6]/20",
    iconColor: "text-[#5eead4]",
  },
  {
    title: "Cron automation",
    desc: "Recurring ops loops with explicit install consent.",
    icon: "⏰",
    iconBg: "bg-[#f59e0b]/20",
    iconColor: "text-[#fcd34d]",
  },
  {
    title: "Recipe marketplace",
    desc: "Install proven team and agent templates instantly.",
    icon: "🛒",
    iconBg: "bg-[#f43f5e]/20",
    iconColor: "text-[#fda4af]",
  },
];

// These filenames include a narrow no-break space in the original screenshot name; use URL-encoded paths.
const goalsImages = [
  {
    src: "/images/goals/Screenshot%202026-03-06%20at%2010.57.02%E2%80%AFPM.png",
    alt: "Goals" ,
  },
  {
    src: "/images/goals/Screenshot%202026-03-06%20at%2010.57.31%E2%80%AFPM.png",
    alt: "Goals" ,
  },
];

function Card({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[color:var(--card)] p-6 shadow-[var(--shadow)]">
      <h3 className="text-lg font-semibold tracking-tight text-[var(--text)]">{title}</h3>
      <p className="mt-2 text-base leading-7 text-[var(--muted)]">{body}</p>
    </div>
  );
}

export default async function HomePage() {
  const metrics = await getPublicMetrics();
  const trustStats = [
    {
      label: "GitHub Stars",
      value: metrics.stars,
      blurb: "Open source with an active contributor base.",
      icon: "⭐",
      iconBg: "bg-[#f59e0b]/20",
      iconColor: "text-[#fcd34d]",
    },
    {
      label: "ClawRecipes Installs",
      value: metrics.recipesInstalls,
      blurb: "Last 30 days on npm for @jiggai/recipes.",
      icon: "📦",
      iconBg: "bg-[#3b82f6]/20",
      iconColor: "text-[#93c5fd]",
    },
    {
      label: "ClawKitchen Installs",
      value: metrics.kitchenInstalls,
      blurb: "Last 30 days on npm for @jiggai/kitchen.",
      icon: "🍳",
      iconBg: "bg-[#10b981]/20",
      iconColor: "text-[#6ee7b7]",
    },
  ];

  return (
    <main className="w-full">
      <FadeIn>
        <section className="relative overflow-hidden px-6 py-20 lg:px-16 lg:py-28">
          <div className="pointer-events-none absolute left-8 top-8 h-12 w-12 border-l-2 border-t-2 border-dashed border-[color:color-mix(in_oklab,var(--coral-bright)_35%,transparent)] lg:left-16 lg:top-16 lg:h-20 lg:w-20" />
          <div className="pointer-events-none absolute right-8 top-8 h-12 w-12 border-r-2 border-t-2 border-dashed border-[color:color-mix(in_oklab,var(--coral-bright)_35%,transparent)] lg:right-16 lg:top-16 lg:h-20 lg:w-20" />
          <div className="pointer-events-none absolute bottom-8 left-8 h-12 w-12 border-b-2 border-l-2 border-dashed border-[color:color-mix(in_oklab,var(--coral-bright)_35%,transparent)] lg:bottom-16 lg:left-16 lg:h-20 lg:w-20" />
          <div className="pointer-events-none absolute bottom-8 right-8 h-12 w-12 border-b-2 border-r-2 border-dashed border-[color:color-mix(in_oklab,var(--coral-bright)_35%,transparent)] lg:bottom-16 lg:right-16 lg:h-20 lg:w-20" />

          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">ClawRecipes — OpenClaw Recipes</p>

              <h1 className="mt-6 text-5xl font-bold tracking-tight text-[var(--text)] sm:text-6xl lg:text-7xl">
                Stop hacking agents.
                <span className="mt-2 block text-[var(--coral-bright)]">Start cooking with recipes.</span>
              </h1>

              <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)] lg:text-2xl">
                Markdown blueprints build complete OpenClaw teams: file-first context, recurring cron magic, coworker-style
                specialists, agile flow locked in git. From scaffold to shipped, repeatable and reviewable every time.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  className="rounded-lg bg-[color:var(--coral-bright)] px-6 py-3 text-base font-semibold text-[#0b1220] shadow-md transition hover:brightness-95"
                  href="/marketplace"
                >
                  Browse Marketplace
                </Link>
                <a
                  className="rounded-lg border border-[var(--border)] bg-white/5 px-6 py-3 text-base font-semibold text-[var(--text)] shadow-md transition hover:bg-white/10"
                  href="https://github.com/rjdjohnston/clawcipes"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub
                </a>
              </div>

              <div className="mt-4">
                <a
                  className="inline-flex items-center rounded-lg border border-[var(--border)] bg-white/5 px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10"
                  href="https://discord.gg/BKGUkGTR"
                  target="_blank"
                  rel="noreferrer"
                >
                  Need help setting up? Get onboard help →
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                <a href="#shared-context" className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 transition hover:bg-white/10">Shared context</a>
                <a href="#team-agents" className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 transition hover:bg-white/10">Team agents</a>
                <a href="#run-structured" className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 transition hover:bg-white/10">Workflows</a>
                <a href="#teams-showcase" className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 transition hover:bg-white/10">Team builder</a>
                <a href="#agile-process" className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 transition hover:bg-white/10">Agile</a>
                <a href="#cron-automation" className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 transition hover:bg-white/10">Automation</a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              <div className="absolute -inset-4 rounded-3xl border-2 border-dashed border-[color:color-mix(in_oklab,var(--coral-bright)_35%,transparent)]" />

              <div className="relative rounded-2xl border border-[var(--border)] bg-[color:var(--card)] p-6 shadow-[var(--shadow)]">
                <Chef3D />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section id="proof" className="px-6 pb-6 lg:px-16 lg:pb-10">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-6 shadow-[var(--shadow)] lg:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Proof</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {trustStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-white/5 p-4">
                    <div className={`inline-grid size-8 place-items-center rounded-lg ${stat.iconBg}`}>
                      <span className={`text-base ${stat.iconColor}`}>{stat.icon}</span>
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{stat.label}</div>
                    <div className="mt-2 text-xl font-semibold text-[var(--text)]">{stat.value}</div>
                    <div className="mt-1 text-sm text-[var(--muted)]">{stat.blurb}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[color:color-mix(in_oklab,var(--coral-bright)_55%,transparent)] bg-[linear-gradient(135deg,rgba(255,77,77,0.2),rgba(255,77,77,0.05))] p-6 shadow-[var(--shadow)] lg:p-8">
              <div className="inline-flex rounded-full border border-[var(--border)] bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#ffc1c1]">
                Product Hunt
              </div>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-[var(--text)]">Featured launch: ClawRecipes</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Check the Product Hunt launch page and drop feedback from your workflow.
              </p>
              <a
                className="mt-5 inline-flex items-center rounded-lg bg-[color:var(--coral-bright)] px-4 py-2 text-sm font-semibold text-[#0b1220] transition hover:brightness-95"
                href="https://www.producthunt.com/products/clawrecipes-openclaw-recipes?launch=clawrecipes"
                target="_blank"
                rel="noreferrer"
              >
                View Product Hunt
              </a>
            </div>
          </div>

          <div className="mx-auto mt-6 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whatYouGet.map((item) => (
              <div key={item.title} className="rounded-2xl border border-[var(--border)] bg-[color:var(--card)] p-5 shadow-[var(--shadow)]">
                <div className={`inline-grid size-10 place-items-center rounded-xl ${item.iconBg}`}>
                  <span className={`text-lg ${item.iconColor}`}>{item.icon}</span>
                </div>
                <div className="mt-3 text-base font-semibold text-[var(--text)]">{item.title}</div>
                <div className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      <div className="border-y border-[var(--border)] bg-[color:var(--bg)]/75 py-6 text-center">
        <p className="text-lg text-[var(--muted)]">Best-in-class workflow automation for teams of all sizes.</p>
      </div>

      <FadeIn>
        <section id="quick-start" className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
              <span className="mr-2 text-[color:var(--coral-bright)]">❯</span>
              Quick Start
            </h2>

            <div className="codeblock mt-10 overflow-hidden rounded-2xl bg-[#0a1019] shadow-2xl">
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-3 rounded-full bg-red-500" />
                  <span className="inline-block size-3 rounded-full bg-yellow-500" />
                  <span className="inline-block size-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-4 text-sm text-slate-400">Terminal</span>
              </div>

              <div className="px-6 py-6 font-mono text-base">
                <div className="mb-4 text-slate-500"># Install ClawRecipes into OpenClaw (then restart gateway)</div>

                <div className="flex items-start justify-between gap-3">
                  <div className="text-slate-100">
                    <span className="mr-3 text-[var(--coral-bright)]">$</span>
                    <span>openclaw plugins install @jiggai/recipes</span>
                  </div>
                  <span className="shrink-0">
                    <CopyLineButton text="openclaw plugins install @jiggai/recipes" />
                  </span>
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="text-slate-100">
                    <span className="mr-3 text-[var(--coral-bright)]">$</span>
                    <span>openclaw gateway restart</span>
                  </div>
                  <span className="shrink-0">
                    <CopyLineButton text="openclaw gateway restart" />
                  </span>
                </div>

                <div className="mb-4 mt-6 text-slate-500"># Scaffold a dev team with shared workspace</div>

                <div className="flex items-start justify-between gap-3">
                  <div className="text-slate-100">
                    <span className="mr-3 text-[var(--coral-bright)]">$</span>
                    <span>openclaw recipes scaffold-team development-team -t my-dev-team --apply-config</span>
                  </div>
                  <span className="shrink-0">
                    <CopyLineButton text="openclaw recipes scaffold-team development-team -t my-dev-team --apply-config" />
                  </span>
                </div>

                <div className="mt-6 text-slate-500"># Or scaffold a single agent (e.g., researcher)</div>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <div className="text-slate-100">
                    <span className="mr-3 text-[var(--coral-bright)]">$</span>
                    <span>openclaw recipes scaffold researcher --agent-id my-researcher --apply-config</span>
                  </div>
                  <span className="shrink-0">
                    <CopyLineButton text="openclaw recipes scaffold researcher --agent-id my-researcher --apply-config" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section id="shared-context" className="bg-[color:var(--bg)]/45 px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color:var(--card)] px-8 py-12 lg:px-12">
              <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l-2 border-t-2 border-dashed border-[color:color-mix(in_oklab,var(--coral-bright)_30%,transparent)]" />
              <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r-2 border-t-2 border-dashed border-[color:color-mix(in_oklab,var(--coral-bright)_30%,transparent)]" />
              <div className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b-2 border-l-2 border-dashed border-[color:color-mix(in_oklab,var(--coral-bright)_30%,transparent)]" />
              <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b-2 border-r-2 border-dashed border-[color:color-mix(in_oklab,var(--coral-bright)_30%,transparent)]" />

              <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">The Pantry</p>
                  <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">Shared, file-based context</h2>
                  <p className="mt-6 text-xl leading-8 text-[var(--muted)]">
                    Your team doesn&apos;t forget. Context lives in a shared workspace: Markdown notes, tickets, checklists,
                    and artifacts that stay reviewable, greppable, and versioned.
                  </p>
                </div>

                <div className="grid gap-4">
                  <Card
                    title="Readable in git"
                    body="Workflows and decisions are files, not hidden state. PRs show what changed and why."
                  />
                  <Card
                    title="Deterministic scaffolding"
                    body="Start from a known-good structure every time: lanes, roles, templates, and conventions included."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section id="team-agents" className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">The Line</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">A team of agents</h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Specialists you can message like coworkers. Each role has its own tools, templates, and responsibilities,
              and you can extend them with recipes.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {agents.map((a) => (
                <div
                  key={a.name}
                  className="group rounded-2xl border border-[var(--border)] bg-[color:var(--card)] p-6 shadow-[var(--shadow)] transition hover:-translate-y-1"
                >
                  <div className="grid size-14 place-items-center rounded-2xl bg-white/10 shadow-md">
                    <span className="text-2xl">{a.icon}</span>
                  </div>
                  <div className="mt-4 text-xl font-semibold text-[var(--text)]">{a.name}</div>
                  <div className="mt-2 text-base text-[var(--muted)]">{a.blurb}</div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <ScreenshotGrid title="Agent UI" items={agentsImages} columns="2" />
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section id="teams-showcase" className="bg-[color:var(--bg)]/45 px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Teams</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
              Build custom teams from agents
            </h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Create and edit team structures that match how you actually ship.
            </p>

            <div className="mt-10">
              <WorkflowsShowcase slides={teamSlides} />
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section id="cron-automation" className="bg-[color:var(--bg)]/45 px-6 py-20 lg:px-16">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">The Timer</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">Workflow loops by cron</h2>
              <p className="mt-6 text-xl leading-8 text-[var(--muted)]">
                Recurring check-ins, board hygiene, PR watchers, reminders. Defined in recipes, installed only with
                consent, and easy to inspect as files.
              </p>
            </div>
            <div className="grid gap-5">
              <Card
                title="Opt-in by default"
                body="Cron jobs can be suggested by a recipe, but installation is prompt-gated. No surprises."
              />
              <Card
                title="Repeatable operations"
                body="Run the same loop daily without losing track: triage, verify, ship, report in the same shape."
              />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-6xl">
            <ScreenshotGrid title="Cron jobs" items={cronImages} columns="2" />
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section id="agile-process" className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">The Pass</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">An agile process that sticks</h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Dispatch → backlog → in-progress → testing → done. Simple swim lanes, clean handoffs, and verification
              checklists as files.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {["Backlog", "In progress", "Testing", "Done"].map((lane, idx) => (
                <div key={lane} className="rounded-2xl border border-[var(--border)] bg-[color:var(--card)] p-6 shadow-[var(--shadow)]">
                  <div className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Lane {idx + 1}</div>
                  <div className="mt-3 text-2xl font-bold text-[var(--text)]">{lane}</div>
                  <div className="mt-3 text-base text-[var(--muted)]">
                    {idx === 0 && "What's next, written down."}
                    {idx === 1 && "Focused work, owned."}
                    {idx === 2 && "Proof, verification, QA."}
                    {idx === 3 && "Shipped and documented."}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <ScreenshotGrid title="Tickets" items={ticketsImages} columns="3" />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FEATURE: Workflows */}
      <FadeIn>
        <section id="run-structured" className="bg-[color:var(--bg)]/45 px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Workflows</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
              Run structured work — and see the artifacts
            </h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Queue runs, run now, inspect outputs, and keep everything file-first.
            </p>

            <div className="mt-10">
              <WorkflowsShowcase slides={workflowSlides} />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FEATURE: Goals */}
      <FadeIn>
        <section className="bg-[color:var(--bg)]/45 px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Goals</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
              Track goals alongside execution
            </h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Keep long-lived goals visible while the team works tickets and workflows.
            </p>
            <div className="mt-12">
              <ScreenshotGrid items={goalsImages} columns="2" />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FEATURE: Marketplace */}
      <FadeIn>
        <section id="marketplace-section" className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Marketplace</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
              Install proven templates instead of reinventing everything
            </h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Browse team recipes and agent recipes — then scaffold into your own OpenClaw workspace.
            </p>
            <div className="mt-12">
              <ScreenshotGrid items={recipesImages} columns="2" />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FEATURE: ClawKitchen */}
      <FadeIn>
        <section className="bg-[color:var(--bg)]/45 px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">ClawKitchen</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
              A UI that makes agent teams usable
            </h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Screenshots you can click through — same modal behavior as the Kitchen plugin page.
            </p>
            <div className="mt-12">
              <ScreenshotGrid items={kitchenImages} columns="4" />
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section id="live-visibility" className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl border border-[color:color-mix(in_oklab,var(--coral-bright)_55%,transparent)] bg-[linear-gradient(135deg,rgba(255,77,77,0.22),rgba(255,77,77,0.05))] p-8 shadow-[var(--shadow)] lg:p-12">
              <p className="text-xs uppercase tracking-[0.2em] text-[#ffc1c1]">Live Visibility</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-6xl">
                Create your team in &lt;30 seconds
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                Install both plugins and launch a team-ready workspace immediately.
              </p>

              <div className="codeblock mt-8 overflow-hidden rounded-2xl bg-[#0a1019] shadow-2xl">
                <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-3 rounded-full bg-red-500" />
                    <span className="inline-block size-3 rounded-full bg-yellow-500" />
                    <span className="inline-block size-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-4 text-sm text-slate-400">Install Commands</span>
                </div>

                <div className="space-y-4 px-6 py-6 font-mono text-sm">
                  <div className="flex items-start justify-between gap-3 text-slate-100">
                    <div>
                      <span className="mr-2 text-[var(--coral-bright)]">$</span>
                      openclaw plugins install @jiggai/recipes
                    </div>
                    <CopyLineButton text="openclaw plugins install @jiggai/recipes" />
                  </div>

                  <div className="flex items-start justify-between gap-3 text-slate-100">
                    <div>
                      <span className="mr-2 text-[var(--coral-bright)]">$</span>
                      openclaw plugins install @jiggai/kitchen
                    </div>
                    <CopyLineButton text="openclaw plugins install @jiggai/kitchen" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/marketplace"
                  className="rounded-lg bg-[color:var(--coral-bright)] px-6 py-3 text-sm font-semibold text-[#0b1220] transition hover:brightness-95"
                >
                  Start from Marketplace
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="px-6 pb-20 lg:px-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Newsletter</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">Get product updates</h3>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Monthly updates on new recipes, workflows, and agent operations best practices.
              </p>
            </div>

            <NewsletterSubscribeForm />
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
