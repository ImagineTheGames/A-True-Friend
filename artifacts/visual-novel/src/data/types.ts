import type { ComponentType } from "react";

export type Speaker = string;
export type Expression = string | null;
export type AiExpression = Expression;

export interface CharacterProps {
  isActive: boolean;
  isSpeaking: boolean;
  expression?: Expression;
}

export interface CharacterConfig {
  id: string;
  name: string;
  component: ComponentType<CharacterProps>;
  defaultSide: "left" | "right";
  styleRole: "human" | "ai";
}

export interface CharacterSlot {
  characterId: string;
  side: "left" | "right";
}

export interface ChapterConfig {
  title: string;
  sceneIds: string[];
}

export interface StoryConfig {
  title: string;
  subtitle: string;
  characters: CharacterConfig[];
  backgrounds?: Record<string, { gradient: string; label: string }>;
  theme?: Record<string, string>;
  defaultSettings?: Partial<GameSettings>;
  chapters?: ChapterConfig[];
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
  volume: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  autoContinue: false,
  readingSpeed: "normal",
  soundEnabled: true,
  volume: 1,
};

export const SPEED_CONFIG: Record<ReadingSpeed, { typingMs: number; wpm: number; label: string }> = {
  slow:   { typingMs: 55, wpm: 110,  label: "Slow" },
  normal: { typingMs: 28, wpm: 200,  label: "Normal" },
  fast:   { typingMs: 14, wpm: 320,  label: "Fast" },
  vfast:  { typingMs: 5,  wpm: 500,  label: "Very Fast" },
};
