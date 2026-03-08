import Image from "next/image";
import Link from "next/link";

import { ScreenshotGrid } from "@/components/ScreenshotGrid";
import { CopyLineButton } from "@/components/CopyLineButton";

export const metadata = {
  title: "Kitchen Plugin – ClawRecipes",
};

const kitchenScreens = Array.from({ length: 8 }).map((_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/images/plugins/kitchen/kitchen-${n}.jpg`,
    alt: `Kitchen plugin screenshot ${n}`,
  };
});

const teamScreens = [
  { src: "/images/teams/team-building.png", alt: "Team builder" },
  { src: "/images/teams/create-custom-team.png", alt: "Create custom team" },
  { src: "/images/teams/custom-team-2.png", alt: "Custom team details" },
  { src: "/images/teams/marketing-team-editor.png", alt: "Marketing team editor" },
];

const highlights = [
  { icon: "🧱", title: "Team Builder", body: "Create and edit teams and agent roles without living in CLI commands." },
  { icon: "📁", title: "Shared Files", body: "Manage workspace context files and artifacts in one operational UI." },
  { icon: "▶️", title: "Run Workflows", body: "Kick off runs, inspect logs, and track artifacts from a single dashboard." },
  { icon: "🛠️", title: "Plugin Operations", body: "Install tools and skills across team setup from one surface." },
];

export default function KitchenPluginPage() {
  return (
    <main className="px-6 py-16 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-12">
          <div className="pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full bg-[color:color-mix(in_oklab,var(--coral-bright)_24%,transparent)] blur-3xl" />

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Plugin</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-6xl">ClawKitchen</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                Day-to-day control center for your agent organization: teams, files, workflows, and operational visibility.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/plugins/recipes" className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10">
                  Explore ClawRecipes
                </Link>
                <a href="https://github.com/JIGGAI/ClawKitchen" target="_blank" rel="noreferrer" className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
                  GitHub
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0d1521]">
              <Image
                src="/images/plugins/kitchen/kitchen-01.jpg"
                alt="ClawKitchen UI"
                width={1200}
                height={760}
                className="h-full w-full object-cover"
              />
            </div>
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
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-2xl border border-[var(--border)] bg-[#0a1019] shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="inline-block size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="inline-block size-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="text-xs font-semibold tracking-[0.16em] text-slate-400">STEP 1</div>
                <div className="text-xs text-slate-400">Terminal</div>
              </div>
              <div className="space-y-4 px-4 py-4 font-mono text-sm">
                <div className="flex items-start gap-3 text-slate-100">
                  <div className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
                    <span className="mr-2 text-[var(--coral-bright)]">$</span>
                    openclaw plugins install @jiggai/kitchen
                  </div>
                  <CopyLineButton text="openclaw plugins install @jiggai/kitchen" className="shrink-0" />
                </div>
                <div className="flex items-start gap-3 text-slate-100">
                  <div className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
                    <span className="mr-2 text-[var(--coral-bright)]">$</span>
                    openclaw gateway restart
                  </div>
                  <CopyLineButton text="openclaw gateway restart" className="shrink-0" />
                </div>
              </div>
            </article>

            <div className="grid gap-4">
              <article className="rounded-2xl border border-[var(--border)] bg-white/5 p-4">
                <div className="text-xs font-semibold tracking-[0.16em] text-[color:var(--coral-bright)]">STEP 2</div>
                <div className="mt-2 text-sm font-semibold text-[var(--text)]">Modify `openclaw.json`</div>
                <pre className="mt-3 max-w-full overflow-x-auto rounded-xl bg-[#0a1019] px-3 py-3 text-xs text-slate-100">
                  <code>{`"kitchen": {"enable":true}`}</code>
                </pre>
              </article>

              <article className="rounded-2xl border border-[var(--border)] bg-white/5 p-4">
                <div className="text-xs font-semibold tracking-[0.16em] text-[color:var(--coral-bright)]">STEP 3</div>
                <div className="mt-2 text-sm font-semibold text-[var(--text)]">Update kitchen config</div>
                <pre className="mt-3 max-w-full overflow-x-auto rounded-xl bg-[#0a1019] px-3 py-3 text-xs text-slate-100">
                  <code>{`"kitchen": {
  "enabled": true,
  "config": {
    "dev": false,
    "host": "<ipAddress>",
    "port": 7777,
    "authToken": "<your_password>",
    "qaToken": "<randomHash_if_using_qa>"
  }
},`}</code>
                </pre>
              </article>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Screenshots</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">What teams see every day</h2>
          <div className="mt-6">
            <ScreenshotGrid items={kitchenScreens} columns="4" />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Team Management</p>
          <div className="mt-6">
            <ScreenshotGrid items={teamScreens} columns="2" />
          </div>
        </section>
      </div>
    </main>
  );
}
