"use client";

import { CopyLineButton } from "@/components/CopyLineButton";

export function CodeBlock({
  title,
  code,
}: {
  title?: string;
  code: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="text-sm font-semibold text-[var(--text)]">{title ?? "Command"}</div>
        <CopyLineButton text={code} size="default" />
      </div>
      <pre className="m-0 overflow-x-auto px-4 py-4 text-xs leading-relaxed text-[var(--text)]">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
