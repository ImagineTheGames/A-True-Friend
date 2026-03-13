import { Scene } from "../data/types";

interface Props {
  scenes: Scene[];
  currentIndex: number;
  completedScenes: Set<string>;
  onSelectScene: (index: number) => void;
  onReturnToMenu: () => void;
}

export default function SceneNav({
  scenes,
  currentIndex,
  completedScenes,
  onSelectScene,
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
            const isUnlocked = i === 0 || completedScenes.has(scenes[i - 1].id) || isDone || isCurrent;

            return (
              <button
                key={scene.id}
                className={`scene-nav-item ${isCurrent ? "current" : ""} ${isDone ? "done" : ""} ${!isUnlocked ? "locked" : ""}`}
                onClick={() => isUnlocked && onSelectScene(i)}
                disabled={!isUnlocked}
              >
                <span className="snav-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="snav-name">{scene.title}</span>
                {isCurrent && <span className="snav-badge current-badge">▶ Now</span>}
                {isDone && !isCurrent && <span className="snav-badge done-badge">✓</span>}
                {!isUnlocked && <span className="snav-badge lock-badge">🔒</span>}
              </button>
            );
          })}
        </div>

        <div className="scene-nav-footer">
          <button className="scene-nav-menu-btn" onClick={onReturnToMenu}>
            ← Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
