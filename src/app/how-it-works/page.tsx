import Link from "next/link";

import { FadeIn } from "@/components/FadeIn";
import { CopyLineButton } from "@/components/CopyLineButton";

const recipePillars = [
  {
    title: "Roles + conventions",
    body: "Lead/dev/test/marketing (and more) so every agent has a clear job and lane.",
  },
  {
    title: "Shared context",
    body: "Team memory and files everyone can read out of the box.",
  },
  {
    title: "File-first by design",
    body: "Work stays in your workspace: AGENTS.md, SOUL.md, tickets, outputs, and artifacts.",
  },
  {
    title: "Structured workflows",
    body: "Intake → assign → execute → verify so teams can run without constant babysitting.",
  },
  {
    title: "Swarm-ready",
    body: "Add orchestrator/swarm patterns when you want multiple agents pushing one outcome in parallel.",
  },
];

const kitchenBenefits = [
  "Create and edit teams + agents without living in the terminal.",
  "Manage team files + shared context in one place.",
  "Run workflows, inspect what happened, and track artifacts.",
  "Install skills and tools across the whole team.",
];

const flowSteps = [
  {
    id: "01",
    title: "Install plugins",
    body: "Add ClawRecipes and ClawKitchen to OpenClaw so your system has both team scaffolding and a practical UI.",
  },
  {
    id: "02",
    title: "Choose a base recipe",
    body: "Start from a proven structure with agent roles, lane conventions, and operating defaults.",
  },
  {
    id: "03",
    title: "Customize your team",
    body: "Edit team members, instructions, files, and workflows to match your real org and delivery process.",
  },
  {
    id: "04",
    title: "Execute with structure",
    body: "Run intake, assignment, execution, and verification loops with visible artifacts and file-based memory.",
  },
  {
    id: "05",
    title: "Scale with marketplace + swarm",
    body: "Install templates from the public marketplace and add parallel swarm/orchestrator patterns when needed.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="px-6 py-16 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <section className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-12">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">How It Works</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-6xl">
              Build custom agent teams that actually ship
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-[var(--muted)]">
              Most agent setups stop at: spawn a bot, write prompts, hope it remembers what you meant. That&apos;s not a
              team. That&apos;s chaos. ClawRecipes gives your OpenClaw setup real structure, and ClawKitchen makes it usable
              day-to-day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/marketplace"
                className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-[#0b1220] transition hover:brightness-95"
              >
                Browse Marketplace
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10"
              >
                Back To Home
              </Link>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">ClawRecipes</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">
              Structure your agent org with repeatable conventions
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {recipePillars.map((pillar) => (
                <article key={pillar.title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
                  <h3 className="text-lg font-semibold text-[var(--text)]">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{pillar.body}</p>
                </article>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">ClawKitchen</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">
              Day-to-day UI built for teams
            </h2>
            <div className="mt-6 grid gap-3">
              {kitchenBenefits.map((benefit) => (
                <div key={benefit} className="rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--muted)]">
                  {benefit}
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Flow</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">
              The operating loop
            </h2>
            <div className="mt-6 grid gap-4">
              {flowSteps.map((step) => (
                <article key={step.id} className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
                  <div className="text-xs font-bold tracking-[0.18em] text-[color:var(--coral-bright)]">STEP {step.id}</div>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{step.body}</p>
                </article>
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Marketplace</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">
              Install proven templates instead of reinventing setup
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--muted)]">
              There&apos;s a public marketplace angle too: install team templates + workflows that already work, then tailor
              them for your org.
            </p>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Get Started</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">
              Install ClawRecipes + ClawKitchen
            </h2>

            <div className="codeblock mt-6 overflow-hidden rounded-2xl bg-[#0a1019] shadow-2xl">
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-3 rounded-full bg-red-500" />
                  <span className="inline-block size-3 rounded-full bg-yellow-500" />
                  <span className="inline-block size-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-4 text-sm text-slate-400">Terminal</span>
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

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href="https://github.com/JIGGAI/ClawKitchen"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10"
              >
                GitHub: ClawKitchen
              </a>
              <a
                href="https://github.com/JIGGAI/ClawRecipes"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10"
              >
                GitHub: ClawRecipes
              </a>
            </div>

            <p className="mt-6 text-sm text-[var(--muted)]">
              Built and maintained by{" "}
              <a className="text-[color:var(--coral-bright)] underline" href="https://github.com/rjdjohnston" target="_blank" rel="noreferrer">
                @rjdjohnston
              </a>
              .
            </p>
          </section>
        </FadeIn>
      </div>
    </main>
  );
}
