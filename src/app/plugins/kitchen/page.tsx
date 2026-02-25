"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CodeBlock } from "@/components/plugins/CodeBlock";
import { ImageModal } from "@/components/plugins/ImageModal";

// metadata export removed because this page is a client component (uses modal state).

const screenshots = Array.from({ length: 8 }).map((_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/images/plugins/kitchen/kitchen-${n}.jpg`,
    alt: `Kitchen plugin screenshot ${n}`,
  };
});

export default function KitchenPluginPage() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text)]">Kitchen Plugin</h1>
              <p className="mt-2 text-[var(--muted)]">
                UI for managing teams, agents, recipes, tickets, and workflows.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/marketplace">
                Marketplace
              </Link>
              <Link className="rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50" href="/plugins/recipes">
                Recipes Plugin
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <CodeBlock title="Quick Start (OpenClaw)" code="openclaw plugins install @jiggai/kitchen" />
            <CodeBlock title="Quick Start (npm)" code="npm i -g @jiggai/kitchen" />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-lg font-semibold text-[var(--text)]">What it does</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
                <li>Manage workspaces, tickets, and team structure.</li>
                <li>Edit agents and configs from a web UI.</li>
                <li>Run common workflows with copy/paste commands.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-lg font-semibold text-[var(--text)]">Links</div>
              <div className="mt-3 space-y-2 text-sm">
                <a className="block text-[color:var(--coral-bright)] underline" href="https://github.com/JIGGAI/ClawKitchen" target="_blank" rel="noreferrer">
                  GitHub: JIGGAI/ClawKitchen
                </a>
                <a className="block text-[color:var(--coral-bright)] underline" href="https://github.com/JIGGAI/ClawKitchen/tree/main/docs" target="_blank" rel="noreferrer">
                  Docs: github.com/JIGGAI/ClawKitchen/docs
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-lg font-semibold text-[var(--text)]">Screenshots</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {screenshots.map((s) => (
                <button
                  key={s.src}
                  type="button"
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white text-left hover:opacity-95"
                  onClick={() => {
                    const idx = screenshots.findIndex((x) => x.src === s.src);
                    setActiveIndex(Math.max(0, idx));
                    setOpen(true);
                  }}
                >
                  <Image src={s.src} alt={s.alt} width={1200} height={750} className="h-auto w-full" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <ImageModal
          open={open}
          items={screenshots}
          index={activeIndex}
          onChangeIndex={setActiveIndex}
          onClose={() => setOpen(false)}
        />
      </div>
    </main>
  );
}
