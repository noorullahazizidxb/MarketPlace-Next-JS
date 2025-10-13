# Copilot instructions for this repo

These notes teach AI coding agents how to be productive in this codebase quickly. Keep answers concrete and reference files that demonstrate patterns.

## Stack and run workflows

- App Router Next.js 14 + TypeScript, TailwindCSS, framer-motion, zustand, SWR + React Query, axios.
- Dev server loads .env first via `scripts/dev.js` then runs Next: `npm run dev`. Build/start: `npm run build` and `npm start` (see `package.json`).
- If stale assets cause issues, the README suggests: kill ports 3000/3010 and clear `.next` before build.

## High-level architecture

- Composition root: `src/app/layout.tsx` wraps children with providers: `ThemeProvider`, `QueryProvider`, `LanguageProvider`, `AppShell`, and global toaster/skip link.
- App chrome and auth gating live in `src/components/layout/app-shell.tsx`:
  - Determines public vs protected routes; redirects unauthenticated users from protected pages to `/sign-in`.
  - Renders Admin layout (Sidebar + Navbar) if `useAuth().isAdmin`, otherwise Topbar layout. Hides chrome entirely on auth pages.
  - Uses `useAppStore().appReady` (theme bootstrap) to decide when to render animated background, partners, footer, etc., and shows skeletons while bootstrapping.

## Data fetching patterns

- Axios client: `src/lib/axiosClient.ts`
  - Base URL: `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:3002/api`).
  - Unwraps backend envelopes `{ message, statusCode, success, entity, data }` and returns `data` when present.
  - Attaches `Authorization: Bearer <token>` from the persisted auth store or `setCachedToken()`.
- Hooks: `src/lib/api-hooks.ts`
  - GETs use SWR wrappers: `useSWRGet(url)` for external API; `useLocalGet(url)` and `useLocalGetImmutable(url)` for Next internal `/api/*` endpoints.
  - Mutations use React Query: `useApiMutation(method, url)` and `useLocalMutation(method, url)`.
  - Toasts: success toasts derive from `entity` where possible; noisy endpoints are filtered (see code) to avoid spam.

## Auth and session

- Client auth facade: `src/lib/use-auth.ts` hydrates session on the client using internal endpoints:
  - `/api/session-token` → token, `/api/session-info` → minimal user snapshot. Both are defined under `src/app/api/*` and backed by `src/lib/session.ts`.
  - Session is persisted in `src/store/auth.store.ts` using zustand + `persist` (storage key `auth-store`). Roles come from `session.user.roles[].role`.
- Server-side session cookie: `src/lib/session.ts` stores encrypted JSON in HttpOnly cookies (AES-GCM). Exposes `getSession`, `getUserInfo`, setters, and `clearSession`.
- Layout gating: `AppShell` redirects unauthenticated users away from protected routes, and computes `isAdmin` from roles.

## Theme bootstrapping and readiness

- `src/components/providers/query-provider.tsx` initializes React Query and runs `ThemeBootstrap` once on mount:
  - Attempts to fetch remote themes from `/themes` (external API) with a 5s race; falls back to bundled `src/theme/presets.json`.
  - Applies tokens, scales, and component variables via `src/theme/theme.ts` functions.
  - Marks `useAppStore().setReady(true)` when complete; UI uses this to show animated background, partners, and footer only when ready.

## State management (zustand)

- Stores live in `src/store/*` and most are persisted with stable storage keys (e.g., `ui-store`, `language-store`, `auth-store`).
- `ui.store.ts` also controls `density` and writes `documentElement.dataset.density` (see `AppShell`).
- Other slices: `listings.store.ts`, `notifications.store.ts` (used by realtime), `theme.store.ts`, etc.

## Realtime notifications

- `src/lib/use-notifications-realtime.ts` connects to Socket.IO using `NEXT_PUBLIC_SOCKET_URL` and a Bearer token. On events, it normalizes items and updates the notifications store. Also uses `useApiGet('/notifications')` for initial list.

## Internationalization

- `src/components/providers/language-provider.tsx` + `src/lib/i18n.ts` provide locale-aware translations and an `isRtl` helper. The provider updates `<html lang>`; direction is handled per layout rather than globally.

## UI conventions and accessibility

- Skip link: `src/components/ui/skip-link.tsx` is rendered in `layout.tsx` for accessibility.
- Page transitions: `src/components/ui/page-transition.tsx`. Public home route shows `HomeSkeleton` until `appReady`.
- Auth pages intentionally hide chrome; see `hideChrome` list in `AppShell`.

## Internal vs external API usage

- Use internal Next routes for session/bootstrap data: `/api/session-token`, `/api/session-info`, `/api/env` (dev-only exposes all vars; prod exposes only `NEXT_PUBLIC_*`).
- Use external API (via axios client) for business data (listings, users, categories, notifications, themes).

## Examples to follow

- Fetch a list with SWR: `useSWRGet(['categories'], '/categories')` and read from `data`.
- Create with mutation: `const m = useApiMutation('post', '/categories')`; `m.mutate({ name })`.
- Gate a page: in a client component, use `const { user, isAdmin, loading } = useAuth()`; render loading state while `loading`, redirect or show 403 as needed.

## Environment

- Required vars: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SOCKET_URL`, and `SESSION_SECRET` (or `NEXT_PUBLIC_SESSION_SECRET` for dev).

When adding new features, prefer these same patterns (SWR for GET, React Query for mutations, axios envelope handling, zustand for client state, internal `/api/*` for cookie-backed session). Keep client-only hooks out of server components.
