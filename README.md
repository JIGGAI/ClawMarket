# Clawcipes Site (MVP)

Public marketing site for **Clawcipes** (OpenClaw Recipes plugin).

## Stack
- Next.js (App Router)
- Tailwind CSS

## Pages
- `/` — landing (positioning + features + CTA)
- `/marketplace` — marketplace landing (featured recipes; static data OK for MVP)

## Local dev

```bash
npm install
npm run dev
```

## Build / lint

```bash
npm run lint
npm run build
```

## Deploy (Vercel)

1) Push this repo to GitHub.
2) In Vercel: **New Project → Import** the repo.
3) Framework preset: **Next.js** (defaults are fine).

### Canonical URL (important for metadata/OG)

Set one of these in Vercel project env vars:

- `NEXT_PUBLIC_SITE_URL` (recommended; e.g. `https://clawcipes.dev`)

If `NEXT_PUBLIC_SITE_URL` is not set, the app will fall back to Vercel’s `VERCEL_URL` for preview deployments.

## Notes
- “Signup/Login” is intentionally a placeholder link for MVP (no auth in scope).
