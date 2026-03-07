import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/FadeIn";
import { CopyLineButton } from "@/components/CopyLineButton";
import { ScreenshotGrid } from "@/components/ScreenshotGrid";

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

const teamsImages = [
  { src: "/images/teams/team-building.png", alt: "Team building" },
  { src: "/images/teams/create-custom-team.png", alt: "Create custom team" },
  { src: "/images/teams/custom-team-2.png", alt: "Custom team details" },
  { src: "/images/teams/marketing-team-editor.png", alt: "Marketing team editor" },
];

const workflowsImages = [
  { src: "/images/workflows/workflow-1.png", alt: "Workflow" },
  { src: "/images/workflows/workflow-2.png", alt: "Workflow" },
  { src: "/images/workflows/workflow-3.png", alt: "Workflow" },
  { src: "/images/workflows/workflow-runs.png", alt: "Workflow runs" },
  { src: "/images/workflows/workflow-runs-detail.png", alt: "Workflow run detail" },
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

const recipesImages = [{ src: "/images/recipes/recipes-1.png", alt: "Recipes" }];

const cronImages = [
  { src: "/images/cron/cron-1.png", alt: "Cron jobs" },
  { src: "/images/cron/cron-2.png", alt: "Cron jobs" },
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
    <div className="rounded-2xl bg-white/60 p-6">
      <h3 className="text-lg font-semibold tracking-tight text-[var(--text)]">{title}</h3>
      <p className="mt-2 text-base leading-7 text-[var(--muted)]">{body}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="w-full">
      {/* HERO - full width */}
      <FadeIn>
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white px-6 py-20 lg:px-16 lg:py-28">
          {/* Decorative corner marks */}
          <div className="pointer-events-none absolute left-8 top-8 h-12 w-12 border-l-2 border-t-2 border-dashed border-slate-200 lg:left-16 lg:top-16 lg:h-20 lg:w-20" />
          <div className="pointer-events-none absolute right-8 top-8 h-12 w-12 border-r-2 border-t-2 border-dashed border-slate-200 lg:right-16 lg:top-16 lg:h-20 lg:w-20" />
          <div className="pointer-events-none absolute bottom-8 left-8 h-12 w-12 border-b-2 border-l-2 border-dashed border-slate-200 lg:bottom-16 lg:left-16 lg:h-20 lg:w-20" />
          <div className="pointer-events-none absolute bottom-8 right-8 h-12 w-12 border-b-2 border-r-2 border-dashed border-slate-200 lg:bottom-16 lg:right-16 lg:h-20 lg:w-20" />

          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
                ClawRecipes — OpenClaw Recipes
              </p>

              <h1 className="mt-6 text-5xl font-bold tracking-tight text-[var(--text)] sm:text-6xl lg:text-7xl">
                Stop hacking agents.
                <span className="block">Start cooking with recipes.</span>
              </h1>

              <p className="mt-6 text-xl leading-8 text-[var(--muted)] lg:text-2xl">
                Markdown blueprints build complete OpenClaw teams: file-first context, recurring cron magic, coworker-style
                specialists, agile flow locked in git. From scaffold to shipped — repeatable, reviewable, every time.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  className="rounded-lg bg-[color:var(--coral-bright)] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:brightness-95"
                  href="/marketplace"
                >
                  Browse Marketplace
                </Link>
                <a
                  className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-[var(--text)] shadow-md transition hover:bg-slate-50"
                  href="https://github.com/rjdjohnston/clawcipes"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">Shared context</span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">Teams of agents</span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">Cron workflows</span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">Agile lanes</span>
              </div>
            </div>

            {/* Chef image with dashed border */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              <div className="absolute -inset-4 rounded-3xl border-2 border-dashed border-slate-200" />
              
              <div className="relative rounded-2xl bg-white/90 p-6 shadow-xl">
                <Image
                  className="floaty mx-auto rounded-2xl"
                  src="/chef.jpg"
                  alt="ClawRecipes chef mascot"
                  width={520}
                  height={520}
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Tagline bar */}
      <div className="border-y border-slate-100 bg-white py-6 text-center">
        <p className="text-lg text-[var(--muted)]">
          Best-in-class Workflow Automation for teams of all sizes.
        </p>
      </div>

      {/* QUICK START */}
      <FadeIn>
        <section className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
              <span className="mr-2 text-[color:var(--coral-bright)]">⟩</span>
              Quick Start
            </h2>

            <div className="codeblock mt-10 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-slate-700 px-5 py-4">
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
                    <span className="mr-3 text-emerald-400">$</span>
                    <span>openclaw plugins install @jiggai/recipes</span>
                  </div>
                  <span className="shrink-0">
                    <CopyLineButton text="openclaw plugins install @jiggai/recipes" />
                  </span>
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="text-slate-100">
                    <span className="mr-3 text-emerald-400">$</span>
                    <span>openclaw gateway restart</span>
                  </div>
                  <span className="shrink-0">
                    <CopyLineButton text="openclaw gateway restart" />
                  </span>
                </div>

                <div className="mt-6 mb-4 text-slate-500"># Scaffold a dev team with shared workspace</div>


                <div className="flex items-start justify-between gap-3">
                  <div className="text-slate-100">
                    <span className="mr-3 text-emerald-400">$</span>
                    <span>openclaw recipes scaffold-team development-team -t my-dev-team --apply-config</span>
                  </div>
                  <span className="shrink-0">
                    <CopyLineButton text="openclaw recipes scaffold-team development-team -t my-dev-team --apply-config" />
                  </span>
                </div>

                <div className="mt-6 text-slate-500"># Or scaffold a single agent (e.g., researcher)</div>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <div className="text-slate-100">
                    <span className="mr-3 text-emerald-400">$</span>
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

      {/* FEATURE: Shared context */}
      <FadeIn>
        <section className="bg-slate-50 px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-3xl bg-white/70 px-8 py-12 lg:px-12">
              <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l-2 border-t-2 border-dashed border-slate-200" />
              <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r-2 border-t-2 border-dashed border-slate-200" />
              <div className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b-2 border-l-2 border-dashed border-slate-200" />
              <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b-2 border-r-2 border-dashed border-slate-200" />

              <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">The Pantry</p>
                  <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
                    Shared, file-based context
                  </h2>
                  <p className="mt-6 text-xl leading-8 text-[var(--muted)]">
                    Your team doesn&apos;t &quot;forget.&quot; Context lives in a shared workspace: Markdown notes, tickets, checklists,
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
                    body="Start from a known-good structure every time — lanes, roles, templates, and conventions included."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FEATURE: Agents */}
      <FadeIn>
        <section className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">The Line</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">A team of agents</h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Specialists you can message like coworkers. Each role has its own tools, templates, and responsibilities — and
              you can extend them with recipes.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {agents.map((a) => (
                <div
                  key={a.name}
                  className="group rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-md"
                  >
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

      {/* FEATURE: Cron */}
      <FadeIn>
        <section className="bg-slate-50 px-6 py-20 lg:px-16">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">The Timer</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">Workflow loops by cron</h2>
              <p className="mt-6 text-xl leading-8 text-[var(--muted)]">
                Recurring check-ins, board hygiene, PR watchers, reminders — defined in recipes, installed only with
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
                body="Run the same loop daily without losing track: triage, verify, ship, report — always in the same shape."
              />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-6xl">
            <ScreenshotGrid title="Cron jobs" items={cronImages} columns="2" />
          </div>
        </section>
      </FadeIn>

      {/* FEATURE: Agile */}
      <FadeIn>
        <section className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">The Pass</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">An agile process that sticks</h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Dispatch → backlog → in-progress → testing → done. Simple swim lanes, clean handoffs, and verification
              checklists — all as files.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {["Backlog", "In progress", "Testing", "Done"].map((lane, idx) => (
                <div
                  key={lane}
                  className="rounded-2xl bg-white p-6 shadow-lg"
                >
                  <div className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Lane {idx + 1}</div>
                  <div className="mt-3 text-2xl font-bold text-[var(--text)]">{lane}</div>
                  <div className="mt-3 text-base text-[var(--muted)]">
                    {idx === 0 && "What's next, written down."}
                    {idx === 1 && "Focused work, owned."}
                    {idx === 2 && "Proof, verification, QA."}
                    {idx === 3 && "Shipped — and documented."}
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
        <section className="bg-slate-50 px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Workflows</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
              Run structured work — and see the artifacts
            </h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Queue runs, run now, inspect outputs, and keep everything file-first.
            </p>
            <div className="mt-12">
              <ScreenshotGrid items={workflowsImages} columns="3" />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FEATURE: Teams */}
      <FadeIn>
        <section className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Teams</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
              Build custom teams from agents
            </h2>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
              Create and edit team structures that match how you actually ship.
            </p>
            <div className="mt-12">
              <ScreenshotGrid items={teamsImages} columns="2" />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FEATURE: Goals */}
      <FadeIn>
        <section className="bg-slate-50 px-6 py-20 lg:px-16">
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
        <section className="px-6 py-20 lg:px-16">
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
        <section className="bg-slate-50 px-6 py-20 lg:px-16">
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

    </main>
  );
}
