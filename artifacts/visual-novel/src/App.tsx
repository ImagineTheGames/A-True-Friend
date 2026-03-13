import { useState } from "react";
import story from "./data/storyIndex";
import SceneSelect from "./pages/SceneSelect";
import GameScene from "./pages/GameScene";

type GameState = "menu" | "playing";

export default function App() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [completedScenes, setCompletedScenes] = useState<Set<string>>(new Set());

  const markComplete = (id: string) =>
    setCompletedScenes((prev) => new Set([...prev, id]));

  const handleSelectScene = (index: number) => {
    setActiveIndex(index);
    setGameState("playing");
  };

  const handleSceneEnd = () => {
    const current = story[activeIndex];
    if (current) markComplete(current.id);

    const nextIndex = activeIndex + 1;
    if (nextIndex < story.length) {
      setActiveIndex(nextIndex);
    } else {
      setGameState("menu");
    }
  };

  const handleGoToScene = (index: number) => {
    setActiveIndex(index);
    setGameState("playing");
  };

  const handleReturnToMenu = () => {
    setGameState("menu");
  };

  return (
    <div className="app-root">
      {gameState === "menu" && (
        <SceneSelect
          scenes={story}
          completedScenes={completedScenes}
          onSelect={(scene) => handleSelectScene(story.indexOf(scene))}
        />
      )}
      {gameState === "playing" && (
        <GameScene
          scene={story[activeIndex]}
          sceneIndex={activeIndex}
          allScenes={story}
          completedScenes={completedScenes}
          onSceneEnd={handleSceneEnd}
          onGoToScene={handleGoToScene}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
}
