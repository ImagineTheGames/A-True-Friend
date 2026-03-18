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

A scene-based visual novel engine designed to be forked. Characters: Kai (human, left side)
and ARIA (AI on monitor, right side). Built with React + Vite, Web Audio API for sounds.

---

### Fork configuration — `src/data/story.config.ts`

**This is the only file a fork author needs to edit** to create a new story.
It owns:
- `title` / `subtitle` — shown on the main menu
- `characters[]` — cast definition: id, display name, component, default stage side, dialogue style
- `backgrounds` (optional) — extra scene backgrounds beyond the built-ins
- `theme` (optional) — CSS custom-property overrides for full re-theming without touching `index.css`

Character `id` values become the `speaker` key used in scene files.

---

### How to add new scenes

1. Create `artifacts/visual-novel/src/data/scenes/scene0N.ts` following the same pattern.
2. Import it and add it to the array in `artifacts/visual-novel/src/data/storyIndex.ts`.

### Scene file format

```typescript
import { Scene } from "../types";

const sceneXX: Scene = {
  id: "sceneXX",
  title: "Scene Title Here",
  background: "bedroom-night",  // see backgrounds list below
  // Optional: override which characters appear and which side they stand on.
  // Omit to use each character's defaultSide from story.config.ts.
  cast: [
    { characterId: "kai",  side: "left" },
    { characterId: "aria", side: "right" },
  ],
  lines: [
    {
      speaker: "narration",     // reserved — centered italic, no badge, no typing sound
      text: "A quiet room.",
      expression: null,
    },
    {
      speaker: "kai",           // must match a character id in story.config.ts
      text: "What they say.",
      expression: null,
    },
    {
      speaker: "aria",
      text: "ARIA's response.",
      expression: "smile",      // see expression list below
    },
  ],
};

export default sceneXX;
```

### Available ARIA expressions (ASCII art)

- `neutral`   → `( -_- )`
- `smile`     → `( ^_^ )`
- `smirk`     → `( ¬‿¬ )`
- `wink`      → `( ^_~ )`
- `thinking`  → `( ._. )?`
- `curious`   → `( o_O )`
- `surprised` → `( O_O )`
- `laughing`  → `( ≧▽≦ )`
- `sad`       → `( T_T )`
- `angry`     → `( >_< )`
- `sincere`   → `( ◕‿◕ )`

### Built-in backgrounds

- `bedroom-night` — dark blue/indigo late-night room
- `bedroom-day`   — warm morning light
- `cafe`          — warm brown café setting
- `void`          — pure dark abstract

To add backgrounds in a fork, add entries to the `backgrounds` map in `story.config.ts`.
Engine built-ins are always available; config backgrounds are merged on top.

### Audio

- Typing sound: Web Audio API band-pass noise bursts (throttled 55 ms between triggers)
- Narration sound: soft sine-wave downward sweep blip (throttled 80 ms), separate from typing
- Both use a module-level singleton AudioContext to avoid browser instance limits
- Controlled by the `soundEnabled` setting, persisted in localStorage under `aria_settings`

### Key source files

| File | Purpose |
|------|---------|
| `src/data/story.config.ts` | **Fork config** — title, cast, backgrounds, theme |
| `src/data/storyIndex.ts` | Scene registry |
| `src/data/scenes/scene0N.ts` | Individual scene data |
| `src/data/types.ts` | All shared TypeScript types |
| `src/pages/GameScene.tsx` | Scene runtime — dynamic cast, per-character expressions |
| `src/pages/SceneSelect.tsx` | Main menu |
| `src/components/DialogueBox.tsx` | Typing animation, sound, auto-continue |
| `src/components/HumanCharacter.tsx` | SVG character sprite |
| `src/components/AiCharacter.tsx` | Monitor + ASCII expression display |
| `src/components/SceneBackground.tsx` | Background renderer (merges built-ins + config) |
| `src/hooks/useTypingSound.ts` | Typing + narration Web Audio hooks |
| `src/hooks/useSettings.ts` | Settings with localStorage persistence |

---

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json`
lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
