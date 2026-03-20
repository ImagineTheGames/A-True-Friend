import type { ComponentType } from "react";

// Speaker is now an open string — character ids declared in story.config.ts.
// "narration" is reserved for narrator lines.
export type Speaker = string;

// Expression is an open string so any character can use custom expression keys.
export type Expression = string | null;

// Backward-compat alias — still used by AsciiExpression internally.
export type AiExpression = Expression;

// Shared props interface all character components must satisfy.
export interface CharacterProps {
  isActive: boolean;
  isSpeaking: boolean;
  expression?: Expression;
}

// One entry per character in the story. Defined in story.config.ts.
export interface CharacterConfig {
  id: string;
  name: string;
  component: ComponentType<CharacterProps>;
  defaultSide: "left" | "right";
  styleRole: "human" | "ai";
}

// Per-scene cast override — lets a scene place characters on non-default sides
// or show only a subset of the cast.
export interface CharacterSlot {
  characterId: string;
  side: "left" | "right";
}

// The single config object a fork author edits.
export interface StoryConfig {
  title: string;
  subtitle: string;
  characters: CharacterConfig[];
  backgrounds?: Record<string, { gradient: string; label: string }>;
  theme?: Record<string, string>;
  defaultSettings?: Partial<GameSettings>;
}

export interface DialogueLine {
  speaker: Speaker;
  text: string;
  expression: Expression;
}

export interface Choice {
  label: string;
  nextSceneId: string;
}

export interface Scene {
  id: string;
  title: string;
  background: string;
  cast?: CharacterSlot[];
  lines: DialogueLine[];
  choices?: Choice[];
  nextSceneId?: string;
  requiresChoice?: string;
}

export type ReadingSpeed = "slow" | "normal" | "fast" | "vfast";

export interface GameSettings {
  autoContinue: boolean;
  readingSpeed: ReadingSpeed;
  soundEnabled: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  autoContinue: false,
  readingSpeed: "normal",
  soundEnabled: true,
};

export const SPEED_CONFIG: Record<ReadingSpeed, { typingMs: number; wpm: number; label: string }> = {
  slow:   { typingMs: 55, wpm: 110,  label: "Slow" },
  normal: { typingMs: 28, wpm: 200,  label: "Normal" },
  fast:   { typingMs: 14, wpm: 320,  label: "Fast" },
  vfast:  { typingMs: 5,  wpm: 500,  label: "Very Fast" },
};
