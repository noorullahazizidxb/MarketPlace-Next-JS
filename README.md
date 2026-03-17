# Premium Next.js Starter

Modern, futuristic UI with Next.js App Router, TailwindCSS, shadcn-style primitives, framer-motion, lucide icons, and dark/light theming.

## Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL` if using Prisma.
2. Install deps and run dev server.

Set `NEXT_PUBLIC_ENABLE-ELASTIC-SEARCH=true` to use backend Elasticsearch-powered search.
Set it to `false` to switch the UI to local filter/autocomplete fallbacks.

Try it:

```
npm install
npm run dev
```

Open <http://localhost:3000>

If a build gets stuck on old assets, clear the cache and rebuild:

```
npx kill-port 3000 3010 || true
rimraf .next
npm run build && npm start
```

## REST Client

Use the VS Code REST Client extension with `rest-client/marketplace.http` to test your backend.

## Tech

- Next.js 14 (App Router)
- TailwindCSS, custom tokens and glassmorphism/neumorphism touches
- shadcn-style UI primitives (Button, Card)
- framer-motion animations
- lucide-react icons
- next-themes for dark/light

## Role-based UI and API

- Admin sees the Sidebar + admin Navbar. Users and Representatives see a premium animated Topbar with avatar menu (Profile, My listings, Notifications, Logout).
- Axios client unwraps the API envelope `{ message, statusCode, success, entity, data }` and returns `data` directly.
- Listings are rendered with premium `ListingCard` components showing image, price, type, and contact logic (seller contact vs. protected).
- If seller contact is hidden, the “Choose representative” action routes to `/representative/[listingId]` where available reps are listed for selection.

## Accessibility

- Skip link provided to jump to main content from the top of the page.
- Focus rings and high-contrast tokens in both themes.
- Buttons and toggles have accessible labels.

## Upgrading Next.js

This template runs on Next 14. You can upgrade to Next 15 when desired:

```
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```
