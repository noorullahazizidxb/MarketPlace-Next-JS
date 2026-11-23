#!/usr/bin/env bash
# Build the Marketplace Next.js Docker image (standalone).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

IMAGE_TAG="${IMAGE_TAG:-marketplace-frontend:latest}"
API_BASE="${NEXT_PUBLIC_API_BASE_URL:-http://localhost:4000/api}"
SITE_KEY="${NEXT_PUBLIC_RECAPTCHA_SITE_KEY:-}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed." >&2
  exit 1
fi

docker build \
  --build-arg "NEXT_PUBLIC_API_BASE_URL=${API_BASE}" \
  --build-arg "NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${SITE_KEY}" \
  -t "${IMAGE_TAG}" \
  .

echo
echo "Built ${IMAGE_TAG}"
echo "Run: docker run --rm -p 3000:3000 ${IMAGE_TAG}"
echo "Guide: docs/docker.md"
