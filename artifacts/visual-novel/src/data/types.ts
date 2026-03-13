export type Speaker = "human" | "ai";

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
