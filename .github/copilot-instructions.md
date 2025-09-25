## Quick orientation — what this repo is

- Next.js 14 App Router + TypeScript + Tailwind starter focused on a marketplace UI (see `README.md`).
- Key runtime pieces: client-side React (many `"use client"` files), server-side helpers under `src/app/api` and `src/lib/session.ts` (marked `"use server"`).

## High-level architecture (read these files together)

- Root layout and app shell: `src/app/layout.tsx`, `src/components/app-shell.tsx` — this wires `ThemeProvider`, `QueryProvider`, and shared UI.
- Data layer: `src/lib/axiosClient.ts` (axios setup + global unwrap), `src/lib/api-hooks.ts` (SWR helpers) and `src/components/query-provider.tsx` (React Query client bootstrap).
- Auth/session: client helpers `src/lib/auth.ts`, client hook `src/lib/use-auth.ts`, server session encryption in `src/lib/session.ts`, and persistent zustand store `src/store/auth.store.ts`.
- Theme system: `src/lib/theme.ts` and `theme/presets.json` — remote themes are fetched and applied on boot (see ThemeBootstrap in `query-provider.tsx`).

When changing cross-cutting behavior (auth, API envelope, theme tokens), update both client and server helpers above.

## Project-specific conventions & gotchas

- API envelope: backend responses commonly use { message, statusCode, success, data }. The axios helper in `src/lib/axiosClient.ts` unwraps `data` automatically — prefer `api.get('/path')` (from that file) when writing client code.
  - Example: `const listings = await api.get('/listings')` returns the inner `data` not the envelope.
- Token flow: token is fetched from `/api/session-token` and `/api/session-info` (see `src/lib/use-auth.ts`), then passed to axios via `setCachedToken()` in `src/lib/axiosClient.ts`. Do not directly read cookies for Authorization on the client.
- Server session: `src/lib/session.ts` encrypts session into `mp_session` cookie (cookie name and encryption key come from `SESSION_SECRET` / `NEXT_PUBLIC_SESSION_SECRET`). Modifying names/algorithms requires updating both server and any client expectations.
- zustand persistence: stores (e.g. `auth-store`) use `persist` with a store name — changing the key will reset user state for developers.
- Client vs server files: files with `"use client"` must not import server-only APIs (like `cookies()` or Next server modules). Conversely, server files should avoid client-only modules.

## Typical dev tasks and exact commands

- Install and run dev server (dev wrapper loads `.env` before starting Next):

  npm install
  npm run dev # uses scripts/dev.js which reads .env then runs `next dev`

- Build & start for production:

  npm run build
  npm start

- Troubleshooting stuck builds (from README): clear .next and free ports

  npx kill-port 3000 3010 || true
  rimraf .next
  npm run build && npm start

- REST testing: repo mentions a rest-client file (use VS Code REST Client) — see `README.md` for `rest-client/marketplace.http` if present.

## What to look for when editing code

- If you change API shape, update `src/lib/axiosClient.ts` unwrap() and any call-sites that expect unwrapped data.
- If you touch auth/session:
  - Keep `mp_session` encryption/decryption logic in `src/lib/session.ts` and ensure `SESSION_SECRET` env is respected.
  - `use-auth.ts` relies on `/api/session-token` and `/api/session-info` endpoints — update those routes if you rename them.
- Theme changes: `QueryProvider` prefetches themes and applies tokens via `applyThemeTokens`/`applyThemeScales` — respect the 5s timeout pattern there to avoid blocking app readiness.
- React Query defaults are defined in `src/components/query-provider.tsx` (retry=1, staleTime=30s). If increasing refetches or retries, edit the QueryClient here.

## Useful code snippets (copyable patterns from the repo)

- Call API (returns data directly):

  const listings = await api.get('/listings');

- Set cached token for axios (used by `useAuth`):

  import { setCachedToken } from '@/lib/axiosClient';
  setCachedToken(token);

- Read server session (server-side helpers in `src/lib/session.ts`):

  // getSession / setSession are server functions that operate on HttpOnly cookies

## Cross-team/agent responsibilities

- Small changes (UI tweaks, isolated components): edit under `src/components` and run dev.
- Shared infra (auth, axios envelope, session cookie, theme tokens): coordinate changes across `src/lib/*`, `src/app/api/*`, and `src/components/query-provider.tsx`.

## Where to start for common tasks

- Add a new API call: use `api.get/post` in client files to get unwrapped result and add an endpoint under `src/app/api/*/route.ts` if server-side.
- Debugging auth: inspect `mp_session` cookie and `auth-store` persisted key (`auth-store`) in localStorage during dev; confirm `/api/session-token` returns a token.

## If something is unclear

- Ask for the specific area you want to change (auth, API envelope, themes, or stores). Point to the files you intend to edit and I'll highlight all other files that must be updated.

---

Please review and tell me if you'd like more examples (tests, component patterns, or API route templates) added.
