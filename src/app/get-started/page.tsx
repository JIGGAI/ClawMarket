export const metadata = {
  title: "Get Started – ClawRecipes",
  description: "Step-by-step instructions for installing and upgrading the ClawRecipes plugin in OpenClaw.",
};

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-900 p-5 text-sm leading-6 text-slate-100 shadow-sm">
      <code>{children}</code>
    </pre>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">{title}</h2>
      <div className="mt-3 space-y-3 text-[var(--muted)]">{children}</div>
    </section>
  );
}

export default function GetStartedPage() {
  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">Get Started</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          Install the ClawRecipes plugin into OpenClaw, scaffold a team or agent, and learn how to upgrade safely.
        </p>

        <Section title="1) Install the plugin">
          <p>Install the plugin package, then restart the OpenClaw gateway so it loads the new extension.</p>
          <CodeBlock>{`openclaw plugins install @jiggai/recipes
openclaw gateway restart`}</CodeBlock>
        </Section>

        <Section title="2) Verify it loaded">
          <p>Confirm the Recipes plugin is loaded.</p>
          <CodeBlock>{`openclaw plugins list`}</CodeBlock>
        </Section>

        <Section title="3) List recipes">
          <p>List available recipes (builtin + workspace).</p>
          <CodeBlock>{`openclaw recipes list`}</CodeBlock>
        </Section>

        <Section title="4) Scaffold a team (shared workspace)">
          <p>
            Scaffold a team from a built-in team recipe. This creates <code>workspace-&lt;teamId&gt;/</code> plus role agents.
          </p>
          <CodeBlock>{`openclaw recipes scaffold-team development-team -t my-dev-team --apply-config`}</CodeBlock>
        </Section>

        <Section title="5) Scaffold a single agent">
          <p>Scaffold a single agent from a recipe.</p>
          <CodeBlock>{`openclaw recipes scaffold researcher --agent-id my-researcher --apply-config`}</CodeBlock>
        </Section>

        <Section title="Commands (examples)">
          <p>Common commands you’ll use:</p>
          <CodeBlock>{`# Help
openclaw recipes --help

# Re-run scaffold on an existing team (update files)
openclaw recipes scaffold-team development-team -t my-dev-team --overwrite --apply-config

# Remove a team safely
openclaw recipes remove-team --team-id my-dev-team --yes`}</CodeBlock>
        </Section>

        <Section title="Upgrade from older versions">
          <p>
            If you previously installed older packages (e.g. <code>@clawcipes/recipes</code>), upgrade by installing the
            new package and restarting.
          </p>
          <CodeBlock>{`openclaw plugins install @jiggai/recipes
openclaw gateway restart
openclaw plugins list`}</CodeBlock>
        </Section>
      </div>
    </main>
  );
}
