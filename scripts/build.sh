#!/usr/bin/env bash
set -euo pipefail

u="${DATABASE_URL:-}"
if [[ "$u" =~ ^postgres(ql)?:// ]]; then
  echo "[build] running prisma migrate deploy"
  npx prisma migrate deploy
  echo "[build] running prisma generate"
  npx prisma generate
else
  echo "[build] DATABASE_URL not postgres; skipping prisma migrate/generate"
fi

echo "[build] running next build"
next build
