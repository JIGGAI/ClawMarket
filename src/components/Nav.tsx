import Link from "next/link";

const docsUrl = "https://docs.openclaw.ai";
const githubUrl = "https://github.com/rjdjohnston/clawcipes";
const xUrl = "https://x.com/clawcipes";

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

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-16">
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--text)]">
          <span className="mr-1">🦞</span> ClawRecipes
        </Link>

        <nav className="flex items-center gap-6 text-base text-[var(--muted)]">
          <Link className="hover:text-[var(--text)]" href="/marketplace">
            Marketplace
          </Link>
          <a className="hover:text-[var(--text)]" href={docsUrl} target="_blank" rel="noreferrer">
            Docs
          </a>
          <a
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-[var(--text)] shadow-sm hover:bg-slate-50"
            href={xUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="ClawRecipes on X"
            title="@clawcipes on X"
          >
            <XIcon className="h-4 w-4" />
          </a>
          <div className="flex items-center gap-3">
            <a className="hover:text-[var(--text)]" href="#signup">
              Signup
            </a>
            <a className="hover:text-[var(--text)]" href="#login">
              Login
            </a>
            <a
              className="rounded-lg bg-[color:var(--coral-bright)] px-4 py-2 text-base font-semibold text-white shadow-sm hover:brightness-95"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
