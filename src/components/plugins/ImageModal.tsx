"use client";

import Image from "next/image";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export type ModalImageItem = { src: string; alt: string };

export function ImageModal({
  open,
  items,
  index,
  onClose,
  onChangeIndex,
}: {
  open: boolean;
  items: ModalImageItem[];
  index: number;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
}) {
  const safeItems = items.length ? items : [{ src: "", alt: "" }];
  const i = Math.min(Math.max(0, index), safeItems.length - 1);
  const active = safeItems[i];
  const canPrev = i > 0;
  const canNext = i < safeItems.length - 1;

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && canPrev) onChangeIndex(i - 1);
      if (e.key === "ArrowRight" && canNext) onChangeIndex(i + 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, onChangeIndex, i, canPrev, canNext]);

  if (!open) return null;

  const node = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-2xl bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 truncate text-sm font-semibold text-[var(--text)]">{active.alt}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
              onClick={() => (canPrev ? onChangeIndex(i - 1) : null)}
              disabled={!canPrev}
            >
              ← Prev
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
              onClick={() => (canNext ? onChangeIndex(i + 1) : null)}
              disabled={!canNext}
            >
              Next →
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          {/* Full-screen friendly: keep the image centered and contained */}
          <div className="relative flex h-[75vh] w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50">
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          <div className="mt-2 text-xs text-[var(--muted)]">
            {i + 1} / {safeItems.length}
          </div>
        </div>
      </div>
    </div>
  );

  // Anchor to <body> so layout/section containers can't clip or stack modals.
  return createPortal(node, document.body);

}
