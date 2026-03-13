import { AiExpression } from "../data/types";
import AsciiExpression from "./AsciiExpression";

interface Props {
  expression: AiExpression;
  isActive: boolean;
  isSpeaking: boolean;
}

export default function AiCharacter({ expression, isActive, isSpeaking }: Props) {
  return (
    <div className={`ai-character ${isActive ? "active" : "inactive"}`} aria-hidden="true">
      <div className="monitor-wrap">
        <div className="monitor-shell">
          <div className="monitor-bezel">
            <div className="monitor-screen">
              <div className={`screen-content ${isSpeaking ? "screen-speaking" : ""}`}>
                <div className="screen-scanlines" />
                <div className="ai-face-container">
                  <div className="ai-system-text">ARIA_OS v2.1</div>
                  <div className="ascii-face-wrap">
                    <AsciiExpression expression={expression} />
                  </div>
                  <div className={`ai-status-bar ${isSpeaking ? "blinking" : ""}`}>
                    {isSpeaking ? "[ SPEAKING... ]" : "[ STANDBY ]"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="monitor-neck" />
          <div className="monitor-base" />
        </div>
        <div className="monitor-keyboard" />
      </div>
    </div>
  );
}
