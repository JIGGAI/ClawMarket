"use client";

import { useState } from "react";

export function CopyLineButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="ml-3 inline-flex items-center rounded-md border border-[var(--border)] bg-white/60 px-2 py-1 text-[11px] font-semibold text-[var(--text)] shadow-sm hover:border-[color:var(--coral-bright)]"
      aria-label="Copy command"
      title="Copy"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
