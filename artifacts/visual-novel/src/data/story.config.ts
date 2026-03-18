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
// ─────────────────────────────────────────────────────────────────────────────

const storyConfig: StoryConfig = {
  title: "ARIA",
  subtitle: "A Story Told in Signals",

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

  // Add extra backgrounds here. Built-in keys:
  // "bedroom-night" | "bedroom-day" | "cafe" | "void"
  backgrounds: {},

  // Override CSS custom properties for theming. Example:
  // theme: { "--accent-purple": "#8b5cf6", "--ai-green": "#00ff41" }
  theme: {},
};

export default storyConfig;
