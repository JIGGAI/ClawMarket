"use client";

import Image from "next/image";

import type { ModalImageItem } from "@/components/plugins/ImageModal";
import { useModalGallery } from "@/components/ModalGalleryProvider";

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
  const { openGallery } = useModalGallery();

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
            className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color:var(--card)] text-left transition hover:bg-white/5"
            onClick={() => openGallery({ items, index: idx })}
          >
            {/* Standardize thumbnails: fixed aspect ratio + cover to avoid white bars */}
            <div className="relative aspect-[16/10] w-full bg-[color:var(--bg-soft)]">
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
