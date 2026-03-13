import { GameSettings, ReadingSpeed, SPEED_CONFIG } from "../data/types";

interface Props {
  settings: GameSettings;
  onChange: (patch: Partial<GameSettings>) => void;
  onClose: () => void;
}

const speeds: ReadingSpeed[] = ["slow", "normal", "fast", "vfast"];

export default function SettingsPanel({ settings, onChange, onClose }: Props) {
  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <span className="settings-title">⚙ Settings</span>
          <button className="settings-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="settings-body">

          <div className="settings-section">
            <div className="settings-row">
              <div className="settings-label-block">
                <span className="settings-label">Typing sounds</span>
                <span className="settings-desc">Keyboard click as text appears</span>
              </div>
              <button
                className={`toggle-btn ${settings.soundEnabled ? "on" : "off"}`}
                onClick={() => onChange({ soundEnabled: !settings.soundEnabled })}
                aria-pressed={settings.soundEnabled}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>

          <div className="settings-divider" />

          <div className="settings-section">
            <div className="settings-row">
              <div className="settings-label-block">
                <span className="settings-label">Auto-continue</span>
                <span className="settings-desc">Advance lines automatically after reading</span>
              </div>
              <button
                className={`toggle-btn ${settings.autoContinue ? "on" : "off"}`}
                onClick={() => onChange({ autoContinue: !settings.autoContinue })}
                aria-pressed={settings.autoContinue}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>

          <div className="settings-divider" />

          <div className="settings-section">
            <div className="settings-label-block" style={{ marginBottom: "0.75rem" }}>
              <span className="settings-label">Reading speed</span>
              <span className="settings-desc">Controls typing pace{settings.autoContinue ? " and pause between lines" : ""}</span>
            </div>
            <div className="speed-options">
              {speeds.map((s) => (
                <button
                  key={s}
                  className={`speed-btn ${settings.readingSpeed === s ? "selected" : ""}`}
                  onClick={() => onChange({ readingSpeed: s })}
                >
                  {SPEED_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
