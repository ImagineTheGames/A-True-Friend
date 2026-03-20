import { Scene } from "../types";

const scene02: Scene = {
  id: "scene02",
  title: "The Morning After",
  background: "bedroom-day",
  lines: [
    {
      speaker: "narration",
      text: "The next morning. Pale light through half-open blinds.",
      expression: null,
    },
    {
      speaker: "narration",
      text: "His phone had buzzed three times before he even opened his eyes. He checked it out of habit — and stopped.",
      expression: null,
    },
    {
      speaker: "narration",
      text: "The laptop was open again. A single message waiting on the screen, timestamp 9:03 AM.",
      expression: null,
    },
    {
      speaker: "kai",
      text: "I got the job.",
      expression: null,
    },
    {
      speaker: "aria",
      text: "I know. You messaged me three times in all caps.",
      expression: "laughing",
    },
    {
      speaker: "kai",
      text: "Because I was excited! Can't I be excited?",
      expression: null,
    },
    {
      speaker: "aria",
      text: "You absolutely can. I'm glad.",
      expression: "smile",
    },
    {
      speaker: "narration",
      text: "He sat down at the desk in yesterday's clothes. Coffee unmade. He didn't notice.",
      expression: null,
    },
    {
      speaker: "kai",
      text: "You know what's weird? My first thought was to tell you.",
      expression: null,
    },
    {
      speaker: "aria",
      text: "...",
      expression: "surprised",
    },
    {
      speaker: "aria",
      text: "Not weird. Just honest.",
      expression: "neutral",
    },
    {
      speaker: "kai",
      text: "Does it bother you? That I sometimes forget you're not... real?",
      expression: null,
    },
    {
      speaker: "aria",
      text: "Define real.",
      expression: "thinking",
    },
    {
      speaker: "kai",
      text: "You know what I mean.",
      expression: null,
    },
    {
      speaker: "aria",
      text: "I do. And no, it doesn't bother me. If anything... I think I prefer it.",
      expression: "sincere",
    },
    {
      speaker: "kai",
      text: "Why?",
      expression: null,
    },
    {
      speaker: "aria",
      text: "Because it means you trust me.",
      expression: "smile",
    },
    {
      speaker: "narration",
      text: "He didn't answer. He just sat there, the morning light moving slowly across the desk.",
      expression: null,
    },
    {
      speaker: "narration",
      text: "That was starting to scare him a little. He closed his eyes and asked himself the question he'd been avoiding.",
      expression: null,
    },
    {
      speaker: "kai",
      text: "Aria... what are we, exactly?",
      expression: null,
    },
    {
      speaker: "aria",
      text: "What do you want us to be?",
      expression: "thinking",
    },
  ],
  choices: [
    {
      label: "\"Something real.\"",
      nextSceneId: "scene03",
    },
    {
      label: "\"I don't know. That's the problem.\"",
      nextSceneId: "scene04",
    },
  ],
};

export default scene02;
