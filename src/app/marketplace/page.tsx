import Link from "next/link";

const featured = [
  {
    id: "development-team",
    name: "Development Team",
    blurb: "Lead + dev + devops + test, file-first tickets, optional cron loops.",
  },
  {
    id: "product-team",
    name: "Product Team",
    blurb: "PM/Design/Engineering/QA delivery loop with a shared workspace.",
  },
  {
    id: "research-team",
    name: "Research Team",
    blurb: "Citations-first research pipeline: sources → notes → briefs.",
  },
  {
    id: "customer-support-team",
    name: "Customer Support Team",
    blurb: "Triage → resolve → KB, with verification before sending to outbox.",
  },
];

export default function MarketplacePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-baseline justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Marketplace</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Discover ready-to-run team recipes and specialist agents. MVP: a curated, static list.
          </p>
        </div>
        <Link
          className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
          href="/"
        >
          Back to home
        </Link>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {featured.map((r) => (
          <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">{r.name}</h2>
                <p className="mt-2 text-sm text-white/70">{r.blurb}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                featured
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/90 hover:bg-white/10"
                href={`https://github.com/rjdjohnston/clawcipes/blob/main/recipes/default/${r.id}.md`}
                target="_blank"
                rel="noreferrer"
              >
                View recipe
              </a>
              <a
                className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/90 hover:bg-white/10"
                href="https://docs.openclaw.ai"
                target="_blank"
                rel="noreferrer"
              >
                Docs
              </a>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-base font-medium">Install (example)</h3>
        <p className="mt-2 text-sm text-white/70">
          Marketplace install flows are out of scope for MVP. For now, install the recipes plugin and scaffold a team.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs text-white/80">
          <code>{`openclaw plugins install @clawcipes/recipes
openclaw gateway restart
openclaw recipes scaffold-team development-team --team-id my-team-team --overwrite --apply-config`}</code>
        </pre>
      </section>
    </main>
  );
}
