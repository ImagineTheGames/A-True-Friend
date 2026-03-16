export type Speaker = "human" | "ai" | "narration";

export type AiExpression =
  | "neutral"
  | "smile"
  | "smirk"
  | "wink"
  | "thinking"
  | "curious"
  | "surprised"
  | "laughing"
  | "sad"
  | "angry"
  | "sincere"
  | null;

export interface DialogueLine {
  speaker: Speaker;
  text: string;
  expression: AiExpression;
}

export interface Scene {
  id: string;
  title: string;
  background: string;
  lines: DialogueLine[];
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
