# ClawMarket (clawkitchen.ai)

Next.js app for the ClawKitchen marketing site + marketplace (recipes + UGC submissions/moderation).

## Stack
- Next.js (App Router)
- Tailwind CSS

## Pages
- `/` — landing
- `/marketplace` — marketplace home
- `/marketplace/submit` — authenticated recipe submission
- `/marketplace/submissions` — “your submissions”
- `/admin/submissions` — moderation queue (requires `session.role=moderator|admin`)

## Local dev

1) Copy env:
```bash
cp .env.example .env
```

2) Install + run:
```bash
npm install
npm run dev
```

### Auth + admin seeding
- OAuth providers are enabled only if their `AUTH_*_ID` + `AUTH_*_SECRET` env vars are set.
- To test moderation, set:
  - `ADMIN_EMAILS="you@example.com"`
  - sign in with that same email (it will be auto-promoted to `role=admin` on sign-in).

## Build / lint

```bash
npm run lint
npm run build
```

Notes:
- `npm run build` runs `scripts/build.sh`.
- If `DATABASE_URL` is Postgres (`postgres://` / `postgresql://`), the build will run `prisma migrate deploy` (and `prisma generate`) before `next build`.

## Deploy (Vercel)

1) Push this repo to GitHub.
2) In Vercel: **New Project → Import** the repo.
3) Framework preset: **Next.js** (defaults are fine).

### Canonical URL (important for metadata/OG)

Set one of these in Vercel project env vars:

- `NEXT_PUBLIC_SITE_URL` (recommended; e.g. `https://clawcipes.dev`)

If `NEXT_PUBLIC_SITE_URL` is not set, the app will fall back to Vercel’s `VERCEL_URL` for preview deployments.

## Notes
- Marketplace UGC “published recipes” are sourced from the DB and merged into the public recipes API.
- Current UGC detail slugs are generated on submit and stored on `Submission.slug` (API also accepts legacy `id` during the migration window).

## Optional homepage metrics env vars
- `METRICS_GITHUB_REPO` (default: `JIGGAI/ClawRecipes`)
- `METRICS_NPM_PACKAGE` (default: `@jiggai/recipes`)
- `NEXT_PUBLIC_METRICS_COUNTRIES` (or `METRICS_COUNTRIES`) for the countries stat label/value
