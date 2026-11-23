#!/usr/bin/env bash
# Start (or restart) Marketplace Next.js with PM2.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Create .env first (cp .env.example .env)." >&2
  exit 1
fi

if [[ ! -d .next ]]; then
  echo "No .next build. Running npm run build..."
  npm run build
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 not found. Run: sudo npm i -g pm2" >&2
  exit 1
fi

export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

if pm2 describe marketplace-web >/dev/null 2>&1; then
  pm2 restart marketplace-web --update-env
else
  pm2 start npm --name marketplace-web --time -- start
fi

pm2 save
pm2 status marketplace-web
echo "Local: http://127.0.0.1:${PORT}"
