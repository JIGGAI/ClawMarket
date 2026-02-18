"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/Modal";

export function UserSubmissionCard({
  id,
  title,
  createdAt,
  editable,
  children,
  onDeleted,
}: {
  id: string;
  title: string;
  createdAt: string;
  editable: boolean;
  children: React.ReactNode;
  onDeleted?: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/marketplace/submissions/${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || `Delete failed (${res.status})`);

      setConfirmOpen(false);
      onDeleted?.();
      // simplest: refresh list
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <Modal
        open={confirmOpen}
        title="Delete submission?"
        onClose={() => {
          if (!deleting) setConfirmOpen(false);
        }}
      >
        <p className="text-sm text-[var(--muted)]">
          This will permanently delete <span className="font-semibold text-[var(--text)]">{title}</span>.
        </p>
        {error ? <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
            onClick={() => setConfirmOpen(false)}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            onClick={() => void doDelete()}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Modal>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-semibold text-[var(--text)]">{title}</div>

        <div className="flex items-center gap-2">
          {editable ? (
            <Link
              className="rounded-lg bg-[color:var(--coral-bright)] px-3 py-1 text-xs font-semibold text-white hover:opacity-90"
              href={`/marketplace/submit?edit=${encodeURIComponent(id)}`}
            >
              Edit
            </Link>
          ) : null}
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-[var(--text)] hover:bg-slate-50"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </button>
          <div className="text-sm text-[var(--muted)]">{createdAt}</div>
        </div>
      </div>

      {children}
    </div>
  );
}
