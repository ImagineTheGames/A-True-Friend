import { useState } from "react";
import { Scene, GameSettings } from "../data/types";
import storyConfig from "../data/story.config";
import SceneNav from "../components/SceneNav";
import SettingsPanel from "../components/SettingsPanel";

interface Props {
  scenes: Scene[];
  completedScenes: Set<string>;
  settings: GameSettings;
  onSettingsChange: (patch: Partial<GameSettings>) => void;
  onSelect: (scene: Scene) => void;
}

export default function SceneSelect({
  scenes,
  completedScenes,
  settings,
  onSettingsChange,
  onSelect,
}: Props) {
  const [navOpen, setNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="scene-select-page">
      <div className="scene-select-bg" />

      <button
        className="nav-toggle-btn menu-page-nav-btn"
        onClick={() => { setNavOpen((o) => !o); setSettingsOpen(false); }}
        aria-label="Scene navigation"
      >
        <span className="nav-toggle-icon">{navOpen ? "✕" : "☰"}</span>
      </button>

      {navOpen && (
        <SceneNav
          scenes={scenes}
          currentIndex={-1}
          completedScenes={completedScenes}
          hideMenuButton
          onSelectScene={(i) => { setNavOpen(false); onSelect(scenes[i]); }}
          onOpenSettings={() => { setNavOpen(false); setSettingsOpen(true); }}
        />
      )}

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onChange={onSettingsChange}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      <div className="scene-select-content">
        <div className="title-block">
          <h1 className="game-title">{storyConfig.title}</h1>
          <p className="game-subtitle">{storyConfig.subtitle}</p>
        </div>

        <div className="scene-list">
          {scenes.map((scene, i) => {
            const isDone = completedScenes.has(scene.id);
            return (
              <button
                key={scene.id}
                className={`scene-card unlocked ${isDone ? "done" : ""}`}
                onClick={() => onSelect(scene)}
              >
                <span className="scene-num">Scene {String(i + 1).padStart(2, "0")}</span>
                <span className="scene-name">{scene.title}</span>
                {isDone && <span className="scene-check">✓</span>}
              </button>
            );
          })}
        </div>

        <p className="scene-hint">Select a scene to begin</p>
      </div>
    </div>
  );
}
