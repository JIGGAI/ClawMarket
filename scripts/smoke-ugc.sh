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
# - If no submissions exist, the script will create a *draft* submission first
#   (drafts do NOT require CAPTCHA), then moderate/publish it.

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

read_ok() {
  node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{try{const j=JSON.parse(s);process.stdout.write(String(!!j.ok))}catch{process.stdout.write("false")}})'
}

read_first_id() {
  node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s);const id=j.submissions?.[0]?.id||"";process.stdout.write(id)})'
}

read_created_id() {
  node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s);const id=j.submission?.id||"";process.stdout.write(id)})'
}

read_recipe_has_submission() {
  node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{try{const j=JSON.parse(s);const id=process.env.SUBMISSION_ID;const items=j.recipes||j.items||[];const found=items.some(r=>r.submissionId===id||r.submission?.id===id||r.id===id);process.stdout.write(found?"true":"false");}catch{process.stdout.write("false")}})'
}

say "GET /api/admin/submissions (moderator queue)"
resp=$(curl -sS "${BASE_URL}/api/admin/submissions" "${hdr_cookie[@]}" -H 'accept: application/json') || {
  echo "Request failed" >&2
  exit 1
}
echo "$resp" | head -c 2000
printf "\n"

ok=$(echo "$resp" | read_ok)
if [[ "$ok" != "true" ]]; then
  echo "ERROR: expected ok:true (check role/emailVerified/cookie)." >&2
  exit 1
fi

if [[ -z "$SUBMISSION_ID" ]]; then
  SUBMISSION_ID=$(echo "$resp" | read_first_id)
fi

if [[ -z "$SUBMISSION_ID" ]]; then
  say "No submissions found — creating a draft submission (no CAPTCHA)"

  # Draft submissions only require a title client-side, and do not require CAPTCHA.
  # This gives us a real DB row to moderate/publish.
  draft_title="Smoke test submission $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  create_resp=$(curl -sS "${BASE_URL}/api/marketplace/submissions" "${hdr_cookie[@]}" \
    -H 'content-type: application/json' \
    -H 'accept: application/json' \
    -d "$(draft_title="$draft_title" node -e 'console.log(JSON.stringify({title: process.env.draft_title, description: "", tags: [], authorDisplayName: "", contactEmail: "", draft: true}))')" \
  )

  echo "$create_resp" | head -c 2000
  printf "\n"

  create_ok=$(echo "$create_resp" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{try{const j=JSON.parse(s);process.stdout.write(String(!!j.ok))}catch{process.stdout.write("false")}})')
  if [[ "$create_ok" != "true" ]]; then
    echo "ERROR: failed to create a draft submission." >&2
    exit 1
  fi

  SUBMISSION_ID=$(echo "$create_resp" | read_created_id)
fi

if [[ -z "$SUBMISSION_ID" ]]; then
  echo "ERROR: could not determine SUBMISSION_ID." >&2
  exit 1
fi

echo "Using SUBMISSION_ID=$SUBMISSION_ID"
export SUBMISSION_ID

say "POST /api/admin/submissions (set approved)"
curl -sS "${BASE_URL}/api/admin/submissions" "${hdr_cookie[@]}" \
  -H 'content-type: application/json' \
  -H 'accept: application/json' \
  -d "$(node -e 'console.log(JSON.stringify({id: process.env.SUBMISSION_ID, status: "approved"}))')" \
  | head -c 2000
printf "\n"

say "POST /api/admin/submissions (set published)"
curl -sS "${BASE_URL}/api/admin/submissions" "${hdr_cookie[@]}" \
  -H 'content-type: application/json' \
  -H 'accept: application/json' \
  -d "$(node -e 'console.log(JSON.stringify({id: process.env.SUBMISSION_ID, status: "published"}))')" \
  | head -c 2000
printf "\n"

say "GET /api/marketplace/recipes (ensure published appears)"
recipes_resp=$(curl -sS "${BASE_URL}/api/marketplace/recipes" -H 'accept: application/json')
echo "$recipes_resp" | head -c 2000
printf "\n"

found=$(echo "$recipes_resp" | read_recipe_has_submission)
if [[ "$found" != "true" ]]; then
  echo "ERROR: expected published submission to appear in /api/marketplace/recipes." >&2
  exit 1
fi

echo "OK: published submission is visible in the public list"

say "Done"