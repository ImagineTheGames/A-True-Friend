import { useState } from "react";
import { Scene, GameSettings, ReadingSpeed, SPEED_CONFIG } from "../data/types";
import storyConfig from "../data/story.config";

const speeds: ReadingSpeed[] = ["slow", "normal", "fast", "vfast"];

interface Props {
  scenes: Scene[];
  allScenes: Scene[];
  currentIndex: number;
  completedScenes: Set<string>;
  hideMenuButton?: boolean;
  settings: GameSettings;
  onSettingsChange: (patch: Partial<GameSettings>) => void;
  onSelectScene: (index: number) => void;
  onReturnToMenu?: () => void;
  onClose?: () => void;
}

export default function SceneNav({
  scenes,
  allScenes,
  currentIndex,
  completedScenes,
  hideMenuButton = false,
  settings,
  onSettingsChange,
  onSelectScene,
  onReturnToMenu,
  onClose,
}: Props) {
  const [view, setView] = useState<"nav" | "options">("nav");
  const chapters = storyConfig.chapters;
  const hasChapters = chapters && chapters.length > 0;

  const firstChapterTitle = hasChapters ? chapters[0].title : null;
  const [openChapters, setOpenChapters] = useState<Set<string>>(
    () => new Set(firstChapterTitle ? [firstChapterTitle] : [])
  );

  function toggleChapter(title: string) {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  function renderSceneButton(scene: Scene, displayIndex: number) {
    const globalIndex = allScenes.indexOf(scene);
    const isCurrent = displayIndex === currentIndex;
    const isDone = completedScenes.has(scene.id);
    return (
      <button
        key={scene.id}
        className={`scene-nav-item ${isCurrent ? "current" : ""} ${isDone ? "done" : ""}`}
        onClick={() => onSelectScene(displayIndex)}
      >
        <span className="snav-num">{String(globalIndex + 1).padStart(2, "0")}</span>
        <span className="snav-name">{scene.title}</span>
        {isCurrent && <span className="snav-badge current-badge">▶ Now</span>}
        {isDone && !isCurrent && <span className="snav-badge done-badge">✓</span>}
      </button>
    );
  }

  return (
    <div className="scene-nav-overlay" onClick={onClose}>
      <div className="scene-nav-panel" onClick={(e) => e.stopPropagation()}>

        {view === "nav" && (
          <>
            <div className="scene-nav-header">
              <span className="scene-nav-title">Chapters</span>
            </div>

            <div className="scene-nav-list">
              {hasChapters ? (
                <div className="snav-chapter-accordion">
                  {chapters.map((chapter) => {
                    const chapterScenes = scenes.filter((s) =>
                      chapter.sceneIds.includes(s.id)
                    );
                    const isOpen = openChapters.has(chapter.title);
                    return (
                      <div key={chapter.title} className="snav-chapter-section">
                        <button
                          className={`snav-chapter-header ${isOpen ? "open" : ""}`}
                          onClick={() => toggleChapter(chapter.title)}
                          aria-expanded={isOpen}
                        >
                          <span className="snav-chapter-title">{chapter.title}</span>
                          <span className="snav-chapter-chevron">{isOpen ? "▲" : "▼"}</span>
                        </button>
                        <div className={`snav-chapter-scenes ${isOpen ? "open" : ""}`}>
                          <div className="snav-chapter-scenes-inner">
                            {chapterScenes.map((scene) => {
                              const displayIndex = scenes.indexOf(scene);
                              return renderSceneButton(scene, displayIndex);
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                scenes.map((scene, i) => renderSceneButton(scene, i))
              )}
            </div>

            <div className="scene-nav-footer">
              <button className="scene-nav-menu-btn" onClick={() => setView("options")}>
                Options
              </button>
              {!hideMenuButton && onReturnToMenu && (
                <button className="scene-nav-menu-btn" onClick={onReturnToMenu}>
                  ← Main Menu
                </button>
              )}
            </div>
          </>
        )}

        {view === "options" && (
          <>
            <div className="scene-nav-header snav-options-header">
              <button className="snav-back-btn" onClick={() => setView("nav")}>
                ← Back
              </button>
              <span className="scene-nav-title">Options</span>
            </div>

            <div className="snav-options">
              <div className="snav-option-row">
                <div className="snav-option-label-block">
                  <span className="snav-option-label">Typing sounds</span>
                  <span className="snav-option-desc">Keyboard click as text appears</span>
                </div>
                <button
                  className={`toggle-btn ${settings.soundEnabled ? "on" : "off"}`}
                  onClick={() => onSettingsChange({ soundEnabled: !settings.soundEnabled })}
                  aria-pressed={settings.soundEnabled}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>

              <div className="snav-option-divider" />

              <div className="snav-option-row">
                <div className="snav-option-label-block">
                  <span className="snav-option-label">Auto-continue</span>
                  <span className="snav-option-desc">Advance lines automatically</span>
                </div>
                <button
                  className={`toggle-btn ${settings.autoContinue ? "on" : "off"}`}
                  onClick={() => onSettingsChange({ autoContinue: !settings.autoContinue })}
                  aria-pressed={settings.autoContinue}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>

              <div className="snav-option-divider" />

              <div>
                <div className="snav-option-label-block" style={{ marginBottom: "0.6rem" }}>
                  <span className="snav-option-label">Reading speed</span>
                  <span className="snav-option-desc">
                    Controls typing pace{settings.autoContinue ? " & pause" : ""}
                  </span>
                </div>
                <div className="snav-speed-options">
                  {speeds.map((s) => (
                    <button
                      key={s}
                      className={`snav-speed-btn ${settings.readingSpeed === s ? "selected" : ""}`}
                      onClick={() => onSettingsChange({ readingSpeed: s })}
                    >
                      {SPEED_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="snav-option-divider" />

              <div>
                <div className="snav-option-label-block" style={{ marginBottom: "0.6rem" }}>
                  <span className="snav-option-label">Volume</span>
                  <span className="snav-option-desc">
                    {Math.round((settings.volume ?? 1) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round((settings.volume ?? 1) * 100)}
                  onChange={(e) => onSettingsChange({ volume: Number(e.target.value) / 100 })}
                  className="snav-volume-slider"
                />
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
