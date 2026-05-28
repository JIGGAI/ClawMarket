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
      ? "inline-flex min-w-[5.25rem] items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition"
      : "inline-flex min-w-[4.25rem] items-center justify-center rounded-md border px-2 py-1 text-[11px] font-semibold shadow-sm transition";
  const state = copied
    ? "border-emerald-400/70 bg-emerald-400/20 text-emerald-100"
    : "border-[var(--border)] bg-white/10 text-[var(--text)] hover:border-[color:var(--coral-bright)] hover:bg-white/15";

  return (
    <button
      type="button"
      onClick={onCopy}
      className={[base, state, className].filter(Boolean).join(" ")}
      aria-label={copied ? "Copied" : ariaLabel}
      title={copied ? "Copied" : title}
      aria-live="polite"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}
