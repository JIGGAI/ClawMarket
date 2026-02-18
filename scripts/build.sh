#!/usr/bin/env bash
set -euo pipefail

u="${DATABASE_URL:-}"
if [[ "$u" =~ ^postgres(ql)?:// ]]; then
  echo "[build] running prisma db push (sync schema to postgres)"
  npx prisma db push --accept-data-loss
  echo "[build] running prisma generate"
  npx prisma generate
else
  echo "[build] DATABASE_URL not postgres; skipping prisma db push"
  # Still generate the Prisma client so Next build typechecks against the current schema.
  # Prisma validates DATABASE_URL protocol even for generate, so provide a harmless dummy URL.
  DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate
fi

echo "[build] running next build"
next build
