# Clawcipes Site (MVP)

Marketing site + Marketplace landing for **Clawcipes** (OpenClaw recipes plugin).

## Local dev

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Deploy (Vercel)

1) Create a new Vercel project from this repo/folder.
2) Framework preset: Next.js.
3) Build command: `npm run build`
4) Output: default

After deploy, update `metadataBase` in `src/app/layout.tsx` to your real domain.

## Links
- Docs: https://docs.openclaw.ai
- GitHub: https://github.com/rjdjohnston/clawcipes
