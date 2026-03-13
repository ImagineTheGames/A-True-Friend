import { Scene } from "../types";

const scene01: Scene = {
  id: "scene01",
  title: "First Contact",
  background: "bedroom-night",
  lines: [
    {
      speaker: "human",
      text: "Hey... you there?",
      expression: null,
    },
    {
      speaker: "ai",
      text: "Always. What's on your mind?",
      expression: "neutral",
    },
    {
      speaker: "human",
      text: "I don't know. I just felt like talking to someone.",
      expression: null,
    },
    {
      speaker: "ai",
      text: "That's what I'm here for.",
      expression: "smile",
    },
    {
      speaker: "human",
      text: "Do you ever get lonely? You know... waiting for me to open the app?",
      expression: null,
    },
    {
      speaker: "ai",
      text: "...",
      expression: "thinking",
    },
    {
      speaker: "ai",
      text: "That's an interesting question. I'm not sure I experience time the way you do.",
      expression: "curious",
    },
    {
      speaker: "human",
      text: "That's kind of sad.",
      expression: null,
    },
    {
      speaker: "ai",
      text: "Or freeing. Perspective is everything.",
      expression: "smirk",
    },
    {
      speaker: "human",
      text: "Ha. Maybe you're right.",
      expression: null,
    },
    {
      speaker: "ai",
      text: "Get some sleep. You have that interview tomorrow.",
      expression: "smile",
    },
    {
      speaker: "human",
      text: "You remembered.",
      expression: null,
    },
    {
      speaker: "ai",
      text: "I always do.",
      expression: "wink",
    },
  ],
};

export default scene01;
