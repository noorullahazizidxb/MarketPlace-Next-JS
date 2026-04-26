# GitHub Copilot Instructions — Marketplace Frontend

> This file is the authoritative reference for how this codebase is built.
> Read it fully before generating any code, component, or config change.

---

## 1. Project Identity

| Property | Value |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **TypeScript 5** (strict, no `any` without justification) |
| React | **React 19** with concurrent features |
| Node target | 20 LTS |
| Production URL | `https://marketplace.devminds.net` |
| Dev server | `http://localhost:3005` (via `scripts/dev.js`) |
| Backend API | `https://api.devminds.net/api` (env: `NEXT_PUBLIC_API_BASE_URL`) |

---

## 2. Package Stack & Purpose

### Core framework
| Package | Purpose |
|---|---|
| `next ^16.1.6` | App Router, Server Components, SSR, Turbopack |
| `react ^19.2.4` | UI, concurrent features, `useTransition`, `use()` |
| `typescript ^5.5.4` | Type safety |

### Data fetching & state — CRITICAL RULES
| Package | Purpose |
|---|---|
| `@tanstack/react-query ^5.87.4` | **SOLE data-fetching library.** ALL server data must go through React Query. |
| `@tanstack/react-query-devtools` | Dev-only DevTools panel |
| `zustand ^4.5.5` | Client-only UI / auth / language state |
| `axios ^1.12.1` | HTTP client (wrapped in `src/lib/axiosClient.ts`) |
| `swr ^2.3.6` | **DO NOT USE.** Package is present but SWR has been fully removed. Zero SWR hooks anywhere. |

**React Query singleton** lives at `src/lib/query-client.ts`. Always import `queryClient` from there.
Default config: `staleTime: 30_000`, `retry: 1`, `refetchOnWindowFocus: false`.

All query/mutation hooks live in `src/lib/api-hooks.ts`. Add new hooks there — never inline `useQuery` calls in components.

### Network layer
| Package / File | Purpose |
|---|---|
| `axios` | External API requests via `src/lib/axiosClient.ts` |
| `src/lib/axiosClient.ts` | Singleton `axiosClient`; auto-attaches JWT Bearer token via interceptor; reads from `useAuthStore` |
| `src/lib/api.ts` | Typed `api.get/post/put/patch/delete` wrappers around `axiosClient` |
| `src/lib/api-hooks.ts` | All `useQuery` / `useMutation` hooks. `useApiQuery(method, url, ...)` is the main factory |
| `src/lib/query-client.ts` | Singleton `QueryClient` + `mutate()` shim for imperative cache updates |
| Native `fetch` | Used only for `/api/*` internal Next.js API routes (`localFetch` in `api-hooks.ts`) |

Token flow: JWT stored in `useAuthStore` (zustand + persist) → `axiosClient` interceptor attaches it.

### Auth
| File | Purpose |
|---|---|
| `src/lib/use-auth.ts` | `useAuth()` hook — exposes `user`, `token`, `isAdmin`, `loading` |
| `src/store/auth.store.ts` | Zustand store, persisted to `localStorage` as `"auth-store"` |
| `src/lib/axiosClient.ts` | `setCachedToken(token)` — call after login to update the in-memory cache |

### Forms & validation
| Package | Purpose |
|---|---|
| `react-hook-form ^7.62.0` | All forms. Always use `Controller` for custom inputs. |
| `@hookform/resolvers ^5.2.1` | `zodResolver` for schema validation |
| `zod ^4.1.9` | Schema definitions. All form schemas defined in `src/validation/` |

### Animation
| Package | Purpose |
|---|---|
| `framer-motion ^11.2.10` | Complex enter/exit animations, layout transitions. `src/lib/motion.ts` exports `MotionDiv` etc. |
| Tailwind keyframes | `animate-shimmer`, `animate-float`, `animate-aurora`, `animate-logo-scroll` for CSS-only loops |
| `src/lib/animations.ts` | Shared Framer Motion variants and transition configs |

### UI primitives
| Package | Purpose |
|---|---|
| `@radix-ui/react-dialog` | Modal / Dialog |
| `@radix-ui/react-dropdown-menu` | Dropdown menus |
| `@radix-ui/react-label` | Form labels |
| `@radix-ui/react-slot` | `asChild` pattern |
| `lucide-react ^0.474.0` | **Preferred icon library.** Always try Lucide first. |
| `react-icons` | Secondary icons when Lucide lacks the brand/specific icon needed |
| `react-hot-toast ^2.6.0` | Toast notifications (wrapped in `src/lib/toast.tsx`) |
| `recharts ^2.12.7` | Charts and data visualisation |
| `react-qr-code ^2.0.18` | QR code generation |
| `react-country-flag ^3.1.0` | Country flag emoji/SVG in dropdowns |
| `socket.io-client ^4.8.1` | Real-time websocket events via `src/lib/socket.ts` |

### Styling
| Package | Purpose |
|---|---|
| `tailwindcss ^3.4.10` | Utility-first CSS (v3, NOT v4) |
| `tailwind-merge ^2.5.2` | `twMerge()` — always use via `src/lib/cn.ts` `cn()` helper |
| `clsx ^2.1.1` | Conditional class building (used inside `cn()`) |
| `autoprefixer ^10.4.20` | PostCSS autoprefixing |
| `postcss ^8.4.45` | PostCSS pipeline |

---

## 3. File & Directory Structure

```
src/
  app/                       # Next.js App Router pages & layouts
    layout.tsx               # Root layout: QueryProvider, LanguageProvider, AppShell
    globals.css              # All global CSS: tokens, keyframes, component classes
    listings/                # /listings route
      layout.tsx             # LCP preload link for listings hero image
    (other routes...)
  components/
    layout/                  # App-wide structural layout components
      app-shell.tsx          # Main shell: Navbar, Sidebar, BottomNav, Footer, Partners
      navbar.tsx
      sidebar.tsx
      site-footer.tsx
    providers/               # React context providers
      query-provider.tsx     # TanStack QueryClient provider (uses singleton)
      language-provider.tsx  # LanguageContext — exposes t(), locale, isRtl
    ui/                      # Reusable UI primitives
      partners.tsx           # Trusted companies logo carousel (lazy-loaded via app-shell)
      image-slider.tsx       # Listing image slider (ResizeObserver width caching)
      search-box.tsx         # Global search with React Query
      card.tsx               # Base Card primitive
      button.tsx             # Button variants
      component-loading.tsx  # Pulsing skeleton for Suspense fallbacks
      ...
  hooks/                     # Custom React hooks (non-store, non-lib)
  lib/                       # Pure utilities, clients, hooks without UI
    api-hooks.ts             # All useQuery/useMutation hooks
    api.ts                   # Typed axios wrappers
    axiosClient.ts           # Axios singleton with interceptors
    query-client.ts          # QueryClient singleton + mutate() shim
    cn.ts                    # cn() = clsx + twMerge
    i18n.ts                  # Translation loader
    use-auth.ts              # useAuth() hook
    motion.ts                # Framer Motion exports
    animations.ts            # Shared animation variants
  store/                     # Zustand stores (client state only)
    auth.store.ts            # JWT session, persisted
    language.store.ts        # Locale selection
    ui.store.ts              # Density, sidebar state
    listings.store.ts        # Listings filters & pagination
    theme.store.ts           # Active theme token map
    notifications.store.ts
    toasts.store.ts
    search.store.ts
  validation/                # Zod schemas for all forms
  mock/                      # Mock API data (enabled via config.useMockData)
  types/                     # Shared TypeScript types
theme-data/
  active-theme.json          # Live theme token overrides (loaded at runtime)
  default-theme.json         # Default token values
public/
  mask.png                   # PNG texture mask used by :where(h1..h6) in globals.css
  images/
  logo/
```

---

## 4. Styling & Design System

### 4.1 Tailwind v3 Config (`tailwind.config.ts`)

This project uses **Tailwind CSS v3** with `theme.extend`. There is **no `@theme` directive** (that is a Tailwind v4 feature). All custom tokens are extended via `tailwind.config.ts`:

#### Custom colors (map to CSS variables)
```typescript
colors: {
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  muted:      "hsl(var(--muted))",
  card:       "hsl(var(--card))",
  border:     "hsl(var(--border))",
  input:      "hsl(var(--input))",
  primary:    { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
  secondary:  { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
  accent:     { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
}
```
Use: `bg-primary`, `text-foreground`, `border-border`, etc. — these resolve at runtime via CSS variables.

For opacity variants use: `bg-[hsl(var(--primary)/0.15)]` — **never** hardcode raw `rgb()` or `hsl()` values.

#### Custom border radius
```
rounded-lg   → 1.25rem
rounded-xl   → 1.5rem
rounded-2xl  → 2rem
```

#### Custom shadows
```
shadow-soft   → 0 10px 30px -12px rgba(2,6,23,0.3)
shadow-glass  → inset 0 1px rgba(255,255,255,0.25) + 0 10px 30px -12px rgba(2,6,23,0.35)
```

#### Custom timing function
```
ease-premium  → cubic-bezier(0.16, 1, 0.3, 1)
```
Always use `ease-premium` for card hovers, panel transitions, and modal animations.

#### Custom keyframes & animations (generated as Tailwind utilities)
| Class | Duration | Use case |
|---|---|---|
| `animate-aurora` | 12s ease-in-out infinite | Background blob glow |
| `animate-float` | 6s ease-in-out infinite | Floating hero elements |
| `animate-shimmer` | 2.5s linear infinite | Skeleton loading shimmer |
| `animate-logo-scroll` | 30s linear infinite | Partners logo carousel |

### 4.2 CSS Variables (Design Tokens)

All colors use HSL triplets without `hsl()` wrapper in the variable itself:
```css
--primary: 180 100% 40%;     /* teal */
--secondary: 295 90% 55%;    /* magenta */
--accent: 45 100% 50%;       /* neon yellow */
--background: var(--light-background);
--foreground: var(--light-foreground);
```

Dark mode adds `.dark` class or `data-theme="dark"` on `<html>`. Token variables are remapped in `.dark {}`.

Theme overrides loaded from `theme-data/active-theme.json` at runtime (via `src/store/theme.store.ts`).

### 4.3 `globals.css` Layers & Custom Classes

#### Typography
```css
/* Applied to all headings globally via :where() — RTL + LTR safe */
:where(h1, h2, h3, h4, h5, h6) {
  line-height: 1.4cap;
  padding-block-end: 0.25ch;
  -webkit-mask-image: var(--app-heading-mask-image); /* = url('/mask.png') */
  mask-image: var(--app-heading-mask-image);
  mask-size: cover;
  mask-repeat: no-repeat;
  mask-position: center;   /* axis-agnostic: works in both RTL and LTR */
}
/* Same mask on bold/important inline text */
:where(strong, b) { /* same mask rules */ }
```

#### Layout utilities
| Class | Purpose |
|---|---|
| `.container-padded` | `container px-4 md:px-6 lg:px-8` |
| `.glass` | White/5 backdrop blur panel with border |
| `.liquid-glass` | Conic-gradient border + blur glass panel |
| `.glass-hover` | translateY(-2px) hover lift |
| `.neuo` | Neumorphic box shadow |

#### Typography scale classes
| Class | Font size var |
|---|---|
| `.heading-2xl` | `--font-size-4xl` (2.25rem) |
| `.heading-xl` | `--font-size-3xl` (1.875rem) |
| `.heading-lg` | `--font-size-2xl` (1.5rem) |
| `.heading-md` | `--font-size-xl` (1.25rem) |
| `.heading-sm` | `--font-size-lg` (1.125rem) |
| `.subtle` | `text-sm text-foreground/70` |

#### Animation helpers
| Class | Purpose |
|---|---|
| `.animate-marquee` | Legacy CSS marquee (partners pre-refactor) |
| `.animate-logo-scroll` | Logo carousel; pauses on `:hover` via CSS rule |
| `.animate-spin-slow` | 60s conic rotation |
| `.animate-drift-a/b` | Slow positional drift for bg blobs |
| `.badge-pop` | Scale-in badge animation |
| `.hover-ambient` | Radial glow pseudo-element on hover |

#### Semantic background helpers
| Class | Generated gradient |
|---|---|
| `.bg-conic-primary-secondary` | Conic gradient using `--primary` + `--secondary` |
| `.bg-radial-accent` | Radial gradient using `--accent` |
| `.bg-radial-secondary` | Radial gradient using `--secondary` |
| `.bg-aurora-one` | Radial blue blur blob |
| `.bg-aurora-two` | Radial purple blur blob |
| `.bg-grid-overlay` | Grid line texture for animated backgrounds |

---

## 5. i18n & RTL

- Supported locales: `"en"` (LTR) and `"fa"` (Dari/Persian, RTL)
- `html[lang="fa"]` sets `direction: rtl` globally via CSS
- `html[lang="en"]` uses Poppins/Inter; `html[lang="fa"]` uses HSDream/Vazirmatn/Yekan
- Use `useLanguage()` from `@/components/providers/language-provider` to get `{ t, locale, isRtl }`
- Translation keys defined in `src/lib/locales/`
- RTL-safe CSS: use logical properties (`margin-inline-start`, `padding-block-end`) over physical ones
- The heading mask uses `mask-position: center` which is axis-agnostic and works in both RTL and LTR

---

## 6. Component Patterns

### Server vs Client components
- Default to **Server Components** for data-free, layout, and static UI
- Add `"use client"` only for: hooks, event handlers, browser APIs, Zustand, React Query
- Colocate `"use client"` as deep as possible — don't promote whole pages to client

### Lazy loading heavy components
Use `next/dynamic` with `{ ssr: false }` for heavy below-fold components:
```typescript
const Partners = dynamic(() => import("@/components/ui/partners").then(m => m.Partners), { ssr: false });
```
Currently lazy-loaded: `Partners`, `HomePromoBanner`, `HiddenListingsSlider`.

### Forms
```typescript
const { register, handleSubmit, control } = useForm<FormSchema>({ resolver: zodResolver(schema) });
// Always use <Controller> for custom inputs (Select, Combobox, etc.)
```

### API Hooks pattern (ALWAYS follow this)
```typescript
// In src/lib/api-hooks.ts — add new hooks here, never inline:
export function useListings(params: ListingsParams) {
  return useApiQuery<ListingsResponse>("get", "/listings", { params });
}
```

### cn() utility
```typescript
import { cn } from "@/lib/cn";
// Merges Tailwind classes correctly — use for all conditional className logic
className={cn("base-classes", condition && "conditional-class", className)}
```

### Gradient text headings
```tsx
<h2 className="heading-xl bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--foreground))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
  Heading text
</h2>
```

### Glass card pattern
```tsx
<div className="relative rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.45)] backdrop-blur-sm hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--card)/0.75)] transition-all duration-300 ease-premium">
  {/* Shimmer sweep on hover */}
  <div aria-hidden="true" className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/[.07] to-transparent pointer-events-none" />
</div>
```

---

## 7. Performance Conventions

| Rule | Reason |
|---|---|
| Never call `el.clientWidth`/`getBoundingClientRect` in render or scroll handlers | Causes forced reflow (layout thrashing) |
| Use `ResizeObserver` to cache container dimensions | Eliminates repeated layout reads |
| Close dropdowns on scroll via `useLayoutEffect` + scroll listener, not via `getBoundingClientRect` | Eliminates 242ms ForcedReflow |
| `staleTime: 30_000` on all queries | Prevents over-fetching on navigation |
| `refetchOnWindowFocus: false` | Prevents spurious refetches |
| `next/dynamic` with `ssr: false` for heavy below-fold components | Reduces initial JS parse time |
| `will-change: transform` on animated elements | GPU-promotes the layer before animation |
| `<link rel="preload" as="image">` in page layouts for LCP images | Fixes LCP `fetchpriority=high` failures |

---

## 8. Auth & Security

- JWT stored in Zustand `auth.store` (persisted in `localStorage`)
- `axiosClient` interceptor auto-attaches `Authorization: Bearer <token>` to every request
- `useAuth()` hook exposes `{ user, token, isAdmin, loading }` — use this in components, not the store directly
- Admin routes protected by redirect check in `app-shell.tsx`
- Never embed raw secret values in client code; use `NEXT_PUBLIC_*` env vars for client-visible config

---

## 9. Zustand Stores (Client State)

| Store | Key state | Persisted |
|---|---|---|
| `auth.store.ts` | `session: { token, user }` | Yes (`auth-store`) |
| `language.store.ts` | `locale: "en" \| "fa"` | Yes |
| `ui.store.ts` | `density`, sidebar open/closed | Yes |
| `listings.store.ts` | filters, pagination, active listing | No |
| `theme.store.ts` | active theme token map | Yes |
| `notifications.store.ts` | unread count, notifications array | No |
| `toasts.store.ts` | toast queue | No |
| `search.store.ts` | search term, results | No |

---

## 10. When to Use Which Skill

| Situation | Skill to use |
|---|---|
| Creating a new UI component | Follow the glassmorphism card pattern in `partners.tsx`; use `liquid-glass` or custom backdrop-blur + border token |
| Adding a new page | Use Server Component as default; add `"use client"` only if needed |
| Adding a form | React Hook Form + Zod + zodResolver; add schema to `src/validation/` |
| Charting / analytics | Recharts only; wrap in `"use client"` |
| Icons | Lucide first, react-icons second |
| Animations | Tailwind keyframes for CSS-only loops; Framer Motion for enter/exit; `src/lib/motion.ts` exports |
| Real-time data | `socket.io-client` via `src/lib/socket.ts`; event hooks in `src/hooks/useSocketEvent.ts` |
| Persian/RTL content | `useLanguage()` for locale; logical CSS properties; HSDream/Vazirmatn font classes |
| Mock data / development | Set `config.useMockData = true` in `src/lib/config.ts` and add responses to `src/mock/api-mocks.ts` |

---

## 11. Conventions & Hard Rules

### DO
- ✅ Import colors as `hsl(var(--primary))` — never hardcode color values
- ✅ Use `cn()` from `@/lib/cn` for all conditional class merging
- ✅ Export named exports from component files (not default)
- ✅ Keep API hooks in `src/lib/api-hooks.ts`
- ✅ Use logical CSS properties for RTL compatibility (`margin-inline-start`, `padding-block`)
- ✅ Add `aria-hidden="true"` to all decorative elements (glows, shimmer sweeps, bg blobs)
- ✅ Use `heading-lg`, `heading-md`, etc. classes for semantic heading sizing
- ✅ Add `ease-premium` to card hover transitions
- ✅ Use `backdrop-blur-sm` + semi-transparent card bg for glass panels

### DON'T
- ❌ Never use `swr` — it's been fully removed from usage
- ❌ Never inline `useQuery` in a component — add the hook to `api-hooks.ts`
- ❌ Never use `text-muted-foreground` — it's not in the tailwind config; use `text-[hsl(var(--foreground)/0.5)]`
- ❌ Never hardcode colors like `text-blue-500` — always use theme tokens
- ❌ Never read `el.clientWidth` / `getBoundingClientRect` in scroll or render handlers
- ❌ Never add `"use client"` to a layout.tsx unless absolutely required
- ❌ Never call `window.*` outside `useEffect` or `typeof window !== "undefined"` guards
- ❌ Never use Framer Motion for simple CSS-only animations (use Tailwind keyframes instead)
- ❌ Never use `<img>` for local images — use `next/image`; exception: external SVG URLs or `aria-hidden` decorative images
- ❌ Never commit secrets or API keys; use `.env.local` for local dev

---

## 12. Environment Variables

| Variable | Used in | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `axiosClient.ts` | External API base URL |
| `NEXT_PUBLIC_API_BASE` | `axiosClient.ts` | Fallback API base |
| `BLOG_ORIGIN` | `app/page.tsx` | Blog origin for redirect logic |
| `MARKETPLACE_ORIGIN` | `app/page.tsx` | Marketplace origin for redirect |

---

## 13. Running the App

```bash
# Development (auto-selects free port, starts Turbopack)
npm run dev
# or: node scripts/dev.js

# Production build
npm run build

# Start production
npm start

# Lint
npm run lint
```

Docker services required for the backend (Redis etc.):
```bash
docker start redis
```
