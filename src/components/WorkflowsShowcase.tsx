"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type WorkflowSlide = {
  label: string;
  src: string;
  alt: string;
};

export function WorkflowsShowcase({ slides }: { slides: WorkflowSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (!slides.length) return null;
  const current = slides[Math.min(active, slides.length - 1)];

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[color:var(--card)] p-4 shadow-[var(--shadow)] lg:p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {slides.map((slide, idx) => (
          <button
            key={`${slide.label}-${idx}`}
            type="button"
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              idx === active
                ? "border-[color:var(--coral-bright)] bg-[color:color-mix(in_oklab,var(--coral-bright)_18%,transparent)] text-[color:var(--coral-bright)]"
                : "border-[var(--border)] bg-white/5 text-[var(--muted)] hover:bg-white/10"
            }`}
            onClick={() => setActive(idx)}
          >
            {slide.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0b111b]">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[#111927] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="inline-block size-2.5 rounded-full bg-[#febc2e]" />
            <span className="inline-block size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="text-xs font-medium text-slate-300">{current.label}</div>
          <div className="w-12" />
        </div>

        <div className="relative aspect-[16/10] w-full">
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
