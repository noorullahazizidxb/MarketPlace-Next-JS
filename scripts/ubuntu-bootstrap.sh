#!/usr/bin/env bash
# Ubuntu packages for the Marketplace Next.js app.
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run with sudo." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl git build-essential nginx ufw

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

npm install -g pm2

echo
echo "Node $(node -v)  npm $(npm -v)"
echo "Next: clone app, copy .env.example → .env, npm ci, npm run build, bash scripts/ubuntu-run.sh"
echo "Guide: docs/ubuntu.md"
