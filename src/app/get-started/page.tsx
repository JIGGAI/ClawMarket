import Link from "next/link";

import { FadeIn } from "@/components/FadeIn";
import { CopyLineButton } from "@/components/CopyLineButton";

export const metadata = {
  title: "Get Started – ClawRecipes",
  description: "Step-by-step instructions for installing and upgrading ClawRecipes in OpenClaw.",
};

function Cmd({ text }: { text: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-slate-100">
      <div className="overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch]">
        <span className="mr-2 text-[var(--coral-bright)]">$</span>
        {text}
      </div>
      <CopyLineButton text={text} />
    </div>
  );
}

function Step({
  id,
  icon,
  title,
  description,
  commands,
}: {
  id: string;
  icon: string;
  title: string;
  description: string;
  commands: string[];
}) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[color:var(--card)] p-6 shadow-[var(--shadow)] lg:p-7">
      <div className="flex items-center gap-3">
        <span className="inline-grid size-10 place-items-center rounded-xl bg-white/10 text-lg">{icon}</span>
        <div className="text-xs font-bold tracking-[0.18em] text-[color:var(--coral-bright)]">STEP {id}</div>
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)]">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{description}</p>

      <div className="codeblock mt-5 overflow-hidden rounded-2xl bg-[#0a1019]">
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
          <span className="inline-block size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="inline-block size-2.5 rounded-full bg-[#febc2e]" />
          <span className="inline-block size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-slate-400">Terminal</span>
        </div>
        <div className="space-y-3 px-4 py-4 font-mono text-sm">
          {commands.map((c) => (
            <Cmd key={c} text={c} />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function GetStartedPage() {
  return (
    <main className="px-6 py-16 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <section className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)] lg:p-12">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Get Started</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-6xl">
              Install ClawRecipes and scaffold your first team
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-[var(--muted)]">
              Follow this quick setup flow to install the plugin, verify it loaded, and scaffold teams or individual agents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/how-it-works"
                className="rounded-lg bg-[color:var(--coral-bright)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
              >
                View How It Works
              </Link>
              <Link
                href="/marketplace"
                className="rounded-lg border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/10"
              >
                Browse Marketplace
              </Link>
            </div>
          </section>
        </FadeIn>

        <div className="mt-10 grid gap-5">
          <FadeIn>
            <Step
              id="01"
              icon="📦"
              title="Install the plugin"
              description="Install ClawRecipes, then restart OpenClaw gateway so it loads the new extension."
              commands={[
                "openclaw plugins install @jiggai/recipes",
                "openclaw gateway restart",
              ]}
            />
          </FadeIn>

          <FadeIn>
            <Step
              id="02"
              icon="✅"
              title="Verify and list available recipes"
              description="Confirm the plugin loaded and inspect available builtin/workspace recipes."
              commands={["openclaw plugins list", "openclaw recipes list"]}
            />
          </FadeIn>

          <FadeIn>
            <Step
              id="03"
              icon="🧑‍🤝‍🧑"
              title="Scaffold a full team"
              description="Create a team workspace with role agents and default process conventions."
              commands={["openclaw recipes scaffold-team development-team -t my-dev-team --apply-config"]}
            />
          </FadeIn>

          <FadeIn>
            <Step
              id="04"
              icon="🤖"
              title="Scaffold a single agent"
              description="Generate one focused agent if you don’t need a full team yet."
              commands={["openclaw recipes scaffold researcher --agent-id my-researcher --apply-config"]}
            />
          </FadeIn>

          <FadeIn>
            <Step
              id="05"
              icon="🛠️"
              title="Common maintenance commands"
              description="Useful commands for help, updating existing teams, and removing a team safely."
              commands={[
                "openclaw recipes --help",
                "openclaw recipes scaffold-team development-team -t my-dev-team --overwrite --apply-config",
                "openclaw recipes remove-team --team-id my-dev-team --yes",
              ]}
            />
          </FadeIn>

          <FadeIn>
            <Step
              id="06"
              icon="⬆️"
              title="Upgrade from older package names"
              description="If you previously used older package names, reinstall the current package and restart."
              commands={[
                "openclaw plugins install @jiggai/recipes",
                "openclaw gateway restart",
                "openclaw plugins list",
              ]}
            />
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
