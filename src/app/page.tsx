import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-10">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-white/60">OpenClaw Recipes Plugin</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Clawcipes: scaffold teams, ship work, keep it file-first.
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Clawcipes turns Markdown recipes into repeatable teams and specialist agents. You get a shared workspace,
            deterministic scaffolding, and a ticket workflow that plays nicely with git.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
              href="/marketplace"
            >
              Browse Marketplace
            </Link>
            <a
              className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
              href="https://github.com/rjdjohnston/clawcipes"
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Scaffold teams fast",
            body: "Spin up a shared workspace + role agents from a recipe. Consistent lanes: backlog → in-progress → testing → done.",
          },
          {
            title: "Safe automation",
            body: "Recipes can define optional cron loops (prompt by default). Install them when you're ready — not silently.",
          },
          {
            title: "Docs that don’t rot",
            body: "Templates bake workflow language into TEAM.md/TICKETS.md, plus QA verification conventions (QA_CHECKLIST.md).",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-medium">{f.title}</h2>
            <p className="mt-2 text-sm text-white/70">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-8">
        <h2 className="text-xl font-medium">How it works</h2>
        <ol className="mt-4 grid gap-3 text-sm text-white/70 md:grid-cols-3">
          <li>
            <span className="text-white">1) Install</span>
            <div className="mt-1">Install the recipes plugin into OpenClaw.</div>
          </li>
          <li>
            <span className="text-white">2) Scaffold</span>
            <div className="mt-1">Generate a team workspace from a recipe.</div>
          </li>
          <li>
            <span className="text-white">3) Run the workflow</span>
            <div className="mt-1">Dispatch → backlog → in-progress → testing → done.</div>
          </li>
        </ol>

        <pre className="mt-6 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs text-white/80">
          <code>{`openclaw plugins install @clawcipes/recipes
openclaw gateway restart
openclaw recipes scaffold-team development-team --team-id my-team-team --overwrite --apply-config`}</code>
        </pre>
      </section>

      <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-white/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Clawcipes</p>
          <div className="flex gap-4">
            <a href="https://docs.openclaw.ai" target="_blank" rel="noreferrer" className="hover:text-white">
              Docs
            </a>
            <a href="https://github.com/rjdjohnston/clawcipes" target="_blank" rel="noreferrer" className="hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
