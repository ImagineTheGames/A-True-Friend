# ARIA — A Story Told in Signals

A browser-playable visual novel built with React + Vite. Two characters, scene-based storytelling, toon/anime aesthetic, and a configuration system designed for forking — create your own story by editing a single file.

**[▶ Play ARIA](https://aria.ImagineTheGames.replit.app)** *(replace with your deployed URL)*

---

## The Story

Kai comes home late. His laptop is already open. Something on his home network has said hello.

ARIA is a short visual novel about the strange intimacy of talking to an AI — what it means to trust something that can't quite feel, and what it means to be trusted by someone who isn't quite sure you're real.

---

## Features

- Scene-based narrative — easy to extend with new scenes
- Two-character stage with dynamic positioning per scene
- Narration system — centered italic lines with a distinct digital sound
- Typing sounds — procedural Web Audio (no audio files required)
- Auto-continue mode with reading-speed-aware pacing
- Settings panel — typing sounds, auto-continue, reading speed
- Fully responsive — portrait and landscape, desktop and mobile
- Fork-ready — one config file to create a completely new story

---

## Playing

Open the app, select a scene, and click (or tap, or press Space/Enter) to advance dialogue. The hamburger menu lets you jump between scenes and access settings.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Audio | Web Audio API (procedural synthesis, no files) |
| Monorepo | pnpm workspaces |
| Styling | Plain CSS with custom properties |

---

## Project Structure

```
artifacts/visual-novel/src/
├── data/
│   ├── story.config.ts     ← fork here — title, cast, backgrounds, theme
│   ├── storyIndex.ts       ← register scenes here
│   ├── types.ts            ← shared TypeScript types
│   └── scenes/
│       ├── scene01.ts
│       └── scene02.ts
├── components/
│   ├── DialogueBox.tsx     ← typing animation, sounds, auto-continue
│   ├── HumanCharacter.tsx  ← SVG character sprite
│   ├── AiCharacter.tsx     ← monitor + ASCII expression display
│   ├── AsciiExpression.tsx ← expression set for AiCharacter
│   └── SceneBackground.tsx ← background renderer
├── pages/
│   ├── GameScene.tsx       ← scene runtime, dynamic cast
│   └── SceneSelect.tsx     ← main menu
└── hooks/
    ├── useTypingSound.ts   ← dialogue + narration Web Audio hooks
    └── useSettings.ts      ← settings with localStorage persistence
```

---

## Forking — Create Your Own Story

This project is designed as a template. To make a new visual novel:

### 1. Fork this repo

```bash
git clone https://github.com/ImagineTheGames/Aria.git my-novel
cd my-novel
pnpm install
```

### 2. Edit `story.config.ts`

This is the **only engine file you need to touch**:

```typescript
// artifacts/visual-novel/src/data/story.config.ts

const storyConfig: StoryConfig = {
  title: "Your Story Title",
  subtitle: "Your tagline here",

  characters: [
    {
      id: "protagonist",      // used as speaker id in scene files
      name: "Alex",           // shown in dialogue badge
      component: HumanCharacter,
      defaultSide: "left",
      styleRole: "human",     // "human" = blue box, "ai" = green box
    },
    {
      id: "guide",
      name: "ORACLE",
      component: AiCharacter,
      defaultSide: "right",
      styleRole: "ai",
    },
  ],

  // Add backgrounds beyond the built-ins
  backgrounds: {
    "rooftop-night": {
      gradient: "linear-gradient(160deg, #0d0d1a 0%, #1a1a2e 60%, #2d1b4e 100%)",
      label: "Rooftop — Night",
    },
  },

  // Override CSS custom properties for full re-theming
  theme: {
    "--accent-purple": "#8b5cf6",
    "--ai-green": "#00ff88",
  },
};
```

### 3. Write your scenes

Create `src/data/scenes/scene01.ts`:

```typescript
import { Scene } from "../types";

const scene01: Scene = {
  id: "scene01",
  title: "The Beginning",
  background: "bedroom-night",

  // Optional: override which characters appear and which side per scene
  // cast: [{ characterId: "protagonist", side: "right" }],

  lines: [
    {
      speaker: "narration",       // centered italic, no badge, digital blip sound
      text: "A quiet room. The screen flickers on.",
      expression: null,
    },
    {
      speaker: "protagonist",     // matches character id in story.config.ts
      text: "Hello?",
      expression: null,
    },
    {
      speaker: "guide",
      text: "I've been waiting.",
      expression: "smile",
    },
  ],
};

export default scene01;
```

### 4. Register scenes

```typescript
// src/data/storyIndex.ts
import scene01 from "./scenes/scene01";
import scene02 from "./scenes/scene02";

const story = [scene01, scene02];
export default story;
```

### 5. Run it

```bash
pnpm --filter @workspace/visual-novel run dev
```

---

## Built-in Backgrounds

| Key | Description |
|---|---|
| `bedroom-night` | Dark blue/indigo — late night |
| `bedroom-day` | Warm orange/pink — morning light |
| `cafe` | Warm brown — café interior |
| `void` | Pure dark — abstract/timeless |

Add more in `story.config.ts → backgrounds`.

---

## ARIA's Expressions

ARIA uses ASCII art expressions rendered on the monitor screen. Available keys:

| Key | Face |
|---|---|
| `neutral` | `( -_- )` |
| `smile` | `( ^_^ )` |
| `smirk` | `( ¬‿¬ )` |
| `wink` | `( ^_~ )` |
| `thinking` | `( ._. )?` |
| `curious` | `( o_O )` |
| `surprised` | `( O_O )` |
| `laughing` | `( ≧▽≦ )` |
| `sad` | `( T_T )` |
| `angry` | `( >_< )` |
| `sincere` | `( ◕‿◕ )` |

Add more in `src/components/AsciiExpression.tsx`.

---

## Pulling Engine Updates from Upstream

When this template is updated with bug fixes or new engine features, pull them into your fork:

```bash
git remote add upstream https://github.com/ImagineTheGames/Aria.git
git pull upstream main

# Resolve any conflicts — your story files (scenes/, story.config.ts)
# should never conflict with engine changes
```

To contribute an engine fix back upstream, open a pull request against this repo.

---

## License

MIT — fork freely, build your story.
