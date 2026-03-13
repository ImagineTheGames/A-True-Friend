import { Scene } from "../data/types";

interface Props {
  scenes: Scene[];
  completedScenes: Set<string>;
  onSelect: (scene: Scene) => void;
}

export default function SceneSelect({ scenes, completedScenes, onSelect }: Props) {
  return (
    <div className="scene-select-page">
      <div className="scene-select-bg" />
      <div className="scene-select-content">
        <div className="title-block">
          <h1 className="game-title">ARIA</h1>
          <p className="game-subtitle">A Story Told in Signals</p>
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
