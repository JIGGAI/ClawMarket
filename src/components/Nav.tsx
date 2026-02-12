import Link from "next/link";

const docsUrl = "https://docs.openclaw.ai";
const githubUrl = "https://github.com/rjdjohnston/clawcipes";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Clawcipes
        </Link>

        <nav className="flex items-center gap-4 text-sm text-white/80">
          <Link className="hover:text-white" href="/marketplace">
            Marketplace
          </Link>
          <a className="hover:text-white" href={docsUrl} target="_blank" rel="noreferrer">
            Docs
          </a>
          <a className="hover:text-white" href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <div className="ml-2 flex items-center gap-2">
            <a
              className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/90 hover:bg-white/10"
              href="#"
            >
              Signup
            </a>
            <a
              className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/90 hover:bg-white/10"
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
