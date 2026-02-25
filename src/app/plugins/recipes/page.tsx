import Link from "next/link";
import { CodeBlock } from "@/components/plugins/CodeBlock";

export const metadata = {
  title: "Recipes Plugin – ClawRecipes",
};

export default function RecipesPluginPage() {
  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text)]">Recipes Plugin</h1>
              <p className="mt-2 text-[var(--muted)]">
                Scaffold teams and agents from markdown recipes (bundled + workspace).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/marketplace">
                Marketplace
              </Link>
              <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/plugins/kitchen">
                Kitchen Plugin
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <CodeBlock title="Quick Start (OpenClaw)" code="openclaw plugins install @jiggai/recipes" />
            <CodeBlock title="Quick Start (npm)" code="npm i -g @jiggai/recipes" />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-lg font-semibold text-[var(--text)]">What it does</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
                <li>Install and browse marketplace recipes.</li>
                <li>Scaffold teams (multi-agent) and single agents into workspaces.</li>
                <li>Manage ticket lanes (backlog/in-progress/testing/done) with CLI helpers.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-lg font-semibold text-[var(--text)]">Links</div>
              <div className="mt-3 space-y-2 text-sm">
                <a className="block text-[color:var(--coral-bright)] underline" href="https://github.com/JIGGAI/ClawRecipes" target="_blank" rel="noreferrer">
                  GitHub: JIGGAI/ClawRecipes
                </a>
                <a className="block text-[color:var(--coral-bright)] underline" href="https://github.com/JIGGAI/ClawRecipes/tree/main/docs" target="_blank" rel="noreferrer">
                  Docs: github.com/JIGGAI/ClawRecipes/docs
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-lg font-semibold text-[var(--text)]">Commands</div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Examples of the ClawRecipes CLI commands provided by the Recipes plugin.
            </p>

            <div className="mt-5 grid gap-4">
              <CodeBlock title="List recipes" code="openclaw recipes list" />
              <CodeBlock title="Show a recipe" code="openclaw recipes show <recipeId>" />
              <CodeBlock title="Check missing skills (all)" code="openclaw recipes status" />
              <CodeBlock title="Check missing skills (one recipe)" code="openclaw recipes status <recipeId>" />

              <CodeBlock title="Install a marketplace recipe" code="openclaw recipes install <slug>" />
              <CodeBlock title="Install a marketplace recipe (custom registry)" code="openclaw recipes install <slug> --registry-base https://clawkitchen.ai" />

              <CodeBlock title="Install a ClawHub skill (team scope)" code="openclaw recipes install-skill <skill> --team-id <teamId>" />
              <CodeBlock title="Install a ClawHub skill (agent scope)" code="openclaw recipes install-skill <skill> --agent-id <agentId>" />
              <CodeBlock title="Install a ClawHub skill (global)" code="openclaw recipes install-skill <skill> --global" />

              <CodeBlock title="Scaffold an agent" code="openclaw recipes scaffold <recipeId> --agent-id <agentId> --apply-config" />
              <CodeBlock title="Scaffold a team" code="openclaw recipes scaffold-team <recipeId> -t <teamId> --apply-config" />

              <CodeBlock title="List tickets for a team" code="openclaw recipes tickets --team-id <teamId>" />
              <CodeBlock title="Move a ticket" code="openclaw recipes move-ticket --team-id <teamId> --ticket <ticket> --to testing" />
              <CodeBlock title="QA handoff (move to testing + assign tester)" code="openclaw recipes handoff --team-id <teamId> --ticket <ticket>" />
              <CodeBlock title="Complete a ticket (move to done)" code="openclaw recipes complete --team-id <teamId> --ticket <ticket>" />

              <CodeBlock title="Assign a ticket" code="openclaw recipes assign --team-id <teamId> --ticket <ticket> --owner dev" />
              <CodeBlock title="Take a ticket (assign + in-progress)" code="openclaw recipes take --team-id <teamId> --ticket <ticket> --owner dev" />

              <CodeBlock title="Dispatch (lead: request -> inbox/backlog)" code='openclaw recipes dispatch --team-id <teamId> --request "Add a new feature"' />

              <CodeBlock title="Cleanup closed assignment stubs" code="openclaw recipes cleanup-closed-assignments --team-id <teamId>" />
              <CodeBlock title="Cleanup test workspaces (dry run)" code="openclaw recipes cleanup-workspaces" />
              <CodeBlock title="Cleanup test workspaces (delete)" code="openclaw recipes cleanup-workspaces --yes" />

              <CodeBlock title="Migrate legacy team workspace" code="openclaw recipes migrate-team --team-id <teamId> --mode move" />
              <CodeBlock title="Remove a team (safe uninstall)" code="openclaw recipes remove-team --team-id <teamId>" />

              <CodeBlock title="Show routing bindings" code="openclaw recipes bindings" />
              <CodeBlock title="Bind a DM/channel to an agent" code="openclaw recipes bind --agent-id <agentId> --channel telegram --peer-kind dm --peer-id <peerId>" />
              <CodeBlock title="Unbind routing bindings" code="openclaw recipes unbind --channel telegram --peer-kind dm --peer-id <peerId>" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
