import Image from "next/image";
import Link from "next/link";

import { ScreenshotGrid } from "@/components/ScreenshotGrid";
import { CopyLineButton } from "@/components/CopyLineButton";
import { ManagedServiceInterestForm } from "@/components/ManagedServiceInterestForm";

export const metadata = {
  title: "Kitchen Plugin – ClawRecipes",
};

const featureSections = [
  {
    eyebrow: "Feature 1",
    title: "A real operator console for agent teams",
    body:
      "ClawKitchen turns an OpenClaw deployment into something operators can actually run. Instead of living across config files, terminal commands, and fragile tribal knowledge, teams get a single place to inspect roles, workflows, runs, artifacts, and the state of the system. It is the missing daily-use layer between raw capability and real operations.",
    bullets: [
      "See the shape of the system without hunting through files",
      "Operate teams, workflows, and outputs from one place",
      "Give non-terminal-native operators a usable control surface",
    ],
    images: [
      { src: "/images/plugins/kitchen/kitchen-01.jpg", alt: "ClawKitchen UI" },
      { src: "/images/plugins/kitchen/kitchen-02.jpg", alt: "Kitchen plugin screenshot 02" },
      { src: "/images/plugins/kitchen/kitchen-03.jpg", alt: "Kitchen plugin screenshot 03" },
      { src: "/images/plugins/kitchen/kitchen-04.jpg", alt: "Kitchen plugin screenshot 04" },
    ],
  },
  {
    eyebrow: "Feature 2",
    title: "Workflow visibility that makes automation trustworthy",
    body:
      "Agent systems get much easier to trust when you can see the work moving. ClawKitchen surfaces runs, approvals, outputs, and state transitions so workflows feel inspectable instead of magical. That matters when you want teams to use automation in the middle of real delivery, not just as a toy demo.",
    bullets: [
      "Inspect workflow state and output artifacts",
      "Review approvals and intermediate steps clearly",
      "Make execution visible to the humans who own the outcome",
    ],
    images: [
      { src: "/images/workflows/workflow-1.png", alt: "Workflow board" },
      { src: "/images/workflows/workflow-runs-detail.png", alt: "Workflow run detail" },
      { src: "/images/tickets/edit-tickets.png", alt: "Edit ticket" },
      { src: "/images/cron/cron-2.png", alt: "Cron jobs" },
    ],
  },
  {
    eyebrow: "Feature 3",
    title: "Marketing plugin for real content operations",
    body:
      "One of the strongest examples of the plugin model is marketing operations. Instead of treating content work as scattered documents and manual social posting, the marketing plugin brings calendars, media, previews, approvals, and publishing into the same operational stack. It turns campaign work into a visible workflow with real leverage.",
    bullets: [
      "Content calendar and post previews for planning",
      "Media uploads, library management, and reusable assets",
      "Preview, approval, and Postiz-backed publishing flow in one system",
    ],
    images: [
      { src: "/images/plugins/kitchen/kitchen-05.jpg", alt: "Marketing plugin concept, content planning" },
      { src: "/images/plugins/kitchen/kitchen-06.jpg", alt: "Marketing plugin concept, operations" },
      { src: "/images/plugins/kitchen/kitchen-08.jpg", alt: "Marketing plugin concept, plugin UI detail" },
      { src: "/images/workflows/workflow-runs.png", alt: "Marketing workflow runs overview" },
    ],
  },
  {
    eyebrow: "Feature 4",
    title: "Best when paired with ClawRecipes",
    body:
      "ClawRecipes installs the operating model. ClawKitchen makes it usable day to day. Together they give teams both the repeatable structure and the operator experience they need. Recipes define how the system should work. Kitchen makes that system visible, navigable, and manageable once it is live.",
    bullets: [
      "Recipes provide scaffolding and operational shape",
      "Kitchen provides visibility, editing, and day-to-day control",
      "Together they move OpenClaw from setup to adoption",
    ],
    images: [
      { src: "/images/teams/team-building.png", alt: "Team builder" },
      { src: "/images/teams/create-custom-team.png", alt: "Create custom team" },
      { src: "/images/teams/custom-team-2.png", alt: "Custom team details" },
      { src: "/images/teams/marketing-team-editor.png", alt: "Marketing team editor" },
    ],
  },
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
              <p className="mt-5 max-w-4xl text-lg leading-8 text-[var(--muted)]">
                The operator layer for OpenClaw. Manage teams, workflows, plugins, files, approvals, and execution visibility from a UI built for daily use, not just initial setup.
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
          {[
            ["Team Builder", "Create and edit teams and agent roles without living in CLI commands or scattered config files."],
            ["Managed Memory + Files", "Operate workspace context, artifacts, and durable team knowledge from one place."],
            ["Trigger Workflows", "Kick off manual, cron, and event-driven runs across multiple node types from one dashboard."],
            ["Plugin Operations", "Install plugins and shape team setup from a UI that operators can actually use daily."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-[var(--border)] bg-[color:var(--card)] p-5 shadow-[var(--shadow)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Quick Install</p>
          <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0a1019] shadow-[var(--shadow)]">
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="inline-block size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="inline-block size-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="ml-auto text-xs font-semibold tracking-[0.16em] text-slate-400">STEP 1</div>
              </div>
              <div className="space-y-4 px-4 py-4 font-mono text-sm">
                <div className="flex min-w-0 flex-wrap items-start gap-3 text-slate-100">
                  <div className="w-0 min-w-0 flex-1 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
                    <span className="mr-2 text-[var(--coral-bright)]">$</span>
                    openclaw plugins install @jiggai/kitchen
                  </div>
                  <CopyLineButton text="openclaw plugins install @jiggai/kitchen" className="shrink-0" />
                </div>
                <div className="flex min-w-0 flex-wrap items-start gap-3 text-slate-100">
                  <div className="w-0 min-w-0 flex-1 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
                    <span className="mr-2 text-[var(--coral-bright)]">$</span>
                    openclaw gateway restart
                  </div>
                  <CopyLineButton text="openclaw gateway restart" className="shrink-0" />
                </div>
              </div>
            </article>

            <div className="grid min-w-0 gap-4">
              <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white/5 p-4">
                <div className="text-xs font-semibold tracking-[0.16em] text-[color:var(--coral-bright)]">STEP 2</div>
                <div className="mt-2 text-sm font-semibold text-[var(--text)]">Modify `openclaw.json`</div>
                <pre className="mt-3 block w-full max-w-full overflow-x-auto rounded-xl bg-[#0a1019] px-3 py-3 text-xs text-slate-100"><code>{`"kitchen": {"enable":true}`}</code></pre>
              </article>

              <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white/5 p-4">
                <div className="text-xs font-semibold tracking-[0.16em] text-[color:var(--coral-bright)]">STEP 3</div>
                <div className="mt-2 text-sm font-semibold text-[var(--text)]">Update kitchen config</div>
                <pre className="mt-3 block w-full max-w-full overflow-x-auto rounded-xl bg-[#0a1019] px-3 py-3 text-xs text-slate-100"><code>{`"kitchen": {
  "enabled": true,
  "config": {
    "dev": false,
    "host": "<ipAddress>",
    "port": 7777,
    "authToken": "<your_password>",
    "qaToken": "<randomHash_if_using_qa>"
  }
},`}</code></pre>
              </article>
            </div>
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

        <section className="mt-10 rounded-3xl border border-[color:color-mix(in_oklab,var(--coral-bright)_55%,transparent)] bg-[linear-gradient(135deg,rgba(255,77,77,0.14),rgba(255,77,77,0.04))] p-8 shadow-[var(--shadow)] lg:p-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#ffc1c1]">Coming soon</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">Managed AI teams</h3>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Want a hands-on team to set up ClawKitchen, plugins, workflows, approvals, and team operations for you? Join the early list.
            </p>
          </div>
          <ManagedServiceInterestForm title="Request info and tell us what kind of managed team, workflow, or plugin help you want." source="kitchen-page-managed-ai-team" />
        </section>
      </div>
    </main>
  );
}
