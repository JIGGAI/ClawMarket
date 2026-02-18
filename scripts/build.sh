#!/usr/bin/env bash
set -euo pipefail

u="${DATABASE_URL:-}"
if [[ "$u" =~ ^postgres(ql)?:// ]]; then
  echo "[build] running prisma db push (sync schema to postgres)"
  npx prisma db push --accept-data-loss
  echo "[build] running prisma generate"
  npx prisma generate
else
  echo "[build] DATABASE_URL not postgres; skipping prisma db push/generate"
fi

echo "[build] running next build"
next build
