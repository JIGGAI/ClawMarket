"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/Modal";
import SignInOptions from "@/app/login/SignInOptions";

type ApiOk = { ok: true; submission: { id: string } };
type ApiErr = { ok?: false; error?: string };

type PendingAction = { draft?: boolean };

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export default function MarketplaceSubmitPage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsCsv, setTagsCsv] = useState("");
  const [authorDisplayName, setAuthorDisplayName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [license, setLicense] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [body, setBody] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tags = useMemo(() => parseTags(tagsCsv), [tagsCsv]);

  async function submit(opts?: PendingAction) {
    setError(null);

    if (!session) {
      setPendingAction(opts ?? {});
      setShowLoginModal(true);
      return;
    }

    const isDraft = opts?.draft === true;

    if (!title.trim()) return setError(isDraft ? "Title is required for drafts" : "Title is required");

    if (!isDraft) {
      if (!description.trim()) return setError("Description is required");
      if (!authorDisplayName.trim()) return setError("Author display name is required");
      if (!contactEmail.trim()) return setError("Contact email is required");
      if (!sourceUrl.trim() && !body.trim()) return setError("Provide either a Source URL or a Recipe body");
    }

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
          body: body.trim() ? body.trim() : undefined,
          draft: opts?.draft === true,
        }),
      });

      if (res.status === 401) {
        // Session may have expired; fall back to interactive sign-in.
        setPendingAction(opts ?? {});
        setShowLoginModal(true);
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

  async function onSubmit(e: React.FormEvent, opts?: PendingAction) {
    e.preventDefault();
    await submit(opts);
  }

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <Modal
          open={showLoginModal}
          title="Sign in required"
          onClose={() => {
            setShowLoginModal(false);
            setPendingAction(null);
          }}
        >
          <p className="text-sm text-[var(--muted)]">You need to sign in to save drafts or submit recipes.</p>

          <SignInOptions
            mode="modal"
            callbackUrl="/marketplace/submit"
            onSignedIn={async () => {
              setShowLoginModal(false);
              const action = pendingAction;
              setPendingAction(null);
              // Auto-retry the original Save/Submit.
              await submit(action ?? {});
            }}
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a className="text-sm text-[var(--muted)] underline" href="/signup">
              Create account
            </a>
            <a className="text-sm text-[var(--muted)] underline" href="/forgot">
              Forgot password
            </a>
          </div>
        </Modal>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Submit a recipe</h1>
            <p className="mt-2 text-[var(--muted)]">
              Share a recipe with the community. Submissions are reviewed before they appear publicly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50"
              href="/marketplace"
            >
              Marketplace
            </Link>
            <Link
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50"
              href="/marketplace/submissions"
            >
              Your submissions
            </Link>
            <Link
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50"
              href="/marketplace/recipes"
            >
              Browse all recipes
            </Link>
          </div>
        </div>

        <form className="mt-8 space-y-5" onSubmit={(e) => void onSubmit(e)}>
          {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}

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
                  <span
                    key={t}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-[var(--muted)]"
                  >
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
            <p className="mt-1 text-sm text-[var(--muted)]">Provide either a URL to the recipe source, or paste the full recipe body as Markdown.</p>

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
                <label className="block text-sm font-semibold text-[var(--text)]">Recipe body (Markdown)</label>
                <textarea
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={'---\nid: my-recipe\nname: My Recipe\n---\n\n# Instructions\n...'}
                  rows={12}
                />
                <div className="mt-1 text-xs text-[var(--muted)]">
                  Must include YAML frontmatter with an <code>id:</code>. We validate and sanitize on submit.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={(e) => void onSubmit(e as unknown as React.FormEvent, { draft: true })}
              className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-[var(--text)] shadow-sm hover:bg-slate-50 disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save draft"}
            </button>
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
            Note: URLs are validated server-side and private network targets are rejected (SSRF protection). Markdown bodies are validated + sanitized.
          </div>
        </form>
      </div>
    </main>
  );
}
