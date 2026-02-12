import Link from "next/link";

const githubUrl = "https://github.com/rjdjohnston/clawcipes";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-16">
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--text)]">
          <span className="mr-1">🦞</span> Clawcipes
        </Link>

        <nav className="flex items-center gap-6 text-base text-[var(--muted)]">
          <Link className="hover:text-[var(--text)]" href="/marketplace">
            Marketplace
          </Link>
          <Link className="hover:text-[var(--text)]" href="/docs">
            Docs
          </Link>
          <a
            className="rounded-lg bg-[color:var(--coral-bright)] px-4 py-2 text-base font-semibold text-white shadow-sm hover:brightness-95"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
