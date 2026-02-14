"use client";

import Link from "next/link";
import { useState } from "react";

const docsUrl = "https://docs.openclaw.ai";
const githubUrl = "https://github.com/JIGGAI/ClawRecipes";
const xUrl = "https://x.com/clawrecipes";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2H21.62l-7.38 8.437L22.922 22h-6.87l-5.38-7.01L4.54 22H1.16l7.894-9.02L1 2h7.04l4.86 6.41L18.244 2Zm-1.205 18h1.87L6.98 3.9H4.98l12.06 16.1Z" />
    </svg>
  );
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-16">
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--text)]" onClick={() => setOpen(false)}>
          <span className="mr-1">🦞</span> ClawRecipes
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-base text-[var(--muted)] sm:flex">
          <Link className="hover:text-[var(--text)]" href="/marketplace">
            Marketplace
          </Link>
          <a className="hover:text-[var(--text)]" href={docsUrl} target="_blank" rel="noreferrer">
            Docs
          </a>
          <div className="flex items-center gap-2">
            <a
              className="rounded-lg bg-[color:var(--coral-bright)] px-4 py-2 text-base font-semibold text-white shadow-sm hover:brightness-95"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[var(--text)] shadow-sm hover:bg-slate-50"
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="ClawRecipes on X"
              title="@clawrecipes on X"
            >
              <XIcon className="h-4 w-4" />
            </a>
          </div>
        </nav>

        {/* Mobile */}
        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-[var(--text)] shadow-sm hover:bg-slate-50"
            aria-label={open ? "Close menu" : "Open menu"}
            title={open ? "Close menu" : "Open menu"}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <HamburgerIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="sm:hidden">
          <div className="mx-auto max-w-7xl px-6 pb-4 lg:px-16">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex flex-col gap-2 text-base text-[var(--muted)]">
                <Link className="rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-[var(--text)]" href="/marketplace" onClick={() => setOpen(false)}>
                  Marketplace
                </Link>
                <a
                  className="rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-[var(--text)]"
                  href={docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                >
                  Docs
                </a>
                <div className="my-2 h-px w-full bg-slate-100" />
                <a
                  className="inline-flex items-center justify-center rounded-lg bg-[color:var(--coral-bright)] px-4 py-2 text-base font-semibold text-white shadow-sm hover:brightness-95"
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                >
                  GitHub
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-[var(--text)] shadow-sm hover:bg-slate-50"
                  href={xUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                >
                  X
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
