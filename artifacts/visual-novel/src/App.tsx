import { useEffect, useState } from "react";
import story from "./data/storyIndex";
import storyConfig from "./data/story.config";
import SceneSelect from "./pages/SceneSelect";
import GameScene from "./pages/GameScene";
import { useSettings } from "./hooks/useSettings";
import { primeAudio } from "./hooks/useTypingSound";

type GameState = "menu" | "playing";

export default function App() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [completedScenes, setCompletedScenes] = useState<Set<string>>(new Set());
  const [chosenSceneIds, setChosenSceneIds] = useState<Set<string>>(new Set());
  const { settings, updateSettings } = useSettings();

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

  const isSceneAccessible = (scene: typeof story[number]) => {
    if (!scene.requiresChoice) return true;
    return chosenSceneIds.has(scene.requiresChoice);
  };

  const findNextValidIndex = (fromIndex: number): number | null => {
    for (let i = fromIndex; i < story.length; i++) {
      if (isSceneAccessible(story[i])) return i;
    }
    return null;
  };

  const handleSelectScene = (index: number) => {
    primeAudio();
    setActiveIndex(index);
    setGameState("playing");
  };

  const handleSceneEnd = () => {
    const current = story[activeIndex];
    if (current) markComplete(current.id);

    if (current?.nextSceneId) {
      const targetIndex = story.findIndex((s) => s.id === current.nextSceneId);
      if (targetIndex !== -1 && isSceneAccessible(story[targetIndex])) {
        setActiveIndex(targetIndex);
        return;
      }
    }

    const nextValid = findNextValidIndex(activeIndex + 1);
    if (nextValid !== null) {
      setActiveIndex(nextValid);
    } else {
      setGameState("menu");
    }
  };

  const handleGoToScene = (index: number) => {
    setActiveIndex(index);
    setGameState("playing");
  };

  const handleChoose = (sceneId: string) => {
    const current = story[activeIndex];
    if (current) markComplete(current.id);
    setChosenSceneIds((prev) => new Set([...prev, sceneId]));
    const targetIndex = story.findIndex((s) => s.id === sceneId);
    if (targetIndex !== -1) {
      setActiveIndex(targetIndex);
      setGameState("playing");
    }
  };

  const visibleScenes = story.filter(isSceneAccessible);

  return (
    <div className="app-root">
      {gameState === "menu" && (
        <SceneSelect
          scenes={visibleScenes}
          allScenes={story}
          completedScenes={completedScenes}
          settings={settings}
          onSettingsChange={updateSettings}
          onSelect={(scene) => handleSelectScene(story.indexOf(scene))}
        />
      )}
      {gameState === "playing" && (
        <GameScene
          key={story[activeIndex]?.id}
          scene={story[activeIndex]}
          sceneIndex={activeIndex}
          allScenes={story}
          visibleScenes={visibleScenes}
          completedScenes={completedScenes}
          settings={settings}
          onSettingsChange={updateSettings}
          onSceneEnd={handleSceneEnd}
          onChoose={handleChoose}
          onGoToScene={handleGoToScene}
          onReturnToMenu={() => setGameState("menu")}
        />
      )}
    </div>
  );
}
