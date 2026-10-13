# Vercel — Marketplace Next.js

Attach **`marketplace.devminds.net` only to this project**. The Express API is a second Vercel project; this app rewrites `/backend/:path*` to `BACKEND_VERCEL_URL`.

See the backend guide: `MarketPlace-Back-End-Node-Parisma/docs/vercel-deployment.md`.

## Env

Copy [`.env.vercel.example`](../.env.vercel.example):

- `NEXT_PUBLIC_API_BASE_URL=https://marketplace.devminds.net/backend/api`
- `NEXT_PUBLIC_APPEARANCE_PREVIEW_ORIGIN=https://<frontend-project>.vercel.app` (a separate origin for the anonymous appearance preview; no trailing slash)
- `BACKEND_VERCEL_URL=https://<api-project>.vercel.app` (no trailing slash)
- `NEXT_PUBLIC_SOCKET_IO_ENABLED=false`
- `NEXT_PUBLIC_ENABLE_ELASTIC_SEARCH=false`

## Deploy

```bash
bash scripts/deploy-vercel.sh
```

First time: `npx vercel login` then `npx vercel link`.
