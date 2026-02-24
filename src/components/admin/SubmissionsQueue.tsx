"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type SubmissionStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "needs_changes"
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
  const [draftStatus, setDraftStatus] = useState<Record<string, SubmissionStatus>>({});
  const [draftReason, setDraftReason] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [noticeById, setNoticeById] = useState<Record<string, string>>({});

  const byId = useMemo(() => new Map(submissions.map((s) => [s.id, s])), [submissions]);

  function viewLink(s: Submission) {
    const slug = s.slug || s.id;
    return `/marketplace/recipes/${encodeURIComponent(slug)}`;
  }

  function editLink(s: Submission) {
    // Admin edit uses the same form; API allows moderator/admin to PATCH.
    return `/marketplace/submit?edit=${encodeURIComponent(s.id)}`;
  }

  async function readJson<T>(res: Response): Promise<T> {
    const ct = res.headers.get("content-type") || "";
    const text = await res.text();
    if (!text.trim()) return {} as T;
    if (!ct.includes("application/json")) {
      // common when we get redirected to HTML/login or an upstream error page
      throw new Error(`Unexpected response (status ${res.status}). Expected JSON, got: ${ct || "(no content-type)"}`);
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(`Failed to parse JSON (status ${res.status}).`);
    }
  }

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/submissions", { method: "GET" });
      const json = await readJson<{ ok?: boolean; error?: string; submissions?: Submission[] }>(res);
      if (!res.ok || !json.ok) {
        const base = json.error || `Request failed (${res.status})`;
        if (res.status === 401) {
          throw new Error(`${base}. You must be signed in.`);
        }
        if (res.status === 403) {
          throw new Error(`${base}. You don't have permission to view admin submissions.`);
        }
        throw new Error(base);
      }
      setSubmissions(json.submissions || []);

      // initialize per-row fields
      setDraftStatus((prev) => {
        const next = { ...prev };
        for (const s of json.submissions || []) if (next[s.id] == null) next[s.id] = s.status;
        return next;
      });
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
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function applyAction(id: string, forceStatus?: SubmissionStatus) {
    const status = forceStatus ?? draftStatus[id] ?? byId.get(id)?.status;
    if (!status) return;

    const reasonRaw = draftReason[id] ?? "";
    const reasonTrimmed = reasonRaw.trim();
    const reason = reasonTrimmed ? reasonTrimmed : undefined;

    if ((status === "needs_changes" || status === "rejected") && !reasonTrimmed) {
      setError("Please include a moderation reason for needs_changes / rejected.");
      return;
    }

    setSaving((p) => ({ ...p, [id]: true }));
    setError(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status, reason }),
      });
      const json = await readJson<{ ok?: boolean; error?: string; submission?: Submission }>(res);
      if (!res.ok || !json.ok) {
        const base = json.error || `Request failed (${res.status})`;
        if (res.status === 401) throw new Error(`${base}. You must be signed in.`);
        if (res.status === 403) {
          throw new Error(`${base}. You don't have permission to moderate submissions.`);
        }
        throw new Error(base);
      }

      if (json.submission) {
        setSubmissions((prev) => prev.map((s) => (s.id === id ? json.submission! : s)));
      } else {
        await refresh();
      }

      // toast-ish confirmation
      setNoticeById((p) => ({ ...p, [id]: `Saved (${status})` }));
      setTimeout(() => {
        setNoticeById((p) => {
          const next = { ...p };
          delete next[id];
          return next;
        });
      }, 2500);

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
              <th className="py-3 pr-4">Moderation</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 align-top">
                <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{fmt(s.createdAt)}</td>
                <td className="py-3 pr-4 min-w-[360px]">
                  <div className="font-semibold text-[var(--text)]">
                    <Link className="hover:underline" href={`/admin/submissions/${encodeURIComponent(s.id)}`}>
                      {s.title}
                    </Link>
                  </div>
                  <div className="mt-1 text-[var(--muted)] line-clamp-2">{s.description}</div>
                  {s.tagsCsv ? <div className="mt-1 text-xs text-[var(--muted)]">tags: {s.tagsCsv}</div> : null}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{s.authorDisplayName}</td>
                <td className="py-3 pr-4 whitespace-nowrap text-[var(--muted)]">{s.contactEmail}</td>
                <td className="py-3 pr-4 min-w-[420px] text-[var(--muted)]">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <select
                          className="w-[220px] rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"
                          value={(draftStatus[s.id] ?? s.status) as string}
                          onChange={(e) => setDraftStatus((p) => ({ ...p, [s.id]: e.target.value as SubmissionStatus }))}
                        >
                          <option value="submitted">submitted</option>
                          <option value="approved">approved</option>
                          <option value="needs_changes">needs_changes</option>
                          <option value="rejected">rejected</option>
                          <option value="published">published</option>
                          <option value="unpublished">unpublished</option>
                        </select>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          className="rounded-lg bg-[color:var(--coral-bright)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                          onClick={() => void applyAction(s.id)}
                          disabled={!!saving[s.id]}
                          type="button"
                        >
                          Save
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
                      className="w-full max-w-[360px] rounded-lg border border-slate-200 px-3 py-2"
                      placeholder="Moderation reason (optional)"
                      value={draftReason[s.id] ?? ""}
                      onChange={(e) => setDraftReason((p) => ({ ...p, [s.id]: e.target.value }))}
                    />

                    {noticeById[s.id] ? (
                      <div className="text-xs text-emerald-700">{noticeById[s.id]}</div>
                    ) : null}

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
