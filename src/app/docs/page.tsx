import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata = {
  title: "Docs – ClawRecipes",
  description: "Documentation for ClawRecipes, ClawKitchen, recipes, workflows, and team operations.",
};

export default function DocsPage() {
  return (
    <main className="w-full">
      <FadeIn>
        <section className="px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--coral-bright)]">
              Documentation
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-[var(--text)] lg:text-6xl">
              Product docs
            </h1>
            <p className="mt-6 text-xl leading-8 text-[var(--muted)]">
              Browse the live docs for ClawRecipes, ClawKitchen, workflows, team operations, and setup guides.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                className="rounded-lg bg-[color:var(--coral-bright)] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:brightness-95"
                href="https://docs.openclaw.ai"
                target="_blank"
                rel="noreferrer"
              >
                OpenClaw Docs
              </a>
              <a
                className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-[var(--text)] shadow-md transition hover:bg-slate-50"
                href="https://docs.clawkitchen.ai"
                target="_blank"
                rel="noreferrer"
              >
                Browse JIGGAI Docs
              </a>
            </div>

            <div className="mt-16 rounded-2xl bg-slate-50 p-8 text-left">
              <h2 className="text-2xl font-bold text-[var(--text)]">In the meantime...</h2>
              <ul className="mt-4 space-y-3 text-lg text-[var(--muted)]">
                <li>
                  📖 Check out the{" "}
                  <a
                    href="https://docs.clawkitchen.ai"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[color:var(--coral-bright)] underline"
                  >
                    JIGGAI Docs
                  </a>{" "}
                  for product and setup guides
                </li>
                <li>
                  🍳 Browse{" "}
                  <Link href="/marketplace" className="text-[color:var(--coral-bright)] underline">
                    available recipes
                  </Link>{" "}
                  in the marketplace
                </li>
                <li>
                  💬 Join the{" "}
                  <a
                    href="https://discord.com/invite/qKfbeAk6zA"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[color:var(--coral-bright)] underline"
                  >
                    OpenClaw Discord
                  </a>{" "}
                  for help and discussion
                </li>
              </ul>
            </div>
          </div>
        </section>
      </FadeIn>
    </main>
  );
}
