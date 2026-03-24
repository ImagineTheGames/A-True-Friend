# A True Friend

  A visual novel built on the [ARIA engine](https://github.com/ImagineTheGames/Aria) — a fork-friendly React + Vite template for browser-playable visual novels.

  ---

  ## About This Story

  *Your story description goes here.*

  ---

  ## Branch Structure

  | Branch | Purpose |
  |---|---|
  | `main` | Tracks the upstream ARIA engine — pull engine updates here |
  | `story` | This fork's story content — your scenes, characters, and config live here |

  All story work belongs on the `story` branch. The `main` branch stays clean so engine improvements can be merged in without conflicts.

  ---

  ## Getting Started

  ```bash
  git clone https://github.com/ImagineTheGames/A-True-Friend.git
  cd A-True-Friend
  git checkout story
  pnpm install
  pnpm --filter @workspace/visual-novel run dev
  ```

  Edit `artifacts/visual-novel/src/data/story.config.ts` to set your title and characters, then write scenes in `artifacts/visual-novel/src/data/scenes/`.

  See the [ARIA README](https://github.com/ImagineTheGames/Aria#readme) for the full scene format, expressions reference, branching choices, and forking guide.

  ---

  ## Pulling Engine Updates from ARIA

  When the upstream ARIA engine gets bug fixes or new features:

  ```bash
  # Add upstream once
  git remote add upstream https://github.com/ImagineTheGames/Aria.git

  # Pull engine updates into main
  git checkout main
  git pull upstream main

  # Rebase your story on top of the updated engine
  git checkout story
  git rebase main
  ```

  Your story files (`scenes/`, `story.config.ts`) will never conflict with engine changes as long as you haven't edited engine components directly.

  ---

  ## License

  MIT — fork freely, build your story.
  