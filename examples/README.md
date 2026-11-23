# Frontend env examples

Copy one file to the repo root as `.env`. The browser reads `NEXT_PUBLIC_*` at build time. Do not commit the copied `.env`.

- `local.env.example` — API at `http://localhost:4000/api`.
- `paid-vps.env.example` — API at `https://api.devminds.net/api`. Socket.IO on.
- `vercel-free.env.example` — same-domain rewrite `/backend/api`. Socket.IO off.
- `vercel-paid.env.example` — same public URLs as free, plus a reCAPTCHA site-key placeholder.
- `neon.env.example` — Neon is the backend database. This file only points the site at the API in front of that database.
- `turso.env.example` — Turso would be a backend database. This app has no database URL. The API still has to be one this frontend can call, and the backend cannot use Turso yet.
