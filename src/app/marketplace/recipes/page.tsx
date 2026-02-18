import Link from "next/link";
import { CommunityRecipesClient } from "@/components/marketplace/CommunityRecipesClient";

export const metadata = {
  title: "Community Recipes – ClawRecipes",
  description: "Browse community-submitted recipes.",
};

export default function CommunityRecipesPage() {
  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Community recipes</h1>
            <p className="mt-2 text-[var(--muted)]">Search, filter, and sort recipes published by the community.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/marketplace">
              Marketplace
            </Link>
            <Link className="rounded-lg bg-[color:var(--coral-bright)] px-4 py-2 font-semibold text-white hover:brightness-95" href="/marketplace/submit">
              Submit a recipe
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <CommunityRecipesClient />
        </div>
      </div>
    </main>
  );
}
