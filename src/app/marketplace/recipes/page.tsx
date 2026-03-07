import Link from "next/link";
import { CommunityRecipesClient } from "@/components/marketplace/CommunityRecipesClient";

export const metadata = {
  title: "Community Recipes – ClawRecipes",
  description: "Browse community-submitted recipes.",
};

export default function CommunityRecipesPage() {
  return (
    <main className="w-full">
      <section className="relative overflow-hidden px-6 py-16 lg:px-16">
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[color:color-mix(in_oklab,var(--coral-bright)_22%,transparent)] blur-3xl" />
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-8 shadow-[var(--shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text)]">Community recipes</h1>
              <p className="mt-2 text-[var(--muted)]">Search, filter, and sort recipes published by the community.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link className="rounded-lg border border-[var(--border)] bg-white/5 px-4 py-2 font-semibold hover:bg-white/10" href="/marketplace">
                Marketplace
              </Link>
              <Link className="rounded-lg bg-[color:var(--coral-bright)] px-4 py-2 font-semibold text-[#0b1220] hover:brightness-95" href="/marketplace/submit">
                Submit a recipe
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <CommunityRecipesClient />
          </div>
        </div>
      </section>
    </main>
  );
}
