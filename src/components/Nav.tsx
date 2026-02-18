"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const docsUrl = "https://github.com/JIGGAI/ClawRecipes/tree/main/docs";
const githubUrl = "https://github.com/JIGGAI/ClawRecipes";
const xUrl = "https://x.com/clawrecipes";
const discordUrl = "https://discord.gg/BKGUkGTR";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M19.54 5.26A16.9 16.9 0 0 0 15.44 4c-.18.33-.39.78-.53 1.13a15.7 15.7 0 0 0-4.82 0c-.14-.35-.36-.8-.54-1.13A16.7 16.7 0 0 0 5.46 5.26C2.87 9.09 2.16 12.83 2.51 16.51c1.71 1.27 3.37 2.04 5 2.55.41-.55.78-1.15 1.07-1.79-.6-.23-1.17-.5-1.73-.82.14-.1.28-.21.41-.31 3.34 1.57 6.95 1.57 10.25 0 .14.11.27.22.41.31-.56.32-1.14.6-1.73.82.3.64.66 1.24 1.07 1.79 1.64-.51 3.29-1.28 5-2.55.41-4.27-.7-7.98-3.02-11.25ZM8.73 14.65c-.99 0-1.79-.91-1.79-2.02 0-1.12.8-2.03 1.79-2.03s1.8.91 1.79 2.03c0 1.11-.8 2.02-1.79 2.02Zm6.55 0c-.99 0-1.79-.91-1.79-2.02 0-1.12.8-2.03 1.79-2.03s1.8.91 1.79 2.03c0 1.11-.8 2.02-1.79 2.02Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 .5C5.73.5.75 5.64.75 12c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.26.79-.57v-2.02c-3.2.71-3.87-1.39-3.87-1.39-.52-1.36-1.28-1.72-1.28-1.72-1.05-.74.08-.73.08-.73 1.16.08 1.78 1.22 1.78 1.22 1.03 1.81 2.7 1.29 3.36.99.1-.77.4-1.29.72-1.59-2.55-.3-5.23-1.31-5.23-5.83 0-1.29.45-2.35 1.19-3.18-.12-.3-.52-1.52.11-3.17 0 0 .97-.32 3.18 1.21a10.7 10.7 0 0 1 2.9-.4c.98 0 1.97.14 2.9.4 2.21-1.53 3.18-1.21 3.18-1.21.63 1.65.23 2.87.11 3.17.74.83 1.19 1.89 1.19 3.18 0 4.53-2.69 5.53-5.25 5.82.41.36.78 1.08.78 2.18v3.23c0 .32.21.69.8.57A11.27 11.27 0 0 0 23.25 12C23.25 5.64 18.27.5 12 .5Z" />
    </svg>
  );
}

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
  const { data: session } = useSession();
  const pathname = usePathname();
  const callbackUrl = useMemo(() => {
    // Keep users on the current page after auth unless we're already on /login.
    if (!pathname || pathname.startsWith("/login")) return "/";
    return pathname;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-16">
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--text)]" onClick={() => setOpen(false)}>
          <span className="mr-1">🦞</span> ClawRecipes
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-base text-[var(--muted)] sm:flex">
          <Link
            className="rounded-lg bg-[color:var(--coral-bright)] px-4 py-2 text-base font-semibold text-white shadow-sm hover:brightness-95"
            href="/get-started"
          >
            Get Started
          </Link>
          <Link className="hover:text-[var(--text)]" href="/marketplace">
            Marketplace
          </Link>
          <a className="hover:text-[var(--text)]" href={docsUrl} target="_blank" rel="noreferrer">
            Docs
          </a>
          <div className="flex items-center gap-3">
            {session ? (
              <div className="relative" role="navigation" aria-label="User menu">
                <div className="group relative">
                  <button
                    type="button"
                    className="h-9 w-9 overflow-hidden rounded-full bg-slate-200"
                    aria-haspopup="menu"
                    aria-label="Open user menu"
                    title={session.user?.email ?? "Account"}
                  >
                    {session.user?.image ? (
                      // Using <img> intentionally for a tiny avatar; Next/Image adds layout constraints we don't need here.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700">
                        {(session.user?.email?.[0] ?? "U").toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Hover dropdown */}
                  <div
                    className="invisible absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg opacity-0 transition group-hover:visible group-hover:opacity-100"
                    role="menu"
                  >
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm text-[var(--text)] hover:bg-slate-50"
                      role="menuitem"
                      onClick={() => {
                        window.location.href = "/user";
                      }}
                    >
                      <div className="truncate font-semibold">{session.user?.name ?? session.user?.email ?? "Account"}</div>
                      <div className="truncate text-xs text-[var(--muted)]">{session.user?.email ?? ""}</div>
                    </button>
                    <div className="my-2 h-px w-full bg-slate-100" />
                    <Link className="block px-4 py-2 text-sm text-[var(--text)] hover:bg-slate-50" role="menuitem" href="/marketplace/submit">
                      Submit recipe
                    </Link>
                    <Link className="block px-4 py-2 text-sm text-[var(--text)] hover:bg-slate-50" role="menuitem" href="/marketplace/submissions">
                      My recipes
                    </Link>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm font-semibold text-[var(--text)] hover:bg-slate-50"
                      role="menuitem"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                className="rounded-full bg-[color:var(--coral-bright)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-95"
                href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              >
                Login
              </Link>
            )}

            <a
              className="inline-flex items-center justify-center px-3 py-2 text-[var(--text)] hover:text-black"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="ClawRecipes on GitHub"
              title="GitHub"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a
              className="inline-flex items-center justify-center px-3 py-2 text-[var(--text)] hover:text-black"
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="ClawRecipes on X"
              title="@clawrecipes on X"
            >
              <XIcon className="h-4 w-4" />
            </a>
            <a
              className="inline-flex items-center justify-center px-3 py-2 text-[var(--text)] hover:text-black"
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="ClawRecipes on Discord"
              title="Discord"
            >
              <DiscordIcon className="h-5 w-5" />
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
                <Link
                  className="rounded-lg bg-[color:var(--coral-bright)] px-3 py-2 font-semibold text-white hover:brightness-95"
                  href="/get-started"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
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

                {session ? (
                  <>
                    <Link
                      className="rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-[var(--text)]"
                      href="/user"
                      onClick={() => setOpen(false)}
                    >
                      {session.user?.email ?? "Account"}
                    </Link>
                    <Link
                      className="rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-[var(--text)]"
                      href="/marketplace/submit"
                      onClick={() => setOpen(false)}
                    >
                      Submit recipe
                    </Link>
                    <Link
                      className="rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-[var(--text)]"
                      href="/marketplace/submissions"
                      onClick={() => setOpen(false)}
                    >
                      My recipes
                    </Link>
                    <button
                      className="rounded-lg px-3 py-2 text-left font-semibold hover:bg-slate-50 hover:text-[var(--text)]"
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    className="rounded-lg px-3 py-2 font-semibold hover:bg-slate-50 hover:text-[var(--text)]"
                    href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                )}

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
