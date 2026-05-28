import Link from "next/link";

import { CodeBlock } from "@/components/plugins/CodeBlock";
import { ScreenshotGrid } from "@/components/ScreenshotGrid";
import { NewsletterSubscribeForm } from "@/components/NewsletterSubscribeForm";

export const metadata = {
  title: "ClawRecipes – Open Source Agent Team Recipes",
  description:
    "ClawRecipes is the open-source recipe and workflow layer for OpenClaw: scaffold agents and teams, keep work file-first, run workflow automation, manage memory layers, and package repeatable client systems.",
};

const recipeScreens = [
  { src: "/images/recipes/recipes-1.png", alt: "Recipes marketplace" },
  { src: "/images/recipes/recipes-2.png", alt: "Recipes marketplace detail" },
];

const workflowScreens = [
  { src: "/images/workflows/workflow-runs.png", alt: "Workflow runs" },
  { src: "/images/workflows/workflow-runs-detail.png", alt: "Workflow run detail" },
  { src: "/images/tickets/tickets-1.png", alt: "Tickets" },
  { src: "/images/tickets/edit-tickets.png", alt: "Edit ticket" },
];

const pillars = [
  {
    icon: "🧑‍🤝‍🧑",
    title: "Agent and team scaffolding",
    body:
      "Generate complete OpenClaw workspaces from Markdown recipes: single agents, multi-role teams, role folders, shared files, tickets, memory, tools policy, and optional cron jobs.",
    example: "Example: scaffold a development team with lead, dev, devops, and test roles in one repeatable command.",
  },
  {
    icon: "🗂️",
    title: "File-first operations",
    body:
      "Requests, tickets, workflow definitions, workflow runs, approvals, node outputs, notes, artifacts, and memory live on disk where they can be searched, reviewed, versioned, and automated.",
    example: "Example: inspect a failed workflow by reading the run directory and node output files instead of guessing from a black-box database.",
  },
  {
    icon: "🎟️",
    title: "Ticket workflow",
    body:
      "Teams coordinate through a simple lane model: backlog → in-progress → testing → done. Tickets carry requirements, owners, comments, verification notes, and completion metadata.",
    example: "Example: dispatch a request, assign it to dev, hand it to QA, then complete it with durable verification notes.",
  },
  {
    icon: "🧠",
    title: "Layered memory model",
    body:
      "Separate assistant continuity, team coordination docs, team knowledge memory, and role memory so private context does not leak and durable knowledge stays reusable.",
    example: "Example: put QA release checks in role memory, while stable client brand rules live in team knowledge memory.",
  },
  {
    icon: "🕸️",
    title: "Workflow runtime",
    body:
      "Run file-first workflows with start/end, LLM, tool, human approval, writeback, media-image, media-video, and media-audio nodes. Outputs flow downstream through template variables.",
    example: "Example: research → draft → generate image → human approval → writeback → social publishing handoff.",
  },
  {
    icon: "🧩",
    title: "Skills and tool policy",
    body:
      "Recipes can declare required and optional skills, install capabilities globally or per team/agent, and apply tool allow/deny policies during scaffold.",
    example: "Example: install a research skill only for the research team while keeping execution tools constrained for writing roles.",
  },
  {
    icon: "⏰",
    title: "Cron-ready automation",
    body:
      "Recipes can include scheduled jobs for recurring operations. Operators can choose whether cron jobs are installed, reconciled, prompted, or skipped during scaffold.",
    example: "Example: run a weekday content monitor, nightly report builder, or team heartbeat loop from a recipe-defined schedule.",
  },
  {
    icon: "🐝",
    title: "Swarm orchestration",
    body:
      "For parallel coding work, the swarm orchestrator recipe coordinates git worktrees, task specs, tmux sessions, branches, and active-task registries.",
    example: "Example: split one complex engineering ticket into several isolated implementation attempts and compare results safely.",
  },
];

const bundledRecipes = [
  ["development-team", "Small engineering team with lead, dev, devops, and test roles for file-first delivery."],
  ["marketing-team", "Broad marketing org with SEO, copywriter, ads, social, designer, analyst, video, and compliance roles."],
  ["social-team", "Social execution and platform-specific distribution workflows."],
  ["research-team", "Citations-first research pipeline for source-backed reports."],
  ["writing-team", "Brief-to-draft-to-edit workflow for content and documentation."],
  ["customer-support-team", "Triage, resolution, escalation, and knowledge-base workflows."],
  ["product-team", "Product planning and delivery loop for roadmap-to-execution work."],
  ["swarm-orchestrator", "Parallel coding coordination using worktrees, branches, tmux sessions, and task registry files."],
];

const singleAgentRecipes = [
  ["project-manager", "Lightweight planning and coordination agent."],
  ["researcher", "Focused research agent for collecting and synthesizing evidence."],
  ["editor", "Editing agent for cleanup, structure, and quality passes."],
  ["developer", "Single developer agent with runtime tooling."],
];

const workflowNodes = [
  ["LLM", "Generate, transform, summarize, or validate content with assigned team agents and optional structured output fields."],
  ["Tool", "Write files, send messages, publish content, execute scripts, or call external integrations."],
  ["Human approval", "Pause workflow execution until a person approves, declines, or requests revision."],
  ["Writeback", "Append breadcrumbs, results, status updates, or deliverables into team files."],
  ["Media", "Generate image, video, or audio deliverables through provider drivers and installed skills."],
  ["Template vars", "Reference global values like {{run.id}} or upstream node outputs like {{draft.text}}."],
];

const implementationSteps = [
  {
    id: "01",
    title: "Choose the operating pattern",
    body:
      "Decide whether you need one specialist, a normal role-based team, a vertical team pack, a workflow-runner add-on, or swarm orchestration for parallel coding.",
    command: "openclaw recipes list\nopenclaw recipes show development-team",
  },
  {
    id: "02",
    title: "Scaffold a test workspace",
    body:
      "Generate the team or agent into a sandbox id first. Inspect the generated files before rolling the pattern into client production.",
    command: "openclaw recipes scaffold-team development-team --team-id dev-sandbox-team --apply-config",
  },
  {
    id: "03",
    title: "Customize files and memory",
    body:
      "Add client context, role instructions, tool policy, team knowledge, runbooks, tickets, prompts, and workflow definitions while keeping memory layers separate.",
    command: "~/.openclaw/workspace-<teamId>/shared-context/memory/\n~/.openclaw/workspace-<teamId>/roles/<role>/MEMORY.md",
  },
  {
    id: "04",
    title: "Work through tickets",
    body:
      "Use the file-first lane model for real work. Dispatch requests, assign owners, move work to testing, and complete only after verification.",
    command: "openclaw recipes dispatch --team-id development-team --owner lead --request \"Add a new workflow\"\nopenclaw recipes handoff --team-id development-team --ticket 0007",
  },
  {
    id: "05",
    title: "Automate repeatable flows",
    body:
      "Add workflows for repeatable content, research, reporting, publishing, approvals, or software delivery. Run manually first, then schedule with cron once trusted.",
    command: "openclaw recipes workflows run --team-id development-team --workflow-file marketing.workflow.json",
  },
  {
    id: "06",
    title: "Package what works",
    body:
      "When you repeatedly customize the same scaffold, turn it into a custom workspace recipe so the pattern becomes reusable for the next client.",
    command: "~/.openclaw/workspace/recipes/<custom-recipe>.md",
  },
];

const useCases = [
  {
    title: "Managed client teams",
    body:
      "Package a reusable service delivery team, then clone and customize it for each client without rebuilding your operating model from scratch.",
  },
  {
    title: "AI software factory",
    body:
      "Move coding work through clear tickets, role ownership, QA handoff, workflow automation, and optional swarm orchestration for parallel implementation.",
  },
  {
    title: "Content and marketing engine",
    body:
      "Combine marketing roles, content workflows, media nodes, approvals, publishing handoffs, and recurring cron jobs into an observable production system.",
  },
  {
    title: "Research and reporting pipeline",
    body:
      "Use citations-first research teams, workflow runs, and durable memory to produce repeatable market scans, competitor reports, and executive briefs.",
  },
];

function FeatureCard({ feature }: { feature: (typeof pillars)[number] }) {
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

export default function RecipesPluginPage() {
  return (
    <main className="px-6 py-16 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[color:color-mix(in_oklab,var(--coral-bright)_28%,transparent)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-[color:color-mix(in_oklab,var(--cyan-bright)_18%,transparent)] blur-3xl" />

          <div className="relative max-w-5xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">ClawRecipes Open Source</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-7xl">
              The recipe layer for repeatable AI agent teams
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-[var(--muted)] lg:text-xl">
              ClawRecipes turns agent setup into reusable, reviewable infrastructure. Define agents, teams, files, memory,
              skills, tickets, workflows, cron jobs, and delivery conventions as file-backed recipes — then scaffold real
              OpenClaw workspaces that can run client operations instead of one-off demos.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/marketplace" className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
                Browse Marketplace
              </Link>
              <Link href="/plugins/kitchen" className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10">
                Explore ClawKitchen
              </Link>
              <a href="https://github.com/JIGGAI/ClawRecipes" target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10">
                View GitHub
              </a>
              <a href="https://docs.clawkitchen.ai" target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10">
                Read docs
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Markdown recipes", "Agents and teams defined with YAML frontmatter and human-readable docs"],
                ["File-first runtime", "Workflows, tickets, approvals, runs, and outputs stay inspectable on disk"],
                ["Client-repeatable", "Turn proven setups into reusable delivery systems"],
              ].map(([label, body]) => (
                <div key={label} className="rounded-2xl border border-[var(--border)] bg-black/20 p-4">
                  <div className="text-sm font-semibold text-[var(--text)]">{label}</div>
                  <div className="mt-1 text-xs leading-5 text-[var(--muted)]">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-6 shadow-[var(--shadow)] lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Why ClawRecipes</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">
              Stop hand-building agent setups that nobody can reproduce
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              A good agent system is more than a prompt. It needs roles, workspace files, memory layers, tools, ticket lanes,
              workflow definitions, scheduled jobs, and operating conventions. ClawRecipes makes those pieces explicit so
              teams can scaffold them, review them, improve them, and reuse them.
            </p>
          </article>

          <article className="rounded-3xl border border-[color:color-mix(in_oklab,var(--coral-bright)_55%,transparent)] bg-[linear-gradient(135deg,rgba(255,77,77,0.2),rgba(255,77,77,0.05))] p-6 shadow-[var(--shadow)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#ffc1c1]">Mental model</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)]">Recipes are operating blueprints</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Use recipes to turn a working AI process into something you can install again: for another team, another client, or the next version of the same workflow.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Product pillars</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            Everything needed to package agent operations
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Bundled team recipes</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">Start from a proven shape</h2>
            <div className="mt-6 grid gap-3">
              {bundledRecipes.map(([name, body]) => (
                <div key={name} className="rounded-2xl border border-[var(--border)] bg-white/5 p-4">
                  <div className="font-mono text-sm font-semibold text-[var(--text)]">{name}</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{body}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Single-agent recipes</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">When a full team is too much</h2>
            <div className="mt-6 grid gap-3">
              {singleAgentRecipes.map(([name, body]) => (
                <div key={name} className="rounded-2xl border border-[var(--border)] bg-white/5 p-4">
                  <div className="font-mono text-sm font-semibold text-[var(--text)]">{name}</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-black/20 p-4 text-sm leading-7 text-[var(--muted)]">
              Start with a single agent when the job is focused. Move to a team when you need role separation, tickets, handoffs, QA, or recurring operations.
            </div>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Workflow runtime</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            File-first workflow runs with inspectable outputs
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--muted)]">
            Workflow definitions live in a team workspace, runs live as directories on disk, and node outputs can be referenced by downstream steps with template variables. That makes automation debuggable and client-reviewable.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workflowNodes.map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Implementation workflow</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            From recipe selection to reusable client system
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {implementationSteps.map((step) => (
              <article key={step.id} className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
                <div className="text-xs font-bold tracking-[0.18em] text-[color:var(--coral-bright)]">STEP {step.id}</div>
                <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{step.body}</p>
                <pre className="mt-4 max-w-full overflow-x-auto rounded-xl bg-[#0a1019] px-3 py-3 text-xs leading-6 text-slate-100">
                  <code>{step.command}</code>
                </pre>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Client use cases</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            Build once, adapt for every client
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {useCases.map((useCase) => (
              <article key={useCase.title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-6">
                <h3 className="text-xl font-semibold text-[var(--text)]">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{useCase.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Quick install</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">Install the recipe layer</h2>
            <div className="mt-5 grid gap-4">
              <CodeBlock title="OpenClaw plugin" code="openclaw plugins install @jiggai/recipes" />
              <CodeBlock title="Restart gateway" code="openclaw gateway restart" />
              <CodeBlock title="Verify" code="openclaw recipes list\nopenclaw recipes status" />
            </div>
          </article>

          <article className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Command reference</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">The daily operator loop</h2>
            <div className="mt-5 grid gap-4">
              <CodeBlock title="Scaffold team + agent" code={"openclaw recipes scaffold-team development-team --team-id development-team --apply-config\nopenclaw recipes scaffold researcher --agent-id researcher --apply-config"} />
              <CodeBlock title="Ticket flow" code={"openclaw recipes dispatch --team-id development-team --owner lead --request \"Do a thing\"\nopenclaw recipes take --team-id development-team --ticket 0001 --owner dev\nopenclaw recipes handoff --team-id development-team --ticket 0001\nopenclaw recipes complete --team-id development-team --ticket 0001"} />
            </div>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Product view</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-4xl">What it looks like in practice</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--muted)]">
            ClawKitchen is the visual surface for ClawRecipes: browse recipes, scaffold teams, inspect workflow runs, and operate tickets without losing the file-first source of truth.
          </p>
          <div className="mt-6">
            <ScreenshotGrid items={recipeScreens} columns="2" />
          </div>
          <div className="mt-8">
            <ScreenshotGrid items={workflowScreens} columns="4" />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[color:color-mix(in_oklab,var(--coral-bright)_55%,transparent)] bg-[linear-gradient(135deg,rgba(255,77,77,0.22),rgba(50,215,255,0.08))] p-8 text-center shadow-[var(--shadow)] lg:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#ffc1c1]">Ready to package your process?</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            Turn your best agent setup into a reusable recipe
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Start with a bundled recipe, customize it for one real client workflow, then promote the working pattern into a custom recipe you can install again.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/marketplace" className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
              Browse Marketplace
            </Link>
            <Link href="/plugins/kitchen" className="rounded-lg border border-[var(--border)] bg-black/20 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-black/30">
              Open ClawKitchen page
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
