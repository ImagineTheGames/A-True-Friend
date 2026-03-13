import { Scene } from "../data/types";

interface Props {
  scenes: Scene[];
  currentIndex: number;
  completedScenes: Set<string>;
  onSelectScene: (index: number) => void;
  onOpenSettings: () => void;
  onReturnToMenu: () => void;
}

export default function SceneNav({
  scenes,
  currentIndex,
  completedScenes,
  onSelectScene,
  onOpenSettings,
  onReturnToMenu,
}: Props) {
  return (
    <div className="scene-nav-overlay">
      <div className="scene-nav-panel">
        <div className="scene-nav-header">
          <span className="scene-nav-title">Chapters</span>
        </div>

        <div className="scene-nav-list">
          {scenes.map((scene, i) => {
            const isCurrent = i === currentIndex;
            const isDone = completedScenes.has(scene.id);

            return (
              <button
                key={scene.id}
                className={`scene-nav-item ${isCurrent ? "current" : ""} ${isDone ? "done" : ""}`}
                onClick={() => onSelectScene(i)}
              >
                <span className="snav-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="snav-name">{scene.title}</span>
                {isCurrent && <span className="snav-badge current-badge">▶ Now</span>}
                {isDone && !isCurrent && <span className="snav-badge done-badge">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="scene-nav-footer">
          <button className="scene-nav-menu-btn" onClick={onOpenSettings}>
            Options
          </button>
          <button className="scene-nav-menu-btn" onClick={onReturnToMenu}>
            ← Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
