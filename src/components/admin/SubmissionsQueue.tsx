"use client";

import { useEffect, useMemo, useState } from "react";

type SubmissionStatus =
  | "submitted"
  | "needs_changes"
  | "approved"
  | "rejected"
  | "published"
  | "unpublished";

type Submission = {
  id: string;
  slug?: string | null;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  status: SubmissionStatus;
  tagsCsv: string | null;
  authorDisplayName: string;
  contactEmail: string;
  sourceUrl: string | null;
  zipUrl: string | null;
  moderationReason: string | null;
  moderatedAt: string | null;
};


function fmt(iso: string) {
  try {
    return new Date(iso).toISOString().replace("T", " ").slice(0, 16);
  } catch {
    return iso;
  }
}

export function SubmissionsQueue() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // draft per-row action state
  const [draftReason, setDraftReason] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const byId = useMemo(() => new Map(submissions.map((s) => [s.id, s])), [submissions]);

  function viewLink(s: Submission) {
    const slug = s.slug || s.id;
    return `/marketplace/recipes/${encodeURIComponent(slug)}`;
  }

  function editLink(s: Submission) {
    // Admin edit uses the same form; API allows moderator/admin to PATCH.
    return `/marketplace/submit?edit=${encodeURIComponent(s.id)}`;
  }

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/submissions", { method: "GET" });
      const json = (await res.json()) as { ok?: boolean; error?: string; submissions?: Submission[] };
      if (!res.ok || !json.ok) {
        const base = json.error || `Request failed (${res.status})`;
        if (res.status === 401) {
          throw new Error(`${base}. You must be signed in.`);
        }
        if (res.status === 403) {
          throw new Error(
            `${base}. Your account is not a moderator/admin. To seed an admin in prod/dev, set ADMIN_EMAILS to include your login email, then sign out/in (or re-auth) so your User.role updates.`
          );
        }
        throw new Error(base);
      }
      setSubmissions(json.submissions || []);

      // initialize per-row fields
      setDraftReason((prev) => {
        const next = { ...prev };
        for (const s of json.submissions || []) if (next[s.id] == null) next[s.id] = "";
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function applyAction(id: string, forceStatus?: SubmissionStatus) {
    const status = forceStatus ?? byId.get(id)?.status;
    if (!status) return;

    const reasonRaw = draftReason[id] ?? "";
    const reason = reasonRaw.trim() ? reasonRaw.trim() : undefined;

    setSaving((p) => ({ ...p, [id]: true }));
    setError(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status, reason }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; submission?: Submission };
      if (!res.ok || !json.ok) {
        const base = json.error || `Request failed (${res.status})`;
        if (res.status === 401) throw new Error(`${base}. You must be signed in.`);
        if (res.status === 403) {
          throw new Error(
            `${base}. Your account is not a moderator/admin. Ensure ADMIN_EMAILS contains your email and re-auth so your role is updated.`
          );
        }
        throw new Error(base);
      }

      if (json.submission) {
        setSubmissions((prev) => prev.map((s) => (s.id === id ? json.submission! : s)));
      } else {
        await refresh();
      }

      setDraftReason((p) => ({ ...p, [id]: "" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving((p) => ({ ...p, [id]: false }));
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[var(--muted)]">{loading ? "Loading…" : `${submissions.length} submissions`}</div>
        <button
          className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50 disabled:opacity-50"
          onClick={() => void refresh()}
          disabled={loading}
          type="button"
        >
          Refresh
        </button>
      </div>

      {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[var(--muted)]">
              <th className="py-3 pr-4">Created</th>
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Author</th>
              <th className="py-3 pr-4">Contact</th>
              <th className="py-3 pr-4">Source</th>
              <th className="py-3 pr-4">Moderation</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 align-top">
                <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{fmt(s.createdAt)}</td>
                <td className="py-3 pr-4 min-w-[240px]">
                  <div className="font-semibold text-[var(--text)]">{s.title}</div>
                  <div className="mt-1 text-[var(--muted)] line-clamp-2">{s.description}</div>
                  {s.tagsCsv ? <div className="mt-1 text-xs text-[var(--muted)]">tags: {s.tagsCsv}</div> : null}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{s.authorDisplayName}</td>
                <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{s.contactEmail}</td>
                <td className="py-3 pr-4 min-w-[280px]">
                  {s.sourceUrl ? (
                    <a className="text-[color:var(--coral-bright)] underline break-all" href={s.sourceUrl} target="_blank" rel="noreferrer">
                      {s.sourceUrl}
                    </a>
                  ) : s.zipUrl ? (
                    <a className="text-[color:var(--coral-bright)] underline break-all" href={s.zipUrl} target="_blank" rel="noreferrer">
                      zipUrl
                    </a>
                  ) : (
                    <span className="text-[var(--muted)]">(none)</span>
                  )}
                </td>
                <td className="py-3 pr-4 min-w-[420px] text-[var(--muted)]">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs">status:</span>
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-[var(--text)]">
                        {s.status}
                      </span>

                      <div className="ml-auto flex flex-wrap gap-2">
                        <button
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                          onClick={() => void applyAction(s.id, "approved")}
                          disabled={!!saving[s.id]}
                          type="button"
                        >
                          Approve
                        </button>
                        <button
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                          onClick={() => void applyAction(s.id, "rejected")}
                          disabled={!!saving[s.id]}
                          type="button"
                        >
                          Deny
                        </button>
                        <button
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                          onClick={() => void applyAction(s.id, "published")}
                          disabled={!!saving[s.id]}
                          type="button"
                        >
                          Publish
                        </button>
                        <a
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                          href={viewLink(s)}
                        >
                          View
                        </a>
                        <a
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                          href={editLink(s)}
                        >
                          Edit
                        </a>
                      </div>
                    </div>

                    <input
                      className="rounded-lg border border-slate-200 px-3 py-2"
                      placeholder="Moderation reason (optional)"
                      value={draftReason[s.id] ?? ""}
                      onChange={(e) => setDraftReason((p) => ({ ...p, [s.id]: e.target.value }))}
                    />

                    {s.moderatedAt ? (
                      <div className="text-xs">
                        last moderated: {fmt(s.moderatedAt)}
                        {s.moderationReason ? ` • reason: ${s.moderationReason}` : ""}
                      </div>
                    ) : (
                      <span className="text-xs">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {!loading && !submissions.length ? (
              <tr>
                <td className="py-6 text-[var(--muted)]" colSpan={8}>
                  No submissions yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
