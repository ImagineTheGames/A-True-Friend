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
- **Branching choices** — scenes can present 2–4 options, each routing to a specific scene by ID
- **Configurable routing** — any scene can explicitly declare its next destination instead of advancing linearly
- **Conditional scenes** — scenes can be hidden until the player has made a specific choice
- Two-character stage with dynamic positioning per scene
- Narration system — centered italic lines with a distinct digital sound
- Typing sounds — procedural Web Audio (no audio files required)
- Auto-continue mode with reading-speed-aware pacing
- Settings panel — typing sounds, auto-continue, reading speed
- Fully responsive — portrait and landscape, desktop and mobile
- Fork-ready — one config file to create a completely new story

---

## Playing

Open the app, select a scene, and click (or tap, or press Space/Enter) to advance dialogue. At choice scenes a choice overlay appears automatically — pick an option to branch the story. The hamburger menu lets you jump between scenes and access settings.

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
│   ├── storyIndex.ts       ← register all scenes here
│   ├── types.ts            ← shared TypeScript types
│   └── scenes/
│       ├── scene01.ts      ← linear scene
│       ├── scene02.ts      ← ends with a choice
│       ├── scene03.ts      ← branch A (requires choice)
│       ├── scene04.ts      ← branch B (requires choice)
│       └── scene05.ts      ← shared continuation both branches lead to
├── components/
│   ├── DialogueBox.tsx     ← typing animation, sounds, auto-continue
│   ├── ChoiceBox.tsx       ← choice overlay for branching scenes
│   ├── HumanCharacter.tsx  ← SVG character sprite
│   ├── AiCharacter.tsx     ← monitor + ASCII expression display
│   ├── AsciiExpression.tsx ← expression set for AiCharacter
│   └── SceneBackground.tsx ← background renderer
├── pages/
│   ├── GameScene.tsx       ← scene runtime, dynamic cast, choice logic
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

#### Linear scene

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

#### Choice scene — branch the story

Add a `choices` array to any scene. After the last dialogue line finishes, a choice overlay appears and the player picks an option. Each choice routes to a specific scene by ID.

```typescript
const scene02: Scene = {
  id: "scene02",
  title: "The Crossroads",
  background: "cafe",
  lines: [
    {
      speaker: "guide",
      text: "What do you want to do?",
      expression: "curious",
    },
  ],
  choices: [
    { label: "\"Push forward.\"",      nextSceneId: "scene03a" },
    { label: "\"Take a step back.\"",  nextSceneId: "scene03b" },
  ],
};
```

#### Routing a scene to a specific destination

By default, a scene advances to the next entry in `storyIndex.ts`. Use `nextSceneId` to route explicitly to any scene instead — useful for making two branches rejoin at a shared continuation:

```typescript
const scene03a: Scene = {
  id: "scene03a",
  title: "Moving Forward",
  background: "bedroom-day",
  nextSceneId: "scene04",   // ← skip the other branch and jump to scene04
  lines: [ /* ... */ ],
};

const scene03b: Scene = {
  id: "scene03b",
  title: "Stepping Back",
  background: "bedroom-night",
  nextSceneId: "scene04",   // ← same destination
  lines: [ /* ... */ ],
};

// Both branches rejoin here
const scene04: Scene = {
  id: "scene04",
  title: "The Reunion",
  background: "cafe",
  lines: [ /* ... */ ],
};
```

#### Conditional scenes — hide until a choice is made

Use `requiresChoice` to lock a scene out of the menu and scene-nav until the player has made a specific choice. Set it to the `nextSceneId` value that was used to reach this scene:

```typescript
const scene03a: Scene = {
  id: "scene03a",
  title: "Moving Forward",
  background: "bedroom-day",
  requiresChoice: "scene03a",   // hidden until the player chose nextSceneId: "scene03a"
  nextSceneId: "scene04",
  lines: [ /* ... */ ],
};
```

Scenes without `requiresChoice` are always visible. Scenes with it are hidden from the scene-select menu and the in-game nav until their condition is met.

### 4. Register scenes

List every scene in `storyIndex.ts` — both branch scenes and shared continuations:

```typescript
// src/data/storyIndex.ts
import scene01 from "./scenes/scene01";
import scene02 from "./scenes/scene02";
import scene03a from "./scenes/scene03a";
import scene03b from "./scenes/scene03b";
import scene04 from "./scenes/scene04";

const story = [scene01, scene02, scene03a, scene03b, scene04];
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

## Scene Fields Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique scene identifier. Used by `nextSceneId` and `requiresChoice` |
| `title` | `string` | ✓ | Shown in the top bar and scene-select menu |
| `background` | `string` | ✓ | Background key — built-in or declared in `story.config.ts` |
| `lines` | `DialogueLine[]` | ✓ | Ordered dialogue/narration lines |
| `cast` | `CharacterSlot[]` | | Override which characters appear and on which side for this scene |
| `choices` | `Choice[]` | | If present, shows a choice overlay after the last line instead of auto-advancing |
| `nextSceneId` | `string` | | Explicitly route to this scene ID when the scene ends (overrides linear order) |
| `requiresChoice` | `string` | | Hide this scene from menus until the player has navigated here via a choice with `nextSceneId` matching this value |

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
