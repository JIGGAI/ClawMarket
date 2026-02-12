import Link from "next/link";

const docsUrl = "https://docs.openclaw.ai";
const githubUrl = "https://github.com/rjdjohnston/clawcipes";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight text-[var(--text)]">
          Clawcipes
        </Link>

        <nav className="flex items-center gap-4 text-sm text-[var(--muted)]">
          <Link className="hover:text-[var(--text)]" href="/marketplace">
            Marketplace
          </Link>
          <a className="hover:text-[var(--text)]" href={docsUrl} target="_blank" rel="noreferrer">
            Docs
          </a>
          <a className="hover:text-[var(--text)]" href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <div className="ml-2 flex items-center gap-2">
            <a
              className="rounded-md border border-[var(--border)] bg-white/60 px-3 py-2 text-xs text-[var(--text)] shadow-sm hover:bg-white"
              href="#"
            >
              Signup
            </a>
            <a
              className="rounded-md border border-[var(--border)] bg-white/60 px-3 py-2 text-xs text-[var(--text)] shadow-sm hover:bg-white"
              href="#"
            >
              Login
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
