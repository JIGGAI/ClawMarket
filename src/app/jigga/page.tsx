import Link from "next/link";

import { CodeBlock } from "@/components/plugins/CodeBlock";
import { NewsletterSubscribeForm } from "@/components/NewsletterSubscribeForm";

export const metadata = {
  title: "JIGGA – Infrastructure-as-Code for Personal AI Workers",
  description:
    "JIGGA is a local-first operating system for personal AI workers: declare agents, teams, workflows, scoped memory, tasks, and permissions in files, then use a supervisor daemon to wake the right worker at the right time.",
};

const principles = [
  ["Local-first", "Memory, state, logs, schedules, and configuration live on your machine by default."],
  ["Declarative", "Agents, teams, workflows, memory scopes, and policies are defined in reviewable files."],
  ["Memory-centric", "Agents are temporary executors; persistent memory and task state create continuity."],
  ["Scoped context", "Different workers see different memory views based on role, trust, and need."],
  ["Safe autonomy", "Workers can act independently only inside explicit permissions and approval gates."],
  ["Workflow-aware", "Repeated work becomes reusable playbooks that can be planned, reviewed, and approved."],
];

const systemLayers = [
  {
    title: "Supervisor daemon",
    body:
      "The always-on process that watches schedules, events, task queues, file changes, and agent wake requests. It decides which worker should run, enforces loop prevention, and starts temporary runtimes.",
  },
  {
    title: "Agent runtime",
    body:
      "A worker starts for a task or event, loads only its allowed context, uses approved tools, updates memory or task state, then exits. Persistence is in files and state — not in a forever-running chat session.",
  },
  {
    title: "Team runtime",
    body:
      "Reusable groups of agents coordinate through shared tasks, team memory scopes, policies, handoffs, and workflows for categories of work like research, social content, software delivery, or personal admin.",
  },
  {
    title: "Memory kernel",
    body:
      "Raw files, structured facts, summaries, and indexes are combined through scoped retrieval so each worker gets the right context at the right time — not a giant unbounded prompt.",
  },
];

const coreNouns = [
  ["Agents", "Individual AI workers with roles, tools, model choices, wake rules, permissions, and memory scopes."],
  ["Teams", "Reusable groups of agents that collaborate around a category of work."],
  ["Workflows", "Declarative SOPs or playbooks agents can invoke for repeatable work."],
  ["Tasks", "Units of work that can be created, claimed, delegated, reviewed, completed, or archived."],
  ["Memory", "Local, file-first persistent context exposed through scoped summaries and retrieval."],
  ["Policies", "Explicit controls for memory, filesystem, shell, network, tool, approval, and schedule access."],
];

const memoryLayers = [
  ["Raw memory", "Transcripts, notes, task logs, workflow outputs, selected emails, meeting summaries, and project files."],
  ["Structured memory", "Stable facts, explicit preferences, user goals, project state, and durable decisions."],
  ["Summary memory", "Compact context files for scopes like manager_view, project_view, or a specific team."],
  ["Indexed memory", "Keyword, vector, and metadata indexes generated from local files for targeted retrieval."],
];

const workflowExamples = [
  {
    title: "Morning day summary",
    body:
      "Wake each weekday, read approved calendar and email scopes, summarize the day, and send a notification — only after the recurring workflow is planned and approved.",
  },
  {
    title: "Meeting reminders",
    body:
      "Monitor upcoming events, gather prep context, and notify the user 30 minutes and 5 minutes before each meeting.",
  },
  {
    title: "Social content syndication",
    body:
      "Turn one source idea into a LinkedIn post, X thread, newsletter blurb, editorial review, and publishing package.",
  },
  {
    title: "Agent delegation",
    body:
      "A research worker finds an opportunity, creates a task for a strategist, and the supervisor wakes the next worker when appropriate.",
  },
];

const approvalItems = [
  "Creating recurring workflows",
  "Changing permissions",
  "Accessing sensitive memory or directories",
  "Sending email or external messages",
  "Publishing content",
  "Running shell commands outside restricted modes",
  "Making purchases or irreversible external actions",
  "Granting new secret or credential access",
];

const roadmap = [
  ["Runtime foundation", "Supervisor skeleton, agent config loader, basic runner, task queue, state file, and logs."],
  ["Memory + workflows", "Local memory directory, memory scopes, workflow YAML loader, and basic workflow executor."],
  ["Delegation + cron", "Scheduled wakes, agent-to-agent task delegation, team runtime skeleton, and example teams."],
  ["Safety + inference", "Permission model, filesystem allow/deny, approval gates, audit logs, and repeated-pattern suggestions."],
];

const discordUrl = "https://discord.com/invite/qKfbeAk6zA";

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-4xl">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">{title}</h2>
      {body ? <p className="mt-4 text-sm leading-7 text-[var(--muted)] lg:text-base">{body}</p> : null}
    </div>
  );
}

export default function JiggaPage() {
  return (
    <main className="px-6 py-16 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[color:color-mix(in_oklab,var(--coral-bright)_28%,transparent)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-80 w-80 rounded-full bg-[color:color-mix(in_oklab,var(--cyan-bright)_18%,transparent)] blur-3xl" />

          <div className="relative max-w-5xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">JIGGA Open Source</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-7xl">
              Infrastructure-as-code for personal AI workers
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-[var(--muted)] lg:text-xl">
              JIGGA is a local-first operating system for persistent AI work. Declare agents, teams, workflows, tasks,
              scoped memory, and policies in files — then let an always-on supervisor wake the right worker when there is
              actually work to do.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://github.com/JIGGAI/JIGGA" target="_blank" rel="noreferrer" className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
                View GitHub
              </a>
              <a href={discordUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10">
                Join Discord
              </a>
              <Link href="/plugins/recipes" className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10">
                Explore ClawRecipes
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Agents do not run forever", "The supervisor wakes them, they work, update state, then stop"],
                ["Memory persists", "Continuity lives in files, summaries, indexes, tasks, schedules, and state"],
                ["Plan before apply", "Permission and workflow changes should be previewed before activation"],
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
            <SectionHeading
              eyebrow="Product thesis"
              title="Not a chatbot. Not just an agent framework."
              body="Most AI systems are either developer SDKs, prompt wrappers, or workflow chains that only run when explicitly invoked. JIGGA treats AI workers like local infrastructure: configured, permissioned, observable, schedulable, and reusable."
            />
          </article>
          <article className="rounded-3xl border border-[color:color-mix(in_oklab,var(--coral-bright)_55%,transparent)] bg-[linear-gradient(135deg,rgba(255,77,77,0.2),rgba(255,77,77,0.05))] p-6 shadow-[var(--shadow)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#ffc1c1]">Core idea</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)]">The daemon is always on. The agents are not.</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              This creates the feeling of persistent AI workers without wasting resources or creating runaway loops.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <SectionHeading
            eyebrow="Design principles"
            title="Built like local infrastructure"
            body="JIGGA’s public promise is simple: personal AI workers should be persistent, inspectable, scoped, and safe enough to trust with real operations."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {principles.map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <SectionHeading
            eyebrow="System model"
            title="A supervisor, temporary runtimes, and persistent state"
            body="The persistence layer is not a chat process. It is the combination of memory, task queues, workflows, schedules, policies, state, and logs."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {systemLayers.map((layer) => (
              <article key={layer.title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-5">
                <h3 className="text-xl font-semibold text-[var(--text)]">{layer.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{layer.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[#0a1019] p-5 font-mono text-xs leading-7 text-slate-100">
            <div>Events / Cron / User Requests / Agent Requests</div>
            <div className="text-[color:var(--coral-bright)]">↓</div>
            <div>Supervisor Daemon</div>
            <div className="text-[color:var(--coral-bright)]">↓</div>
            <div>Agent Runtime + Team Runtime</div>
            <div className="text-[color:var(--coral-bright)]">↓</div>
            <div>Workflow Library + Task Queue</div>
            <div className="text-[color:var(--coral-bright)]">↓</div>
            <div>Memory Kernel + Local Filesystem</div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <SectionHeading eyebrow="Core nouns" title="Declare the whole worker system" />
            <div className="mt-6 grid gap-3">
              {coreNouns.map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-4">
                  <div className="font-semibold text-[var(--text)]">{title}</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{body}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <SectionHeading eyebrow="Memory model" title="Agents are temporary. Memory persists." />
            <div className="mt-6 grid gap-3">
              {memoryLayers.map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-4">
                  <div className="font-semibold text-[var(--text)]">{title}</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{body}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <SectionHeading
            eyebrow="Terraform-style control"
            title="Plan before agents gain power"
            body="Before enabling a new recurring workflow, permission, schedule, or worker, JIGGA should show what will change and what access it requires."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <CodeBlock
              title="Planned CLI direction"
              code={"jigga init\njigga plan\njigga apply\njigga state\njigga run agent daily_briefing_agent\njigga workflow plan morning_day_summary\njigga workflow apply morning_day_summary"}
            />
            <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-5">
              <h3 className="text-xl font-semibold text-[var(--text)]">Example plan preview</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-[#0a1019] p-4 text-xs leading-6 text-slate-100">
                <code>{`Workflow: morning_day_summary
Will run: weekdays at 7:30am
Will read: calendar, important unread email
Will write: daily summary memory
Will notify: user
Requires: calendar.read, email.read, notifications.send
Approval required: yes`}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <SectionHeading
            eyebrow="Workflow inference"
            title="Repeated behavior becomes suggested automation"
            body="JIGGA should notice patterns and propose reusable workflows — but agents should not silently create recurring autonomous behavior. The user reviews the plan first."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {workflowExamples.map((example) => (
              <article key={example.title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-6">
                <h3 className="text-xl font-semibold text-[var(--text)]">{example.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{example.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <SectionHeading
              eyebrow="Safety model"
              title="The biggest risk is data access"
              body="JIGGA treats memory, files, tools, shell, network, calendar, email, notifications, and secrets as bounded capabilities checked by policy and logged for audit."
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {approvalItems.map((item) => (
                <div key={item} className="rounded-xl border border-[var(--border)] bg-white/5 p-3 text-sm leading-6 text-[var(--muted)]">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
            <SectionHeading eyebrow="MVP roadmap" title="A small real runtime first" />
            <div className="mt-6 grid gap-3">
              {roadmap.map(([title, body], idx) => (
                <div key={title} className="rounded-2xl border border-[var(--border)] bg-white/5 p-4">
                  <div className="text-xs font-bold tracking-[0.18em] text-[color:var(--coral-bright)]">WEEK {idx + 1}</div>
                  <div className="mt-1 font-semibold text-[var(--text)]">{title}</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{body}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-[color:color-mix(in_oklab,var(--coral-bright)_55%,transparent)] bg-[linear-gradient(135deg,rgba(255,77,77,0.22),rgba(50,215,255,0.08))] p-8 text-center shadow-[var(--shadow)] lg:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#ffc1c1]">For builders, founders, operators, and power users</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
            Define AI workers the way you define infrastructure
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            JIGGA is for people who want persistent AI workers for content, research, software, admin, operations, and personal systems — without giving up local control.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://github.com/JIGGAI/JIGGA" target="_blank" rel="noreferrer" className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
              Follow the repo
            </a>
            <a href={discordUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] bg-black/20 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-black/30">
              Join the community
            </a>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--coral-bright)]">Newsletter</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)]">Get JIGGA updates</h3>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Follow progress on local-first AI workers, supervisor runtimes, memory scopes, and workflow inference.
            </p>
          </div>
          <NewsletterSubscribeForm />
        </section>
      </div>
    </main>
  );
}
