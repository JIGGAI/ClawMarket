"use client";

import { useState } from "react";
import { badgeClass, uiStatusLabel } from "@/lib/submission-ui";
import { UserSubmissionCard } from "@/components/marketplace/UserSubmissionCard";

type Submission = {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  status: string;
  sourceUrl: string | null;
  bodyMd: string | null;
  createdAt: string;
};

export default function SubmissionsClient({ submissions }: { submissions: Submission[] }) {
  const [items, setItems] = useState(submissions);

  return (
    <div className="mt-8 space-y-4">
      {items.map((s) => {
        const editable = s.status === "draft" || s.status === "submitted" || s.status === "needs_changes";
        const createdAt = new Date(s.createdAt).toISOString().replace("T", " ").slice(0, 16);
        const u = uiStatusLabel(String(s.status));

        return (
          <UserSubmissionCard
            key={s.id}
            id={s.id}
            title={s.title}
            createdAt={createdAt}
            editable={editable}
            onDeleted={() => setItems((prev) => prev.filter((x) => x.id !== s.id))}
          >
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-[var(--muted)]">Status:</span>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClass(u.tone)}`}>{u.label}</span>
            </div>

            <div className="mt-3 text-[var(--muted)]">{s.description}</div>

            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {s.sourceUrl ? (
                <a className="text-[color:var(--coral-bright)] underline break-all" href={s.sourceUrl} target="_blank" rel="noreferrer">
                  Source URL
                </a>
              ) : null}
              {s.bodyMd ? (
                <a className="text-[color:var(--coral-bright)] underline" href={`/api/marketplace/recipes/${encodeURIComponent(s.slug ?? s.id)}/body`} target="_blank" rel="noreferrer">
                  Recipe body
                </a>
              ) : null}
            </div>
          </UserSubmissionCard>
        );
      })}

      {!items.length ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[var(--muted)]">No submissions yet.</div>
      ) : null}
    </div>
  );
}
