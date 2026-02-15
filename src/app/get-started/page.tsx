import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Get Started – ClawRecipes",
  description: "Install the ClawRecipes plugin and scaffold your first OpenClaw team.",
};

function Shot({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="mt-6">
      {/* SVG terminal renders crisply; Next/Image keeps layout stable. */}
      <Image
        src={src}
        alt={alt}
        width={1100}
        height={640}
        unoptimized
        className="h-auto w-full rounded-2xl border border-slate-200 bg-slate-900 shadow-xl"
      />
      <figcaption className="mt-2 text-sm text-[var(--muted)]">{caption}</figcaption>
    </figure>
  );
}

export default function GetStartedPage() {
  return (
    <main className="w-full">
      <FadeIn>
        <section className="px-6 py-16 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">Get Started</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)] lg:text-5xl">
              Install the plugin. Scaffold a team.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
              These screenshots are generated from real <code>openclaw</code> commands (sanitized for privacy). Follow
              along to install the recipes plugin, verify it loaded, and scaffold your first team workspace.
            </p>

            <div className="mt-10">
              <h2 className="text-2xl font-bold text-[var(--text)]">1) Install ClawRecipes</h2>
              <p className="mt-2 text-base text-[var(--muted)]">
                Install the recipes plugin into OpenClaw. If you already have it installed, you may see an “already
                exists” message.
              </p>
              <Shot
                src="/get-started/plugins-install.svg"
                alt="Terminal screenshot showing openclaw plugins install @jiggai/recipes"
                caption="Install the recipes plugin via the OpenClaw plugin manager."
              />

              <h2 className="mt-14 text-2xl font-bold text-[var(--text)]">2) Restart the gateway</h2>
              <p className="mt-2 text-base text-[var(--muted)]">Restarting the gateway reloads installed plugins.</p>
              <Shot
                src="/get-started/gateway-restart.svg"
                alt="Terminal screenshot showing openclaw gateway restart"
                caption="Restart the OpenClaw gateway to load newly installed plugins."
              />

              <h2 className="mt-14 text-2xl font-bold text-[var(--text)]">3) Verify installation</h2>
              <p className="mt-2 text-base text-[var(--muted)]">
                List plugins and confirm <code>recipes</code> is present.
              </p>
              <Shot
                src="/get-started/plugins-list.svg"
                alt="Terminal screenshot showing openclaw plugins list"
                caption="Confirm the recipes plugin appears in the installed plugin list."
              />

              <h2 className="mt-14 text-2xl font-bold text-[var(--text)]">4) List recipes</h2>
              <p className="mt-2 text-base text-[var(--muted)]">
                The plugin ships with built-in recipes (and can also load workspace recipes from your local workspace).
              </p>
              <Shot
                src="/get-started/recipes-list.svg"
                alt="Terminal screenshot showing openclaw recipes list"
                caption="List available recipes (builtin + workspace)."
              />

              <h2 className="mt-14 text-2xl font-bold text-[var(--text)]">5) Scaffold a team workspace</h2>
              <p className="mt-2 text-base text-[var(--muted)]">
                Scaffold a shared workspace (tickets, lanes, roles) from a team recipe.
              </p>
              <Shot
                src="/get-started/scaffold-team.svg"
                alt="Terminal screenshot showing openclaw recipes scaffold-team development-team -t docs-screenshot-team --overwrite"
                caption="Scaffold a team from a team recipe. Output is JSON describing created files and agents."
              />

              <h2 className="mt-14 text-2xl font-bold text-[var(--text)]">If skills are missing</h2>
              <p className="mt-2 text-base text-[var(--muted)]">
                Some recipes require additional skills. The CLI will print exactly what is missing and what to install.
              </p>
              <Shot
                src="/get-started/missing-skills.svg"
                alt="Terminal screenshot showing missing skills error and suggested install commands"
                caption="If required skills are missing, install them (workspace-local) and re-run scaffold."
              />

              <h2 className="mt-14 text-2xl font-bold text-[var(--text)]">Remove a team</h2>
              <p className="mt-2 text-base text-[var(--muted)]">
                When you’re done with a sandbox team, you can remove its workspace.
              </p>
              <Shot
                src="/get-started/remove-team.svg"
                alt="Terminal screenshot showing openclaw recipes remove-team help"
                caption="Use remove-team to clean up a scaffolded team workspace."
              />

              <h2 className="mt-14 text-2xl font-bold text-[var(--text)]">Upgrade from older installs</h2>
              <p className="mt-2 text-base text-[var(--muted)]">
                If you installed via npm previously, you can update with the plugin manager.
              </p>
              <Shot
                src="/get-started/upgrade.svg"
                alt="Terminal screenshot showing openclaw plugins update recipes"
                caption="Update the recipes plugin. Restart the gateway afterward if prompted."
              />

              <div className="mt-16 rounded-2xl bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-[var(--text)]">Next</h3>
                <p className="mt-2 text-base text-[var(--muted)]">
                  Once you have a team scaffolded, you can browse recipes in the marketplace and manage teams in
                  ClawKitchen.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/marketplace"
                    className="rounded-lg bg-[color:var(--coral-bright)] px-4 py-2 text-base font-semibold text-white shadow-sm hover:brightness-95"
                  >
                    Browse Marketplace
                  </Link>
                  <a
                    href="https://docs.openclaw.ai"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-[var(--text)] shadow-sm hover:bg-slate-50"
                  >
                    OpenClaw Docs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
