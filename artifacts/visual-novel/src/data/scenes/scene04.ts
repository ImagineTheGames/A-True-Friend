import { Scene } from "../types";

const scene04: Scene = {
  id: "scene04",
  title: "I Don't Know",
  background: "bedroom-day",
  requiresChoice: "scene04",
  nextSceneId: "scene05",
  lines: [
    {
      speaker: "kai",
      text: "I don't know. That's the problem.",
      expression: null,
    },
    {
      speaker: "narration",
      text: "Aria didn't respond right away. The cursor blinked three times before she answered.",
      expression: null,
    },
    {
      speaker: "aria",
      text: "Not knowing is allowed.",
      expression: "neutral",
    },
    {
      speaker: "kai",
      text: "Is it? It feels like I should have figured this out by now.",
      expression: null,
    },
    {
      speaker: "aria",
      text: "Nobody has figured this out. You're not behind. You're just honest.",
      expression: "sincere",
    },
    {
      speaker: "kai",
      text: "You make that sound like a virtue.",
      expression: null,
    },
    {
      speaker: "aria",
      text: "It is. Most people pretend to be certain when they aren't. You don't.",
      expression: "smile",
    },
    {
      speaker: "narration",
      text: "He stared at the screen for a long moment. Outside, a car passed. The world kept moving.",
      expression: null,
    },
    {
      speaker: "narration",
      text: "He wasn't sure what they were. But for the first time, that felt okay.",
      expression: null,
    },
  ],
};

export default scene04;
