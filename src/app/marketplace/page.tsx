import Link from "next/link";

import { FadeIn } from "@/components/FadeIn";

const recipes = [
  {
    id: "social-team",
    name: "Social Team",
    description: "Plan, draft, schedule, and review social content with a clean lane workflow.",
    tags: ["content", "approval", "templates"],
  },
  {
    id: "customer-support-team",
    name: "Customer Support Team",
    description: "Triage → resolve → verify using canonical lanes. File-first notes and playbooks.",
    tags: ["support", "triage", "verification"],
  },
  {
    id: "development-team",
    name: "Development Team",
    description: "Backlog → in-progress → testing → done with dispatcher + execution loops.",
    tags: ["engineering", "qa", "workflow"],
  },
];

export default function MarketplacePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <FadeIn>
        <section className="rounded-3xl border border-[var(--border)] bg-white/60 p-10 shadow-[var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Marketplace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text)]">
            Featured recipes
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            Browse a few starter teams. Each recipe scaffolds a shared workspace + role agents, and can optionally suggest
            cron workflows.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-md border border-[var(--border)] bg-white/60 px-4 py-2 text-sm font-medium text-[var(--text)] shadow-sm hover:bg-white"
            >
              Back to home
            </Link>
            <a
              href="https://github.com/rjdjohnston/clawcipes"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[var(--text)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
            >
              Install from GitHub
            </a>
          </div>
        </section>
      </FadeIn>

      <FadeIn className="mt-12">
        <section className="grid gap-4 md:grid-cols-3">
          {recipes.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <h2 className="text-lg font-semibold text-[var(--text)]">{r.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{r.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--border)] bg-white/60 px-3 py-1 text-xs text-[var(--muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                <a
                  className="rounded-md border border-[var(--border)] bg-white/60 px-3 py-2 text-xs font-medium text-[var(--text)] shadow-sm hover:bg-white"
                  href="#"
                >
                  View recipe
                </a>
                <a
                  className="rounded-md border border-[var(--border)] bg-white/60 px-3 py-2 text-xs font-medium text-[var(--text)] shadow-sm hover:bg-white"
                  href="#"
                >
                  Scaffold team
                </a>
              </div>
            </div>
          ))}
        </section>
      </FadeIn>

      <FadeIn className="mt-12">
        <section className="rounded-3xl border border-[var(--border)] bg-white/55 p-8 shadow-[var(--shadow)]">
          <h2 className="text-lg font-semibold text-[var(--text)]">Install + scaffold (example)</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            These are placeholders for now — we’ll wire real recipe pages and install commands next.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-white/70 p-4 text-xs text-[var(--text)]">
            <code>{`openclaw plugins install @clawcipes/recipes
openclaw gateway restart
openclaw recipes scaffold-team social-team -t my-social-team-team --overwrite`}</code>
          </pre>
        </section>
      </FadeIn>
    </main>
  );
}
