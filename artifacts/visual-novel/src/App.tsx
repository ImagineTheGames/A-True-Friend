import { useState } from "react";
import story from "./data/storyIndex";
import { Scene } from "./data/types";
import SceneSelect from "./pages/SceneSelect";
import GameScene from "./pages/GameScene";

type GameState = "menu" | "playing";

export default function App() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [completedScenes, setCompletedScenes] = useState<Set<string>>(new Set());

  const handleSelectScene = (scene: Scene) => {
    setActiveScene(scene);
    setGameState("playing");
  };

  const handleSceneEnd = () => {
    if (activeScene) {
      setCompletedScenes((prev) => new Set([...prev, activeScene.id]));
    }
    setGameState("menu");
    setActiveScene(null);
  };

  return (
    <div className="app-root">
      {gameState === "menu" && (
        <SceneSelect
          scenes={story}
          completedScenes={completedScenes}
          onSelect={handleSelectScene}
        />
      )}
      {gameState === "playing" && activeScene && (
        <GameScene scene={activeScene} onSceneEnd={handleSceneEnd} />
      )}
    </div>
  );
}
