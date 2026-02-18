"use client";

import { useEffect, useMemo, useState } from "react";

type Recipe = {
  slug: string;
  kind: "team" | "agent";
  name: string;
  description: string;
  version: string;
  tags: string[];
  sourceUrl: string;
};

type SortKey = "newest" | "name";

type ViewMode = "tiles" | "list";

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function CommunityRecipesClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("tiles");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/marketplace/recipes", { method: "GET" });
        const json = (await res.json()) as { ok?: boolean; error?: string; recipes?: Recipe[] };
        if (!res.ok || !json.ok) throw new Error(json.error || `Request failed (${res.status})`);
        if (!cancelled) setRecipes(json.recipes || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const qq = norm(q);
    const tt = norm(tag);

    let out = recipes;

    if (qq) {
      out = out.filter((r) => {
        const hay = [r.slug, r.name, r.description, ...(r.tags || [])].join(" ").toLowerCase();
        return hay.includes(qq);
      });
    }

    if (tt) {
      out = out.filter((r) => (r.tags || []).some((t) => norm(t) === tt));
    }

    if (sort === "name") {
      out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // We don't currently have a reliable publishedAt field in this API payload;
      // keep server ordering (publishedAt desc) by leaving as-is.
      out = [...out];
    }

    return out;
  }, [recipes, q, tag, sort]);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="w-64 rounded-lg border border-slate-200 px-3 py-2"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <input
            className="w-48 rounded-lg border border-slate-200 px-3 py-2"
            placeholder="Filter tag…"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <select className="rounded-lg border border-slate-200 px-3 py-2" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="newest">Sort: newest</option>
            <option value="name">Sort: name</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView("tiles")}
            className={`rounded-lg border px-3 py-2 font-semibold ${view === "tiles" ? "border-[color:var(--coral-bright)] text-[color:var(--coral-bright)]" : "border-slate-200 hover:bg-slate-50"}`}
            title="Tiles view"
          >
            Tiles
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-lg border px-3 py-2 font-semibold ${view === "list" ? "border-[color:var(--coral-bright)] text-[color:var(--coral-bright)]" : "border-slate-200 hover:bg-slate-50"}`}
            title="List view"
          >
            List
          </button>
        </div>
      </div>

      {loading ? <div className="mt-6 text-sm text-[var(--muted)]">Loading…</div> : null}
      {error ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      {!loading && !error ? (
        <div className="mt-6 text-sm text-[var(--muted)]">{filtered.length} recipes</div>
      ) : null}

      {!loading && !error && view === "tiles" ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <a key={r.slug} href={`/marketplace/recipes/${encodeURIComponent(r.slug)}`} className="block rounded-2xl border border-slate-200 bg-white p-6 hover:border-[color:var(--coral-bright)]">
              <div className="text-lg font-semibold text-[var(--text)]">{r.name}</div>
              <div className="mt-2 text-sm text-[var(--muted)] line-clamp-3">{r.description}</div>
              {r.tags?.length ? <div className="mt-3 text-xs text-[var(--muted)]">tags: {r.tags.join(", ")}</div> : null}
            </a>
          ))}
        </div>
      ) : null}

      {!loading && !error && view === "list" ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[var(--muted)]">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.slug} className="border-b border-slate-100 align-top hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold">
                    <a className="text-[color:var(--coral-bright)] underline" href={`/marketplace/recipes/${encodeURIComponent(r.slug)}`}>
                      {r.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{r.description}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{(r.tags || []).join(", ")}</td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td className="px-4 py-6 text-[var(--muted)]" colSpan={3}>
                    No recipes found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
