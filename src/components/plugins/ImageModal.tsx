"use client";

import Image from "next/image";

export function ImageModal({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
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
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0 truncate text-sm font-semibold text-[var(--text)]">{alt}</div>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="relative w-full">
          <Image
            src={src}
            alt={alt}
            width={2400}
            height={1500}
            className="h-auto w-full rounded-xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
