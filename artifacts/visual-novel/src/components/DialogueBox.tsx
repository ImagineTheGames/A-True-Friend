import { useEffect, useRef, useState } from "react";
import { DialogueLine, GameSettings, SPEED_CONFIG } from "../data/types";
import { useTypingSound } from "../hooks/useTypingSound";

interface Props {
  line: DialogueLine;
  onComplete: () => void;
  onAdvance: () => void;
  isLastLine: boolean;
  nextSceneName: string | null;
  settings: GameSettings;
}

const HUMAN_NAME = "Kai";
const AI_NAME = "ARIA";

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const m = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g);
  return m ? Math.max(1, m.length) : 1;
}

function calcAutoContinueMs(text: string, wpm: number): number {
  const words = text.trim().split(/\s+/);
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const avgSyl = syllables / Math.max(1, words.length);
  const adjustedWpm = wpm / Math.max(0.8, avgSyl / 1.5);
  const readMs = (words.length / adjustedWpm) * 60000;
  return Math.max(1200, readMs + 500);
}

export default function DialogueBox({
  line,
  onComplete,
  onAdvance,
  isLastLine,
  nextSceneName,
  settings,
}: Props) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoTotalRef = useRef(0);
  const autoElapsedRef = useRef(0);
  const lastSoundRef = useRef(0);
  const mutedUntilRef = useRef(0);
  const playClick = useTypingSound(settings.soundEnabled && line.speaker !== "narration");

  const speedCfg = SPEED_CONFIG[settings.readingSpeed];

  const clearAutoTimer = () => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    setAutoProgress(0);
    autoElapsedRef.current = 0;
  };

  const startAutoTimer = () => {
    clearAutoTimer();
    const total = calcAutoContinueMs(line.text, speedCfg.wpm);
    autoTotalRef.current = total;
    const tick = 50;
    autoTimerRef.current = setInterval(() => {
      autoElapsedRef.current += tick;
      const pct = Math.min(1, autoElapsedRef.current / total);
      setAutoProgress(pct);
      if (autoElapsedRef.current >= total) {
        clearAutoTimer();
        onAdvance();
      }
    }, tick);
  };

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    clearAutoTimer();
    setAutoProgress(0);

    lastSoundRef.current = 0;
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(line.text.slice(0, i));
      const ch = line.text[i - 1];
      const now = Date.now();
      if (ch && /\S/.test(ch) && now - lastSoundRef.current >= 55 && now >= mutedUntilRef.current) {
        playClick();
        lastSoundRef.current = now;
      }
      if (i >= line.text.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
        onComplete();
      }
    }, speedCfg.typingMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearAutoTimer();
    };
  }, [line, speedCfg.typingMs]);

  useEffect(() => {
    if (done && settings.autoContinue) {
      startAutoTimer();
    }
    return () => clearAutoTimer();
  }, [done, settings.autoContinue]);

  const handleClick = () => {
    if (!done) {
      mutedUntilRef.current = Date.now() + 200;
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayed(line.text);
      setDone(true);
      onComplete();
    } else {
      clearAutoTimer();
      onAdvance();
    }
  };

  const isNarration = line.speaker === "narration";
  const isAi = line.speaker === "ai";
  const isEnd = isLastLine && !nextSceneName;
  const speakerName = isAi ? AI_NAME : HUMAN_NAME;

  if (isNarration) {
    return (
      <div
        className="dialogue-box dialogue-narration"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && handleClick()}
      >
        {settings.autoContinue && done && !isEnd && (
          <div className="auto-progress-bar">
            <div className="auto-progress-fill" style={{ width: `${autoProgress * 100}%` }} />
          </div>
        )}

        <div className="narration-text">
          {displayed}
          {!done && <span className="typing-cursor narration-cursor">|</span>}
        </div>

        <div className="dialogue-hint">
          {done ? (
            isEnd ? (
              <span className="hint-end">[ END ]</span>
            ) : settings.autoContinue ? (
              <span className="hint-skip">Tap to skip wait</span>
            ) : isLastLine ? (
              <span className="hint-next">▶ Tap to continue — {nextSceneName}</span>
            ) : (
              <span className="hint-next">▶ Tap or press Enter to continue</span>
            )
          ) : (
            <span className="hint-skip">Tap to skip</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`dialogue-box ${isAi ? "dialogue-ai" : "dialogue-human"}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && handleClick()}
    >
      {settings.autoContinue && done && !isEnd && (
        <div className="auto-progress-bar">
          <div className="auto-progress-fill" style={{ width: `${autoProgress * 100}%` }} />
        </div>
      )}

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
          isEnd ? (
            <span className="hint-end">[ END ]</span>
          ) : settings.autoContinue ? (
            <span className="hint-skip">Tap to skip wait</span>
          ) : isLastLine ? (
            <span className="hint-next">▶ Tap to continue — {nextSceneName}</span>
          ) : (
            <span className="hint-next">▶ Tap or press Enter to continue</span>
          )
        ) : (
          <span className="hint-skip">Tap to skip</span>
        )}
      </div>
    </div>
  );
}
