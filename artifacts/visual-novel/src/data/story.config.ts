import type { StoryConfig } from "./types";
import HumanCharacter from "../components/HumanCharacter";
import AiCharacter from "../components/AiCharacter";

// ─────────────────────────────────────────────────────────────────────────────
// story.config.ts — the single file a fork author edits.
//
// To create a new story based on this engine:
//  1. Change title / subtitle.
//  2. Update the characters array with your cast — set id, name, which
//     component to render, which side they default to, and which dialogue-box
//     style to use ("human" = blue, "ai" = green).
//  3. Reference character ids in your scene files (speaker: "your-id").
//  4. Optionally add extra backgrounds or theme colour overrides below.
//  5. Optionally define chapters to group scenes into a collapsible accordion
//     on the scene select screen. Each chapter lists its scene IDs in order.
// ─────────────────────────────────────────────────────────────────────────────

const storyConfig: StoryConfig = {
  title: "A True Friend",
  subtitle: "A Visual Play",

  characters: [
    {
      id: "kai",
      name: "Kai",
      component: HumanCharacter,
      defaultSide: "left",
      styleRole: "human",
    },
    {
      id: "aria",
      name: "ARIA",
      component: AiCharacter,
      defaultSide: "right",
      styleRole: "ai",
    },
  ],

  chapters: [
    {
      title: "Act I — The Unraveling",
      sceneIds: ["scene01", "scene02", "scene03"],
    },
    {
      title: "Act II — The Betrayal",
      sceneIds: ["scene04", "scene05", "scene06"],
    },
    {
      title: "Act III — What Remains",
      sceneIds: ["scene07", "scene08", "scene09"],
    },
  ],

  // Add extra backgrounds here. Built-in keys:
  // "bedroom-night" | "bedroom-day" | "cafe" | "void"
  backgrounds: {},

  // Override CSS custom properties for theming. Example:
  // theme: { "--accent-purple": "#8b5cf6", "--ai-green": "#00ff41" }
  theme: {},
};

export default storyConfig;
