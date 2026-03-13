import { useEffect, useRef, useState } from "react";
import { DialogueLine } from "../data/types";

interface Props {
  line: DialogueLine;
  onComplete: () => void;
  onAdvance: () => void;
  isLastLine: boolean;
}

const HUMAN_NAME = "Kai";
const AI_NAME = "ARIA";
const TYPING_SPEED_MS = 28;

export default function DialogueBox({ line, onComplete, onAdvance, isLastLine }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(line.text.slice(0, i));
      if (i >= line.text.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
        onComplete();
      }
    }, TYPING_SPEED_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [line]);

  const handleClick = () => {
    if (!done) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayed(line.text);
      setDone(true);
      onComplete();
    } else {
      onAdvance();
    }
  };

  const speakerName = line.speaker === "human" ? HUMAN_NAME : AI_NAME;
  const isAi = line.speaker === "ai";

  return (
    <div
      className={`dialogue-box ${isAi ? "dialogue-ai" : "dialogue-human"}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && handleClick()}
    >
      <div className="dialogue-name-tag">
        <span className={`name-badge ${isAi ? "name-ai" : "name-human"}`}>
          {speakerName}
        </span>
      </div>
      <div className="dialogue-text">
        {displayed}
        {!done && <span className="typing-cursor">|</span>}
      </div>
      <div className="dialogue-hint">
        {done ? (
          isLastLine ? (
            <span className="hint-end">[ END OF SCENE ]</span>
          ) : (
            <span className="hint-next">▶ Click or press Enter to continue</span>
          )
        ) : (
          <span className="hint-skip">Click to skip</span>
        )}
      </div>
    </div>
  );
}
