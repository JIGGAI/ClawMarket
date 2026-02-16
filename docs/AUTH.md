# Auth (ClawMarket)

This site uses **Auth.js / NextAuth** on Next.js App Router.

## Local dev setup
1) Copy env template:
```bash
cp .env.example .env
```
2) Set at least:
- `DATABASE_URL="file:./dev.db"`
- `NEXTAUTH_SECRET` (random) (or `AUTH_SECRET`)
- `NEXTAUTH_URL="http://localhost:3000"` (or `AUTH_URL`)

3) Run migrations:
```bash
DATABASE_URL='file:./dev.db' npx prisma migrate dev
```

4) Start dev server:
```bash
npm run dev
```

## Providers
Providers are **enabled only if** their env vars are present.

- Google: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- GitHub: `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`
- Discord: `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`
- X/Twitter: `AUTH_TWITTER_ID`, `AUTH_TWITTER_SECRET`
- Email magic link: `AUTH_EMAIL_SERVER`, `AUTH_EMAIL_FROM`

## Roles
Roles are stored on the `User` record:
- `user` (default)
- `moderator`
- `admin`

Admin seeding:
- Set `ADMIN_EMAILS` to comma-separated emails.
- On sign-in, matching users are auto-promoted to `admin`.

## Server-side enforcement
Use helpers in `src/lib/require.ts`:
- `requireAuth()` (401)
- `requireRole("moderator"|"admin")` (403)

Example routes:
- `GET /api/me`
- `GET /api/admin/ping` (admin only)
- `GET|POST /api/marketplace/submissions` (auth + verified for submissions)
- `GET|POST /api/admin/submissions` (moderator/admin)

## Callback URLs
When configuring OAuth apps, use:
- Google: `http(s)://<host>/api/auth/callback/google`
- GitHub: `http(s)://<host>/api/auth/callback/github`
- Discord: `http(s)://<host>/api/auth/callback/discord`
- X/Twitter: `http(s)://<host>/api/auth/callback/twitter`
