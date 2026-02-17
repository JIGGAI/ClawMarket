"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ApiOk = { ok: true; submission: { id: string } };
type ApiErr = { ok?: false; error?: string };

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export default function MarketplaceSubmitPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsCsv, setTagsCsv] = useState("");
  const [authorDisplayName, setAuthorDisplayName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [license, setLicense] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [zipUrl, setZipUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tags = useMemo(() => parseTags(tagsCsv), [tagsCsv]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Title is required");
    if (!description.trim()) return setError("Description is required");
    if (!authorDisplayName.trim()) return setError("Author display name is required");
    if (!contactEmail.trim()) return setError("Contact email is required");
    if (!sourceUrl.trim() && !zipUrl.trim()) return setError("Provide either a Source URL or a Zip URL");

    setSubmitting(true);
    try {
      const res = await fetch("/api/marketplace/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          tags,
          authorDisplayName,
          contactEmail,
          license: license.trim() ? license.trim() : undefined,
          sourceUrl: sourceUrl.trim() ? sourceUrl.trim() : undefined,
          zipUrl: zipUrl.trim() ? zipUrl.trim() : undefined,
        }),
      });

      if (res.status === 401) {
        window.location.href = "/login?callbackUrl=/marketplace/submit";
        return;
      }

      const data = (await res.json().catch(() => ({}))) as ApiOk | ApiErr;
      if (!res.ok || !(data as ApiOk).ok) {
        const msg = (data as ApiErr)?.error || `Submit failed (${res.status})`;
        setError(msg);
        return;
      }

      const id = (data as ApiOk).submission.id;
      window.location.href = `/marketplace/submissions?submitted=${encodeURIComponent(id)}`;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Submit a recipe</h1>
            <p className="mt-2 text-[var(--muted)]">
              Share a recipe with the community. Submissions are reviewed before they appear publicly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/marketplace">
              Marketplace
            </Link>
            <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/marketplace/submissions">
              Your submissions
            </Link>
          </div>
        </div>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
          ) : null}

          <div>
            <label className="block text-sm font-semibold text-[var(--text)]">Title</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Awesome Team"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text)]">Short description</label>
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this recipe do?"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text)]">Tags (comma-separated)</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              value={tagsCsv}
              onChange={(e) => setTagsCsv(e.target.value)}
              placeholder="e.g. marketing, seo, lead-gen"
            />
            {tags.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-[var(--muted)]">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-[var(--text)]">Author display name</label>
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                value={authorDisplayName}
                onChange={(e) => setAuthorDisplayName(e.target.value)}
                placeholder="Shown publicly"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text)]">Contact email (private)</label>
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Used by moderators if changes are needed"
                type="email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text)]">License (optional)</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="e.g. MIT"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-[var(--text)]">Source</div>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Provide either a URL to the recipe source, or a URL to a .zip file (upload flow coming soon).
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text)]">Source URL (repo / gist / etc.)</label>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text)]">Zip URL (.zip)</label>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
                  value={zipUrl}
                  onChange={(e) => setZipUrl(e.target.value)}
                  placeholder="https://example.com/recipe.zip"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[color:var(--coral-bright)] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:brightness-95 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
            <Link className="rounded-lg border border-slate-200 px-6 py-3 font-semibold hover:bg-slate-50" href="/marketplace">
              Cancel
            </Link>
          </div>

          <div className="text-xs text-[var(--muted)]">
            Note: URLs are validated server-side and private network targets are rejected (SSRF protection).
          </div>
        </form>
      </div>
    </main>
  );
}
