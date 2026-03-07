"use client";

import Image from "next/image";
import { useState } from "react";

import { ImageModal, type ModalImageItem } from "@/components/plugins/ImageModal";

export function ScreenshotGrid({
  title,
  subtitle,
  items,
  columns = "3",
}: {
  title?: string;
  subtitle?: string;
  items: ModalImageItem[];
  columns?: "2" | "3" | "4";
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const gridCols =
    columns === "2"
      ? "sm:grid-cols-2"
      : columns === "4"
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div>
      {title ? <div className="text-lg font-semibold text-[var(--text)]">{title}</div> : null}
      {subtitle ? <div className="mt-2 text-sm text-[var(--muted)]">{subtitle}</div> : null}

      <div className={`mt-4 grid gap-4 ${gridCols}`}>
        {items.map((s, idx) => (
          <button
            key={s.src}
            type="button"
            className="overflow-hidden rounded-xl border border-slate-200 bg-white text-left hover:opacity-95"
            onClick={() => {
              setActiveIndex(idx);
              setOpen(true);
            }}
          >
            <Image src={s.src} alt={s.alt} width={1200} height={750} className="h-auto w-full" />
          </button>
        ))}
      </div>

      <ImageModal
        open={open}
        items={items}
        index={activeIndex}
        onChangeIndex={setActiveIndex}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
