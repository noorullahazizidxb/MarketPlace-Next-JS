<!-- Based on/Inspired by: https://github.com/github/awesome-copilot -->
# Marketplace Front End — Copilot Instructions

## Project Overview
This repository provides the frontend for the Marketplace using Next.js (App Router), TypeScript, Tailwind CSS, and React. It focuses on responsive UI, accessibility, and performant client interactions.

## Tech Stack
- Next.js (App Router) with TypeScript
- Tailwind CSS for styling
- React + React Server Components where appropriate
- Axios/Fetch for API integration
- Vercel / Node.js deployment targets

## Conventions
- Naming: use camelCase for variables and functions; PascalCase for React components.
- Structure: pages and app routes live in `src/app/`, shared components in `src/components/`.
- Styling: prefer utility-first Tailwind classes, use components for complex patterns.

## Workflow
- PRs: small, focused PRs with descriptive titles.
- Tests: unit and integration tests for critical UI and hooks.
- Commits: imperative style (e.g., "Add listing card skeleton").

## Reference Instruction Files
- Language guidelines: .github/instructions/typescript.instructions.md
- Next.js + Tailwind guidelines: .github/instructions/nextjs-tailwind.instructions.md
- Testing: .github/instructions/testing.instructions.md
- Security: .github/instructions/security.instructions.md
- Documentation: .github/instructions/documentation.instructions.md
- Performance: .github/instructions/performance.instructions.md
- Code review: .github/instructions/code-review.instructions.md

Keep Copilot suggestions aligned with the repository's patterns: prioritize accessibility, small components, and predictable client/server boundaries.
