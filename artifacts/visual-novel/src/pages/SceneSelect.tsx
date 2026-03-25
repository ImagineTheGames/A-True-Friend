import { useState } from "react";
import { Scene, GameSettings } from "../data/types";
import storyConfig from "../data/story.config";
import SceneNav from "../components/SceneNav";

interface Props {
  scenes: Scene[];
  allScenes: Scene[];
  completedScenes: Set<string>;
  settings: GameSettings;
  onSettingsChange: (patch: Partial<GameSettings>) => void;
  onSelect: (scene: Scene) => void;
}

export default function SceneSelect({
  scenes,
  allScenes,
  completedScenes,
  settings,
  onSettingsChange,
  onSelect,
}: Props) {
  const [view, setView] = useState<"title" | "scenes">("title");
  const [navOpen, setNavOpen] = useState(false);

  const chapters = storyConfig.chapters;
  const hasChapters = chapters && chapters.length > 0;

  const firstChapterTitle = hasChapters ? chapters[0].title : null;
  const [openChapters, setOpenChapters] = useState<Set<string>>(
    () => new Set(firstChapterTitle ? [firstChapterTitle] : [])
  );

  function toggleChapter(title: string) {
    setOpenChapters((prev) => {
      if (prev.has(title)) return new Set<string>();
      return new Set([title]);
    });
  }

  function renderSceneCard(scene: Scene) {
    const isDone = completedScenes.has(scene.id);
    const globalIndex = allScenes.indexOf(scene);
    return (
      <button
        key={scene.id}
        className={`scene-card unlocked ${isDone ? "done" : ""}`}
        onClick={() => onSelect(scene)}
      >
        <span className="scene-num">Scene {String(globalIndex + 1).padStart(2, "0")}</span>
        <span className="scene-name">{scene.title}</span>
        {isDone && <span className="scene-check">✓</span>}
      </button>
    );
  }

  return (
    <div className="scene-select-page">
      <div className="scene-select-bg" />

      {view === "scenes" && (
        <button
          className="nav-toggle-btn menu-page-nav-btn"
          onClick={() => setNavOpen((o) => !o)}
          aria-label="Scene navigation"
        >
          <span className="nav-toggle-icon">{navOpen ? "✕" : "☰"}</span>
        </button>
      )}

      {navOpen && (
        <SceneNav
          scenes={scenes}
          allScenes={allScenes}
          currentIndex={-1}
          completedScenes={completedScenes}
          hideMenuButton
          settings={settings}
          onSettingsChange={onSettingsChange}
          onSelectScene={(i) => { setNavOpen(false); onSelect(scenes[i]); }}
          onClose={() => setNavOpen(false)}
        />
      )}

      <div className="scene-select-content">
        {view === "title" && (
          <div className="title-block">
            <h1 className="game-title">{storyConfig.title}</h1>
            <p className="game-subtitle">{storyConfig.subtitle}</p>
          </div>
        )}

        {view === "title" && (
          <button className="play-btn" onClick={() => setView("scenes")}>
            Play
          </button>
        )}

        {view === "scenes" && (
          <>
            <p className="scene-hint">Select a scene to begin</p>

            {hasChapters ? (
              <div className="chapter-accordion">
                {chapters.map((chapter) => {
                  const chapterScenes = scenes.filter((s) =>
                    chapter.sceneIds.includes(s.id)
                  );
                  const isOpen = openChapters.has(chapter.title);
                  return (
                    <div key={chapter.title} className="chapter-section">
                      <button
                        className={`chapter-header ${isOpen ? "open" : ""}`}
                        onClick={() => toggleChapter(chapter.title)}
                        aria-expanded={isOpen}
                      >
                        <span className="chapter-title">{chapter.title}</span>
                        <span className="chapter-chevron">{isOpen ? "▲" : "▼"}</span>
                      </button>
                      <div className={`chapter-scenes ${isOpen ? "open" : ""}`}>
                        <div className="chapter-scenes-inner">
                          {chapterScenes.map(renderSceneCard)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="scene-list">
                {scenes.map(renderSceneCard)}
              </div>
            )}

            <button className="back-to-title-btn" onClick={() => setView("title")}>
              ← Back to title
            </button>
          </>
        )}
      </div>
    </div>
  );
}
