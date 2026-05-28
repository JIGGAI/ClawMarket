import Image from "next/image";
import Link from "next/link";

import { ScreenshotGrid } from "@/components/ScreenshotGrid";
import { CopyLineButton } from "@/components/CopyLineButton";
import { NewsletterSubscribeForm } from "@/components/NewsletterSubscribeForm";

export const metadata = {
  title: "ClawKitchen – Open Source Agent Operations Console",
  description:
    "ClawKitchen is the local-first, open-source operations console for OpenClaw and ClawRecipes: scaffold teams from recipes, manage file-backed memory, build visual workflows, inspect runs, and onboard client automation systems.",
};

const kitchenScreens = Array.from({ length: 8 }).map((_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/images/plugins/kitchen/kitchen-${n}.jpg`,
    alt: `ClawKitchen screenshot ${n}`,
  };
});

const teamScreens = [
  { src: "/images/teams/team-building.png", alt: "Team builder" },
  { src: "/images/teams/create-custom-team.png", alt: "Create custom team" },
  { src: "/images/teams/custom-team-2.png", alt: "Custom team details" },
  { src: "/images/teams/marketing-team-editor.png", alt: "Marketing team editor" },
];

const workflowScreens = [
  { src: "/images/workflows/workflow-1.png", alt: "Workflow board" },
  { src: "/images/workflows/workflow-runs.png", alt: "Workflow run queue" },
  { src: "/images/workflows/workflow-runs-detail.png", alt: "Workflow run detail" },
  { src: "/images/workflows/workflow-3.png", alt: "Workflow execution view" },
];

const operatingSystemFeatures = [
  {
    icon: "🧑‍🍳",
    title: "Agent team builder",
    body:
      "Create OpenClaw teams with leads, specialists, QA, devops, researchers, marketers, support agents, writers, analysts, and custom roles. Each role gets its own workspace, instructions, tools, memory, and operating lane.",
    example: "Example: launch a marketing team with strategist, copywriter, designer, publisher, and QA roles for a client content pipeline.",
  },
  {
    icon: "🧠",
    title: "Managed shared context",
    body:
      "Keep project knowledge in readable files instead of invisible chat history. Teams can share memory, tickets, docs, brand rules, procedures, and outputs that survive restarts.",
    example: "Example: store brand voice, offer details, social calendar rules, and campaign lessons where every workflow run can use them.",
  },
  {
    icon: "🕸️",
    title: "Visual workflow orchestration",
    body:
      "Design repeatable flows with visual nodes: start/end, LLM, tool, media-image/video/audio, human approval, writeback, and handoff. ClawKitchen edits file-first workflow definitions while ClawRecipes executes the runtime semantics.",
    example: "Example: intake a blog topic → research → outline → draft → generate image → QA → publish handoff.",
  },
  {
    icon: "🎟️",
    title: "Ticket-driven delivery",
    body:
      "Turn client work into visible queues: backlog, in progress, testing, done. Agents can pick up tasks, attach artifacts, and keep the delivery process auditable.",
    example: "Example: a dev team receives a feature request, breaks it into tickets, implements it, tests it, and waits for approval before closing.",
  },
  {
    icon: "🧩",
    title: "Installable skills and recipes",
    body:
      "Use builtin and custom ClawRecipes to package repeatable team setups, tools, procedures, prompts, workflows, and cron jobs. Start from shipped defaults, then evolve client-specific recipes when the pattern becomes yours.",
    example: "Example: install a sales-research recipe, then adapt its prompts, sources, CRM fields, and handoff format for a specific agency.",
  },
  {
    icon: "⏰",
    title: "Cron and recurring operations",
    body:
      "Run recurring checks, content loops, reporting jobs, lead monitors, and maintenance tasks on schedule. Agents can work while humans sleep, then surface what matters.",
    example: "Example: every weekday morning, collect leads, draft outreach notes, summarize priority replies, and queue human review.",
  },
  {
    icon: "📣",
    title: "Channels and approvals",
    body:
      "Manage messaging bindings that power notifications, approval flows, reminders, and human-in-the-loop decisions. Approval nodes can pause work until a human signs off or requests revision.",
    example: "Example: send a Telegram approval request for a campaign draft, then resume the workflow only after the reviewer approves it.",
  },
  {
    icon: "🎯",
    title: "Goals and durable intent",
    body:
      "Track higher-level goals that outlive a single ticket. Goals help teams keep long-running outcomes visible while individual tasks move through the board.",
    example: "Example: keep a Q2 content growth goal visible while agents execute weekly research, drafting, publishing, and reporting tickets.",
  },
  {
    icon: "📦",
    title: "Artifacts, logs, and run history",
    body:
      "Inspect what happened in a workflow run: run status, approval state, node outputs, logs, generated deliverables, and handoff points. Runs answer the operator question: what happened?",
    example: "Example: show a client exactly how a campaign post was researched, drafted, reviewed, and scheduled.",
  },
  {
    icon: "🔐",
    title: "Self-hosted control surface",
    body:
      "Operate against your own OpenClaw machine and workspaces. Keep sensitive client context, credentials, channel bindings, recipes, workflows, and memory under your infrastructure and review process.",
    example: "Example: operate separate teams for multiple clients without mixing their files, tokens, or memory.",
  },
];

const clientUseCases = [
  {
    title: "Marketing operations",
    body:
      "Plan content calendars, draft posts, generate media, review brand fit, and publish through approved channels with human checkpoints where they matter.",
    bullets: ["Content calendar workflows", "Image/media generation", "Postiz publishing handoff", "Campaign memory and reuse"],
  },
  {
    title: "Software delivery teams",
    body:
      "Give AI teammates a structured engineering process: ticket intake, implementation, tests, CI review, PR summaries, and QA signoff.",
    bullets: ["Backlog-to-PR flow", "Role-specific dev/QA agents", "Regression checks", "Artifact-first review"],
  },
  {
    title: "Research and intelligence",
    body:
      "Turn recurring research into a repeatable pipeline with source collection, synthesis, contradiction checks, and executive-ready outputs.",
    bullets: ["Market scans", "Competitor monitoring", "Lead research", "Source-backed reports"],
  },
  {
    title: "Client onboarding systems",
    body:
      "Package a client-specific operating system: collect requirements, install a starter team, add context files, configure workflows, then train humans on review points.",
    bullets: ["Discovery intake", "Workspace setup", "Custom workflow map", "Handoff documentation"],
  },
];

const onboardingSteps = [
  {
    id: "01",
    title: "Map the business process",
    body:
      "Start with the outcome: what should happen, who approves it, what tools are involved, what data is sensitive, and what success looks like.",
    deliverable: "Client process map + automation opportunity list",
  },
  {
    id: "02",
    title: "Choose the first agent team",
    body:
      "Pick a narrow, valuable workflow and scaffold from a builtin recipe when possible. Avoid one giant bot. Build a small team with clear responsibilities, role memory, tools, and review gates.",
    deliverable: "Team blueprint with roles, files, tools, and permissions",
  },
  {
    id: "03",
    title: "Load the client context",
    body:
      "Add brand docs, SOPs, product notes, examples, credentials references, ticket rules, channel conventions, and human preferences into the right memory layers.",
    deliverable: "Shared context workspace the agents can actually use",
  },
  {
    id: "04",
    title: "Build the workflow",
    body:
      "Turn the process into a visible workflow with LLM nodes, tool nodes, media nodes, handoffs, writebacks, scripts, and human approvals. Every step should be inspectable.",
    deliverable: "Runnable workflow with logs, artifacts, and failure visibility",
  },
  {
    id: "05",
    title: "Run a supervised pilot",
    body:
      "Execute real work with humans in the loop. Capture mistakes as memory updates, tighten prompts, and add tests or checks where needed.",
    deliverable: "Pilot report with fixes, examples, and go-live checklist",
  },
  {
    id: "06",
    title: "Scale into operations",
    body:
      "Add cron schedules, additional teams, custom recipes, channel bindings, integrations, reporting, and run-review habits once the first workflow is trusted and repeatable.",
    deliverable: "Production operating cadence + expansion roadmap",
  },
];

const comparison = [
  {
    label: "Generic chatbot",
    items: ["One assistant", "Conversation memory", "Manual prompting", "Hard to audit", "Useful for ad hoc tasks"],
  },
  {
    label: "ClawKitchen + OpenClaw",
    items: ["Role-based teams", "File-first shared memory", "Repeatable workflows", "Inspectable runs", "Built for client operations"],
  },
];

function Cmd({ text }: { text: string }) {
  return (
    <div className="flex min-w-0 flex-wrap items-start gap-3 text-slate-100">
      <div className="w-0 min-w-0 flex-1 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
        <span className="mr-2 text-[var(--coral-bright)]">$</span>
        {text}
      </div>
      <CopyLineButton text={text} className="shrink-0" />
    </div>
  );
}

function FeatureCard({ feature }: { feature: (typeof operatingSystemFeatures)[number] }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
      <div className="inline-grid size-10 place-items-center rounded-xl bg-white/10 text-lg">{feature.icon}</div>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-[var(--text)]">{feature.title}</h3>
      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{feature.body}</p>
      <p className="mt-4 rounded-xl border border-[var(--border)] bg-black/20 p-3 text-xs leading-6 text-[color:color-mix(in_oklab,var(--muted)_88%,white)]">
        <span className="font-semibold text-[var(--text)]">Use case: </span>
        {feature.example}
      </p>
    </article>
  );
}

export default function KitchenPluginPage() {
  return (
    <main className="px-6 py-16 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[color:color-mix(in_oklab,var(--coral-bright)_28%,transparent)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-[color:color-mix(in_oklab,var(--cyan-bright)_18%,transparent)] blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">ClawKitchen Open Source</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-7xl">
                The operations console for AI agent teams
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)] lg:text-xl">
                ClawKitchen is the local-first UI for operating a machine that runs OpenClaw and ClawRecipes. It turns terminal commands,
                workspace folders, config files, markdown docs, workflow runs, approvals, tickets, goals, and cron jobs into
                one understandable control surface for real client operations.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/get-started" className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
                  Start onboarding
                </Link>
                <a href="https://github.com/JIGGAI/ClawKitchen" target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10">
                  View GitHub
                </a>
                <a href="https://docs.clawkitchen.ai" target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10">
                  Read docs
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Open source", "Dashboard for the machine and workspaces you own"],
                  ["Client-ready", "Designed around recipes, files, approvals, and delivery"],
                  ["Workflow-first", "Inspectable runs instead of mystery automation"],
                ].map(([label, body]) => (
                  <div key={label} className="rounded-2xl border border-[var(--border)] bg-black/20 p-4">
                    <div className="text-sm font-semibold text-[var(--text)]">{label}</div>
                    <div className="mt-1 text-xs leading-5 text-[var(--muted)]">{body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0d1521] shadow-2xl">
              <Image
                src="/images/plugins/kitchen/kitchen-01.jpg"
                alt="ClawKitchen dashboard UI"
                width={1200}
                height={760}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-6 shadow-[var(--shadow)] lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Why ClawKitchen</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">
              AI work needs an operating layer, not another prompt box
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Most organizations start with individual assistants. That works for experiments, but client operations need
              structure: clear roles, durable memory, repeatable workflows, human checkpoints, logs, approvals, and artifacts.
              ClawKitchen keeps the source of truth file-backed and human-readable while making the day-to-day system visible.
            </p>
          </article>

          <article className="rounded-3xl border border-[color:color-mix(in_oklab,var(--coral-bright)_55%,transparent)] bg-[linear-gradient(135deg,rgba(255,77,77,0.2),rgba(255,77,77,0.05))] p-6 shadow-[var(--shadow)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#ffc1c1]">Best fit</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)]">Agencies, operators, and builders</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Use ClawKitchen when you are turning AI from demo into a managed service, internal team, or repeatable client workflow that needs to be reviewed, improved, and trusted.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Product pillars</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            Everything needed to run agent teams in production
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {operatingSystemFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Operator surfaces</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            One dashboard for the whole agent operating loop
          </h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Home / Agents", "See installed agents, inferred team groupings, and the fastest path into inspecting a specific agent."],
              ["Recipes", "Scaffold agents or full teams from builtin and custom recipes, then evolve reusable client patterns."],
              ["Teams", "Manage structure, role files, skills, cron, workflows, memory, tickets, goals, and operational visibility."],
              ["Workflows", "Create and edit visual, file-first workflow definitions tied to a team."],
              ["Runs", "Inspect execution history, statuses, approvals, node outputs, and generated artifacts."],
              ["Tickets", "Move file-backed work through backlog, in-progress, testing, and done with comments and ownership."],
              ["Channels", "Connect messaging surfaces for notifications, reminders, and approval flows."],
              ["Cron jobs", "Review scheduled automation installed through recipes and decide what should run automatically."],
              ["Settings", "Control focused operational behavior such as scaffold and cron installation modes."],
            ].map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          {comparison.map((column) => (
            <article key={column.label} className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)]">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">{column.label}</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--muted)]">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-3 rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3">
                    <span className="text-[color:var(--coral-bright)]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Workflow model</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            Build processes from nodes clients can review
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--muted)]">
            A ClawRecipes workflow run is a directory on disk with a run record, logs, node outputs, approvals, and deliverables. ClawKitchen gives that file-first runtime a visual editor and run inspector.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["LLM nodes", "Assign prompts to specific team agents, use model overrides, and validate structured output fields."],
              ["Tool nodes", "Run actions such as file writes, outbound posts, messages, scripts, and external integrations."],
              ["Media nodes", "Generate images, video, or audio through driver-backed providers discovered from ClawRecipes and installed skills."],
              ["Human approvals", "Pause execution for review, send approval requests, capture declines, and route revisions back into the workflow."],
              ["Handoffs", "Send work to another workflow or team, including specialized social publishing flows."],
              ["Template variables", "Pass data between nodes with variables such as {{run.id}}, {{workflow.name}}, and upstream node outputs."],
              ["Writebacks", "Persist final outputs, notes, artifacts, or status updates back into the team workspace."],
              ["Run history", "Debug failed steps, inspect outputs, and show clients how work moved through the system."],
            ].map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Client use cases</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            Package repeatable AI services your clients can understand
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {clientUseCases.map((useCase) => (
              <article key={useCase.title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-6">
                <h3 className="text-xl font-semibold text-[var(--text)]">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{useCase.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {useCase.bullets.map((bullet) => (
                    <span key={bullet} className="rounded-full border border-[var(--border)] bg-black/20 px-3 py-1 text-xs text-[var(--muted)]">
                      {bullet}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Starter teams</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            Start from a recipe, then make it yours
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Development team", "Lead, dev, devops, and test roles for file-first tickets, implementation, verification, and PR-style delivery."],
              ["Marketing team", "SEO, copywriter, ads, social, designer, analyst, video, and compliance roles for campaign operations."],
              ["Social team", "Platform-specific distribution and social execution workflows for publishing and review."],
              ["Research team", "Citations-first research pipelines for market intelligence, competitor monitoring, and source-backed reports."],
              ["Writing team", "Brief-to-draft-to-edit pipelines for articles, documentation, newsletters, and long-form content."],
              ["Customer support team", "Triage, resolution, escalation, and knowledge-base workflows for repeatable support operations."],
            ].map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Onboarding workflow</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            A practical path from discovery to production
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--muted)]">
            This is the client-facing implementation flow ClawKitchen is built to support. Start narrow, make the work visible,
            then scale after the first workflow earns trust.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {onboardingSteps.map((step) => (
              <article key={step.id} className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
                <div className="text-xs font-bold tracking-[0.18em] text-[color:var(--coral-bright)]">STEP {step.id}</div>
                <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{step.body}</p>
                <p className="mt-4 rounded-xl bg-black/20 p-3 text-xs leading-6 text-[var(--muted)]">
                  <span className="font-semibold text-[var(--text)]">Deliverable: </span>
                  {step.deliverable}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="min-w-0 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Quick install</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">Install ClawKitchen with OpenClaw</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Install the UI plugin, restart the gateway, then enable Kitchen with explicit host, port, and auth settings.
            </p>
            <div className="codeblock mt-6 overflow-hidden rounded-2xl bg-[#0a1019] shadow-[var(--shadow)]">
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
                <span className="inline-block size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="inline-block size-2.5 rounded-full bg-[#febc2e]" />
                <span className="inline-block size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-xs text-slate-400">Terminal</span>
              </div>
              <div className="space-y-4 px-4 py-4 font-mono text-sm">
                <Cmd text="openclaw plugins install @jiggai/kitchen" />
                <Cmd text="openclaw plugins install @jiggai/recipes" />
                <Cmd text="openclaw gateway restart" />
              </div>
            </div>
          </article>

          <article className="min-w-0 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Configuration</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)]">OpenClaw config</h2>
            <pre className="mt-6 max-w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-[#0a1019] px-4 py-4 text-xs leading-6 text-slate-100">
              <code>{`"kitchen": {
  "enabled": true,
  "config": {
    "dev": false,
    "host": "<ipAddress>",
    "port": 7777,
    "authToken": "<your_password>",
    "qaToken": "<optional_qa_token>"
  }
}`}</code>
            </pre>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Screenshots</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">What operators see every day</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--muted)]">
            ClawKitchen is intentionally visual: teams, workflows, tickets, runs, and artifacts should be easy to explain to a client or teammate.
          </p>
          <div className="mt-6">
            <ScreenshotGrid items={kitchenScreens} columns="4" />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Team management</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">Design agent org charts with real responsibilities</h2>
          <div className="mt-6">
            <ScreenshotGrid items={teamScreens} columns="2" />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Workflow visibility</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">Run automation like a system, not a mystery</h2>
          <div className="mt-6">
            <ScreenshotGrid items={workflowScreens} columns="2" />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[color:color-mix(in_oklab,var(--coral-bright)_55%,transparent)] bg-[linear-gradient(135deg,rgba(255,77,77,0.22),rgba(50,215,255,0.08))] p-8 text-center shadow-[var(--shadow)] lg:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#ffc1c1]">Ready to build</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            Start with one workflow. Turn it into a client operating system.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            ClawKitchen gives you the structure to discover, configure, run, observe, and improve agent teams as a real service.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/get-started" className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
              Get started
            </Link>
            <Link href="/how-it-works" className="rounded-lg border border-[var(--border)] bg-black/20 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-black/30">
              See how it works
            </Link>
            <a href="https://discord.com/invite/qKfbeAk6zA" target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] bg-black/20 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-black/30">
              Ask for onboarding help
            </a>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Newsletter</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">Get product updates</h3>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Monthly updates on new recipes, workflows, and agent operations best practices.
            </p>
          </div>
          <NewsletterSubscribeForm />
        </section>
      </div>
    </main>
  );
}
