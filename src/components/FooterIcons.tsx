const githubUrl = "https://github.com/JIGGAI/ClawRecipes";
const xUrl = "https://x.com/clawrecipes";
const discordUrl = "https://discord.gg/BKGUkGTR";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2H21.62l-7.38 8.437L22.922 22h-6.87l-5.38-7.01L4.54 22H1.16l7.894-9.02L1 2h7.04l4.86 6.41L18.244 2Zm-1.205 18h1.87L6.98 3.9H4.98l12.06 16.1Z" />
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

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M19.54 5.26A16.9 16.9 0 0 0 15.44 4c-.18.33-.39.78-.53 1.13a15.7 15.7 0 0 0-4.82 0c-.14-.35-.36-.8-.54-1.13A16.7 16.7 0 0 0 5.46 5.26C2.87 9.09 2.16 12.83 2.51 16.51c1.71 1.27 3.37 2.04 5 2.55.41-.55.78-1.15 1.07-1.79-.6-.23-1.17-.5-1.73-.82.14-.1.28-.21.41-.31 3.34 1.57 6.95 1.57 10.25 0 .14.11.27.22.41.31-.56.32-1.14.6-1.73.82.3.64.66 1.24 1.07 1.79 1.64-.51 3.29-1.28 5-2.55.41-4.27-.7-7.98-3.02-11.25ZM8.73 14.65c-.99 0-1.79-.91-1.79-2.02 0-1.12.8-2.03 1.79-2.03s1.8.91 1.79 2.03c0 1.11-.8 2.02-1.79 2.02Zm6.55 0c-.99 0-1.79-.91-1.79-2.02 0-1.12.8-2.03 1.79-2.03s1.8.91 1.79 2.03c0 1.11-.8 2.02-1.79 2.02Z" />
    </svg>
  );
}

export function FooterIcons() {
  const iconCls = "h-5 w-5";
  const aCls = "inline-flex items-center justify-center p-2 text-[var(--muted)] hover:text-[var(--text)]";

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <a className={aCls} href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
        <GitHubIcon className={iconCls} />
      </a>
      <a className={aCls} href={xUrl} target="_blank" rel="noreferrer" aria-label="X" title="X">
        <XIcon className={iconCls} />
      </a>
      <a className={aCls} href={discordUrl} target="_blank" rel="noreferrer" aria-label="Discord" title="Discord">
        <DiscordIcon className={iconCls} />
      </a>
    </div>
  );
}
