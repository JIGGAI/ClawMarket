#!/usr/bin/env bash
set -euo pipefail

# Smoke test for UGC submission + moderation endpoints.
#
# Usage:
#   BASE_URL="http://localhost:3001" \
#   COOKIE='next-auth.session-token=...; other=...' \
#   ./scripts/smoke-ugc.sh
#
# Notes:
# - Requires an email-verified session (requireVerified()).
# - Moderator/admin endpoints additionally require role (requireRole()).
# - This script does NOT create a submission (would require a valid CAPTCHA token).

BASE_URL="${BASE_URL:-http://localhost:3000}"
COOKIE="${COOKIE:-}"
COOKIE_FILE="${COOKIE_FILE:-${HOME}/.openclaw/secrets/clawmarket-cookie.txt}"
SUBMISSION_ID="${SUBMISSION_ID:-}"

# Allow a local cookie file so you don't have to paste env vars every time.
# File should contain the full Cookie header value (single line), e.g.
#   next-auth.session-token=...; __Secure-next-auth.session-token=...; ...
if [[ -z "$COOKIE" && -f "$COOKIE_FILE" ]]; then
  COOKIE="$(cat "$COOKIE_FILE")"
fi

if [[ -z "$COOKIE" ]]; then
  echo "ERROR: COOKIE env var is required (paste your session cookie string)," >&2
  echo "       or create COOKIE_FILE at: $COOKIE_FILE" >&2
  exit 2
fi

hdr_cookie=( -H "Cookie: ${COOKIE}" )

say() { printf "\n==> %s\n" "$1"; }

say "GET /api/admin/submissions (moderator queue)"
resp=$(curl -sS "${BASE_URL}/api/admin/submissions" "${hdr_cookie[@]}" -H 'accept: application/json') || {
  echo "Request failed" >&2
  exit 1
}
echo "$resp" | head -c 2000
printf "\n"

ok=$(echo "$resp" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{try{const j=JSON.parse(s);process.stdout.write(String(!!j.ok))}catch{process.stdout.write("false")}})')
if [[ "$ok" != "true" ]]; then
  echo "ERROR: expected ok:true (check role/emailVerified/cookie)." >&2
  exit 1
fi

if [[ -z "$SUBMISSION_ID" ]]; then
  SUBMISSION_ID=$(echo "$resp" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s);const id=j.submissions?.[0]?.id||"";process.stdout.write(id)})')
fi

if [[ -z "$SUBMISSION_ID" ]]; then
  echo "No submissions found to moderate; set SUBMISSION_ID manually." >&2
  exit 0
fi

echo "Using SUBMISSION_ID=$SUBMISSION_ID"

say "POST /api/admin/submissions (set approved)"
curl -sS "${BASE_URL}/api/admin/submissions" "${hdr_cookie[@]}" \
  -H 'content-type: application/json' \
  -d "$(node -e 'console.log(JSON.stringify({id: process.env.SUBMISSION_ID, status: "approved"}))')" \
  | head -c 2000
printf "\n"

say "POST /api/admin/submissions (set published)"
curl -sS "${BASE_URL}/api/admin/submissions" "${hdr_cookie[@]}" \
  -H 'content-type: application/json' \
  -d "$(node -e 'console.log(JSON.stringify({id: process.env.SUBMISSION_ID, status: "published"}))')" \
  | head -c 2000
printf "\n"

say "GET /api/marketplace/recipes (ensure published appears)"
curl -sS "${BASE_URL}/api/marketplace/recipes" -H 'accept: application/json' | head -c 2000
printf "\n"

say "Done"
