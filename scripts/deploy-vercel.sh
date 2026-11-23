#!/usr/bin/env bash
# Deploy Marketplace Next.js to Vercel production.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Repo: $ROOT"
echo "Env template: .env.vercel.example"
echo "Set BACKEND_VERCEL_URL to the API *.vercel.app URL, then redeploy if needed."
echo "Guide: docs/vercel-deployment.md"
echo

if ! npx vercel whoami >/dev/null 2>&1; then
  echo "Not logged in. Run: npx vercel login" >&2
  exit 1
fi

npx vercel --prod --yes

echo
echo "Attach domain marketplace.devminds.net to THIS project (not the API project)."
echo "Site: https://marketplace.devminds.net"
