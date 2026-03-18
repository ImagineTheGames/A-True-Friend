import { useEffect, useState } from "react";
import story from "./data/storyIndex";
import storyConfig from "./data/story.config";
import SceneSelect from "./pages/SceneSelect";
import GameScene from "./pages/GameScene";
import { useSettings } from "./hooks/useSettings";

type GameState = "menu" | "playing";

export default function App() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [completedScenes, setCompletedScenes] = useState<Set<string>>(new Set());
  const { settings, updateSettings } = useSettings();

  // Apply any CSS custom-property overrides declared in story.config.ts → theme.
  // Fork authors can retheme the entire game without touching index.css.
  useEffect(() => {
    const { theme } = storyConfig;
    if (!theme) return;
    const root = document.documentElement;
    Object.entries(theme).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });
  }, []);

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

  return (
    <div className="app-root">
      {gameState === "menu" && (
        <SceneSelect
          scenes={story}
          completedScenes={completedScenes}
          settings={settings}
          onSettingsChange={updateSettings}
          onSelect={(scene) => handleSelectScene(story.indexOf(scene))}
        />
      )}
      {gameState === "playing" && (
        <GameScene
          scene={story[activeIndex]}
          sceneIndex={activeIndex}
          allScenes={story}
          completedScenes={completedScenes}
          settings={settings}
          onSettingsChange={updateSettings}
          onSceneEnd={handleSceneEnd}
          onGoToScene={handleGoToScene}
          onReturnToMenu={() => setGameState("menu")}
        />
      )}
    </div>
  );
}
