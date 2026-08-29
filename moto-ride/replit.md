# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### moto-ride-kigali (web, previewPath: /)

A moto ride-booking app for Kigali, Rwanda. Ported from Lovable.dev.

- **Frontend**: React + Vite + Tailwind v4 + shadcn/ui
- **Routing**: react-router-dom (BrowserRouter with BASE_URL basename)
- **Pages**: Home (booking), Tracking (live ride), Profile (history)
- **No backend**: Pure frontend app; the `apiService.ts` is wired to call an external Golang backend at `localhost:8080/api` (with mock fallback included)
- **Theme**: Inter + Montserrat fonts, blue/green/orange color scheme

### api-server (api, previewPath: /api)

Pre-scaffolded Express backend. Not used by the moto-ride-kigali frontend currently.
