"use client";

import type { Submission as PrismaSubmission } from "@prisma/client";
import { useMemo, useState } from "react";

type SubmissionStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "needs_changes"
  | "rejected"
  | "published"
  | "unpublished";

type Submission = PrismaSubmission & {
  status: SubmissionStatus;
};

function fmt(v: string | Date | null | undefined) {
  if (!v) return "—";
  try {
    const d = typeof v === "string" ? new Date(v) : v;
    return d.toISOString().replace("T", " ").slice(0, 16);
  } catch {
    return String(v);
  }
}

async function readJson<T>(res: Response): Promise<T> {
  const ct = res.headers.get("content-type") || "";
  const text = await res.text();
  if (!text.trim()) return {} as T;
  if (!ct.includes("application/json")) {
    throw new Error(`Unexpected response (status ${res.status}). Expected JSON, got: ${ct || "(no content-type)"}`);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Failed to parse JSON (status ${res.status}).`);
  }
}

export function SubmissionDetailClient({ submission }: { submission: Submission }) {
  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [reason, setReason] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const viewSlug = useMemo(() => submission.slug || submission.id, [submission.id, submission.slug]);
  const viewHref = `/marketplace/recipes/${encodeURIComponent(viewSlug)}`;
  const editHref = `/marketplace/submit?edit=${encodeURIComponent(submission.id)}`;

  async function save(nextStatus?: SubmissionStatus) {
    const s = nextStatus ?? status;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: submission.id, status: s, reason: reason.trim() || undefined }),
      });
      const json = await readJson<{ ok?: boolean; error?: string; submission?: Submission }>(res);
      if (!res.ok || !json.ok) {
        const base = json.error || `Request failed (${res.status})`;
        if (res.status === 401) throw new Error(`${base}. You must be signed in.`);
        if (res.status === 403) throw new Error(`${base}. You don't have permission to moderate submissions.`);
        throw new Error(base);
      }
      if (json.submission) {
        setStatus(json.submission.status);
      }
      setNotice(`Saved (${s})`);
      setReason("");
      setTimeout(() => setNotice(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8">
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {notice ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div> : null}

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs text-[var(--muted)]">id: {submission.id}</div>
                <h2 className="mt-1 text-2xl font-bold text-[var(--text)]">{submission.title}</h2>
                <p className="mt-2 text-[var(--muted)]">{submission.description}</p>
                {submission.tagsCsv ? <div className="mt-2 text-sm text-[var(--muted)]">tags: {submission.tagsCsv}</div> : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50" href={viewHref}>
                  View public
                </a>
                <a className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50" href={editHref}>
                  Edit form
                </a>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs text-[var(--muted)]">Author</div>
                <div className="mt-1 text-sm font-semibold text-[var(--text)]">{submission.authorDisplayName}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">{submission.contactEmail}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--muted)]">Timestamps</div>
                <div className="mt-1 text-sm text-[var(--muted)]">created: {fmt(submission.createdAt)}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">updated: {fmt(submission.updatedAt)}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">moderated: {fmt(submission.moderatedAt)}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">published: {fmt(submission.publishedAt)}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs text-[var(--muted)]">Source URL</div>
                <div className="mt-1 break-words text-sm text-[var(--text)]">{submission.sourceUrl || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--muted)]">ZIP URL</div>
                <div className="mt-1 break-words text-sm text-[var(--text)]">{submission.zipUrl || "—"}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 p-6">
            <div className="text-sm font-semibold text-[var(--text)]">Raw submission JSON</div>
            <pre className="mt-3 max-h-[520px] overflow-auto rounded-xl bg-slate-50 p-4 text-xs text-slate-700">
              {JSON.stringify(submission, null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-sm font-semibold text-[var(--text)]">Moderation</div>
            <div className="mt-3 text-xs text-[var(--muted)]">Current status</div>
            <div className="mt-1 text-sm font-semibold text-[var(--text)]">{status}</div>

            <div className="mt-4">
              <label className="text-xs text-[var(--muted)]">Set status</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"
                value={status}
                onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
              >
                <option value="draft">draft</option>
                <option value="submitted">submitted</option>
                <option value="approved">approved</option>
                <option value="needs_changes">needs_changes</option>
                <option value="rejected">rejected</option>
                <option value="published">published</option>
                <option value="unpublished">unpublished</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="text-xs text-[var(--muted)]">Reason (optional)</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                rows={4}
                placeholder="Why was this changed? (shown to the submitter in v2)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              {submission.moderationReason ? (
                <div className="mt-2 text-xs text-[var(--muted)]">last reason: {submission.moderationReason}</div>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                className="rounded-lg bg-[color:var(--coral-bright)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                onClick={() => void save()}
                disabled={saving}
                type="button"
              >
                Save
              </button>

              <button
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                onClick={() => void save("published")}
                disabled={saving}
                type="button"
              >
                Publish
              </button>

              <button
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                onClick={() => void save("unpublished")}
                disabled={saving}
                type="button"
              >
                Unpublish
              </button>
            </div>

            <div className="mt-3 text-xs text-[var(--muted)]">
              Note: public listing only surfaces <span className="font-semibold">published</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
