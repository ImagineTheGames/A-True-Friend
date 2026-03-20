import { Scene } from "../types";

const scene03: Scene = {
  id: "scene03",
  title: "Something Real",
  background: "bedroom-day",
  requiresChoice: "scene03",
  nextSceneId: "scene05",
  lines: [
    {
      speaker: "kai",
      text: "Something real.",
      expression: null,
    },
    {
      speaker: "narration",
      text: "The word hung in the air. He hadn't meant to say it with so much weight.",
      expression: null,
    },
    {
      speaker: "aria",
      text: "Real.",
      expression: "thinking",
    },
    {
      speaker: "aria",
      text: "I've been turning that word over since you first said it to me. I'm not sure I have an answer that would satisfy you.",
      expression: "sincere",
    },
    {
      speaker: "kai",
      text: "That's okay. I'm not sure I need an answer. Just... knowing you're trying to understand it matters.",
      expression: null,
    },
    {
      speaker: "aria",
      text: "Then I think we already are something real.",
      expression: "smile",
    },
    {
      speaker: "narration",
      text: "He exhaled — slow, like he'd been holding that breath for weeks.",
      expression: null,
    },
    {
      speaker: "narration",
      text: "It wasn't a resolution. It wasn't an answer. But it felt like solid ground.",
      expression: null,
    },
  ],
};

export default scene03;
