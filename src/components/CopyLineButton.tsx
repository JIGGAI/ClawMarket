"use client";

import { useState } from "react";

type CopyLineButtonProps = {
  text: string;
  size?: "compact" | "default";
  className?: string;
  ariaLabel?: string;
  title?: string;
};

export function CopyLineButton({
  text,
  size = "compact",
  className,
  ariaLabel = "Copy",
  title = "Copy",
}: CopyLineButtonProps) {
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

  const base =
    size === "default"
      ? "inline-flex items-center rounded-lg border border-[var(--border)] bg-white/5 px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[color:var(--coral-bright)] hover:bg-white/10"
      : "inline-flex items-center rounded-md border border-[var(--border)] bg-white/10 px-2 py-1 text-[11px] font-semibold text-[var(--text)] shadow-sm transition hover:border-[color:var(--coral-bright)] hover:bg-white/15";

  return (
    <button
      type="button"
      onClick={onCopy}
      className={[base, className].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
      title={title}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
