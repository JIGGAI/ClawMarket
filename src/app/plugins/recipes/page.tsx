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
                <a className="block text-[color:var(--coral-bright)] underline" href="https://docs.openclaw.ai" target="_blank" rel="noreferrer">
                  Docs: docs.openclaw.ai
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-lg font-semibold text-[var(--text)]">Common commands</div>
            <div className="mt-4 grid gap-4">
              <CodeBlock title="List recipes" code="openclaw recipes list" />
              <CodeBlock title="Scaffold a team" code="openclaw recipes scaffold-team <recipeId> -t <teamId> --apply-config" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
