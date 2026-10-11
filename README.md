# AF Marketplace

Next.js app for the Afghanistan marketplace. People browse and post listings, blogs, and profiles. Admins moderate users, categories, ads, stories, contacts, and content status.

The API is the sibling backend. This app talks to it through `src/lib/axiosClient.ts`.

## Stack

- Next.js 16.2 (App Router) and React 19
- TanStack Query and Zustand
- Axios, react-hook-form, Zod
- Tailwind CSS and Framer Motion

## Features

Page routes and the symbols to open first are in [docs/feature-graph.md](docs/feature-graph.md).

- Home redirect, listings, listing create and detail, my listings, pendings
- Blogs, about, contact, sign-in, sign-up, profile
- Settings, appearance, and themes
- Admin users, categories, ads, stories, notifications, contacts, and content status

## Run

```bash
npm install
npm run dev
```

`npm run dev` loads `.env`, then starts `next dev`. `PORT` in the environment is passed through when it is set. `npm run build` and `npm start` build and serve the production app.

Hosting for Vercel, Docker, and Ubuntu is in [docs/README.md](docs/README.md).

## Agents

This repo has a local Codegraph index. Build or refresh it with `codegraph init` in this directory. Do not open `.codegraph/`.

On any code question, read [docs/feature-graph.md](docs/feature-graph.md) and call `codegraph_explore` with `projectPath` set to this repo before searching files. Cursor loads `.cursor/rules/codegraph.mdc`. Copilot loads the CodeGraph block in `.github/copilot-instructions.md` and `.github/skills/codegraph/SKILL.md`.
