import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/FadeIn";
import { CopyLineButton } from "@/components/CopyLineButton";

const agents = [
  { name: "Lead", icon: "🧑‍🍳", blurb: "Owns the plan and keeps the kitchen moving." },
  { name: "Dev", icon: "🧑‍🔧", blurb: "Builds features and keeps quality high." },
  { name: "DevOps", icon: "🧯", blurb: "Keeps deployments, infra, and safety tight." },
  { name: "QA", icon: "🔍", blurb: "Verifies recipes and catches regressions." },
];

function Card({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <h3 className="text-base font-semibold tracking-tight text-[var(--text)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* HERO */}
      <FadeIn>
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-white/60 p-10 shadow-[var(--shadow)]">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Clawcipes — OpenClaw Recipes
              </p>

              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[var(--text)]">
                File-first teams.
                <span className="block">
                  A whole kitchen of agents.
                </span>
              </h1>

              <p className="mt-5 text-lg leading-7 text-[var(--muted)]">
                Scaffold repeatable workflows from Markdown recipes: shared context, deterministic structure, cron-powered
                loops, and an agile lane system that stays readable in git.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="rounded-md bg-[color:var(--coral-bright)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                  href="/marketplace"
                >
                  Browse Marketplace
                </Link>
                <a
                  className="rounded-md border border-[var(--border)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[color:var(--coral-bright)]"
                  href="https://github.com/rjdjohnston/clawcipes"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                <span className="rounded-full border border-[var(--border)] bg-white/60 px-3 py-1">Shared context</span>
                <span className="rounded-full border border-[var(--border)] bg-white/60 px-3 py-1">Teams of agents</span>
                <span className="rounded-full border border-[var(--border)] bg-white/60 px-3 py-1">Cron workflows</span>
                <span className="rounded-full border border-[var(--border)] bg-white/60 px-3 py-1">Agile lanes</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-10 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--cyan-bright) 25%, transparent), transparent 55%), radial-gradient(circle at 70% 30%, color-mix(in oklab, var(--coral-bright) 25%, transparent), transparent 55%)",
                  filter: "blur(18px)",
                }}
              />
              <div className="relative rounded-3xl border border-[var(--border)] bg-white/70 p-6 shadow-[var(--shadow)]">
                <Image
                  className="floaty mx-auto rounded-2xl"
                  src="/chef.jpg"
                  alt="Clawcipes chef mascot"
                  width={520}
                  height={520}
                  priority
                />
                <p className="mt-4 text-center text-xs text-[var(--muted)]">
                  Kitchen scenes and illustrations are placeholders — swap in your custom art anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* QUICK START (match openclaw.ai style; no scaffold command) */}
      <FadeIn className="mt-14">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
            <span className="mr-2 text-[color:var(--coral-bright)]">⟩</span>
            Quick Start
          </h2>

          <div className="codeblock mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-white/65">
            <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="code-dot inline-block size-2.5 rounded-full" />
                <span className="code-dot inline-block size-2.5 rounded-full" />
                <span className="code-dot inline-block size-2.5 rounded-full" />
              </div>

              <div className="ml-auto flex items-center gap-1 rounded-full border border-[var(--border)] bg-white/70 p-1 text-xs text-[var(--muted)]">
                <button className="rounded-full bg-white px-3 py-1 font-semibold text-[var(--text)] shadow-sm">
                  npm
                </button>
                <button className="rounded-full px-3 py-1 hover:text-[color:var(--coral-bright)]">pnpm</button>
                <button className="rounded-full px-3 py-1 hover:text-[color:var(--coral-bright)]">yarn</button>
              </div>
            </div>

            <div className="px-5 py-5 font-mono text-sm">
              <div className="mb-3 text-xs text-[var(--muted)]"># Install Clawcipes into OpenClaw (then restart gateway)</div>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 text-[var(--text)]">
                  <span className="mr-3 text-[var(--muted)]">$</span>
                  <span>openclaw plugins install @clawcipes/recipes</span>
                </div>
                <span className="shrink-0">
                  <CopyLineButton text="openclaw plugins install @clawcipes/recipes" />
                </span>
              </div>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0 text-[var(--text)]">
                  <span className="mr-3 text-[var(--muted)]">$</span>
                  <span>openclaw gateway restart</span>
                </div>
                <span className="shrink-0">
                  <CopyLineButton text="openclaw gateway restart" />
                </span>
              </div>

              <div className="mt-4 text-xs text-[var(--muted)]">
                (We’ll add the scaffold command in a later section — this block stays install-only.)
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FEATURE: Shared context */}
      <FadeIn className="mt-14">
        <section className="rounded-3xl border border-[var(--border)] bg-white/55 p-10 shadow-[var(--shadow)]">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">The Pantry</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">
                Shared, file-based context
              </h2>
              <p className="mt-4 text-[var(--muted)]">
                Your team doesn’t “forget.” Context lives in a shared workspace: Markdown notes, tickets, checklists, and
                artifacts that stay reviewable, greppable, and versioned.
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
        </section>
      </FadeIn>

      {/* FEATURE: Agents */}
      <FadeIn className="mt-14">
        <section className="rounded-3xl border border-[var(--border)] bg-white/55 p-10 shadow-[var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">The Line</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">A team of agents</h2>
          <p className="mt-4 max-w-3xl text-[var(--muted)]">
            Specialists you can message like coworkers. Each role has its own tools, templates, and responsibilities — and
            you can extend them with recipes.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {agents.map((a) => (
              <div
                key={a.name}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] transition hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid size-10 place-items-center rounded-xl border border-[var(--border)] bg-white"
                    style={{
                      boxShadow:
                        "0 10px 25px rgba(15,23,42,0.06)",
                    }}
                  >
                    <span className="text-lg">{a.icon}</span>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-[var(--text)]">{a.name}</div>
                    <div className="text-sm text-[var(--muted)]">{a.blurb}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-[var(--muted)]">
            (Placeholder names/icons — tell me the exact agent names you want listed and I’ll update them.)
          </p>
        </section>
      </FadeIn>

      {/* FEATURE: Cron */}
      <FadeIn className="mt-14">
        <section className="rounded-3xl border border-[var(--border)] bg-white/55 p-10 shadow-[var(--shadow)]">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">The Timer</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">Workflow setup by cron</h2>
              <p className="mt-4 text-[var(--muted)]">
                Recurring check-ins, board hygiene, PR watchers, reminders — defined in recipes, installed only with
                consent, and easy to inspect as files.
              </p>
            </div>
            <div className="grid gap-4">
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
        </section>
      </FadeIn>

      {/* FEATURE: Agile */}
      <FadeIn className="mt-14">
        <section className="rounded-3xl border border-[var(--border)] bg-white/55 p-10 shadow-[var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">The Pass</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">An agile process that sticks</h2>
          <p className="mt-4 max-w-3xl text-[var(--muted)]">
            Dispatch → backlog → in-progress → testing → done. Simple swim lanes, clean handoffs, and verification
            checklists — all as files.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {["Backlog", "In progress", "Testing", "Done"].map((lane, idx) => (
              <div
                key={lane}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow)]"
              >
                <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Lane {idx + 1}</div>
                <div className="mt-2 text-base font-semibold text-[var(--text)]">{lane}</div>
                <div className="mt-2 text-sm text-[var(--muted)]">
                  {idx === 0 && "What’s next, written down."}
                  {idx === 1 && "Focused work, owned."}
                  {idx === 2 && "Proof, verification, QA."}
                  {idx === 3 && "Shipped — and documented."}
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* FOOTER */}
      <FadeIn className="mt-16">
        <footer className="rounded-3xl border border-[var(--border)] bg-white/55 p-10 shadow-[var(--shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--muted)]">© {new Date().getFullYear()} Clawcipes</p>
            <div className="flex gap-4 text-sm text-[var(--muted)]">
              <a href="https://docs.openclaw.ai" target="_blank" rel="noreferrer" className="hover:text-[var(--text)]">
                Docs
              </a>
              <a
                href="https://github.com/rjdjohnston/clawcipes"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--text)]"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </FadeIn>
    </main>
  );
}
