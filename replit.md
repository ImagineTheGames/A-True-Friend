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

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── visual-novel/       # Visual Novel game (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Visual Novel — `artifacts/visual-novel`

A scene-based visual novel engine. Characters: Kai (human, left side) and ARIA (AI on monitor, right side).

### How to add new scenes

1. Create `artifacts/visual-novel/src/data/scenes/scene0N.ts` following the same pattern as existing scenes.
2. Import it and add it to the array in `artifacts/visual-novel/src/data/storyIndex.ts`.
3. Scenes are automatically unlocked sequentially (complete scene N to unlock scene N+1).

### Scene file format

```typescript
import { Scene } from "../types";

const sceneXX: Scene = {
  id: "sceneXX",
  title: "Scene Title Here",
  background: "bedroom-night", // bedroom-night | bedroom-day | cafe | void
  lines: [
    {
      speaker: "human",  // or "ai"
      text: "What they say.",
      expression: null,  // only relevant for "ai" speaker
    },
    {
      speaker: "ai",
      text: "ARIA's response.",
      expression: "smile",  // see list below
    },
  ],
};

export default sceneXX;
```

### Available AI expressions (ASCII art)

- `neutral`  → `( -_- )`
- `smile`    → `( ^_^ )`
- `smirk`    → `( ¬‿¬ )`
- `wink`     → `( ^_~ )`
- `thinking` → `( ._. )?`
- `curious`  → `( o_O )`
- `surprised`→ `( O_O )`
- `laughing` → `( ≧▽≦ )`
- `sad`      → `( T_T )`
- `angry`    → `( >_< )`
- `sincere`  → `( ◕‿◕ )`

### Available backgrounds

- `bedroom-night` — dark blue/indigo late-night room
- `bedroom-day`   — warm morning light
- `cafe`          — warm brown café setting
- `void`          — pure dark abstract

To add a new background, edit `artifacts/visual-novel/src/components/SceneBackground.tsx`.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
