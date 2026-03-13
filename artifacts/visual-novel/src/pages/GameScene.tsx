import { useEffect, useState } from "react";
import { Scene, DialogueLine, AiExpression } from "../data/types";
import SceneBackground, { getBackgroundLabel } from "../components/SceneBackground";
import HumanCharacter from "../components/HumanCharacter";
import AiCharacter from "../components/AiCharacter";
import DialogueBox from "../components/DialogueBox";
import SceneNav from "../components/SceneNav";

interface Props {
  scene: Scene;
  sceneIndex: number;
  allScenes: Scene[];
  completedScenes: Set<string>;
  onSceneEnd: () => void;
  onGoToScene: (index: number) => void;
  onReturnToMenu: () => void;
}

export default function GameScene({
  scene,
  sceneIndex,
  allScenes,
  completedScenes,
  onSceneEnd,
  onGoToScene,
  onReturnToMenu,
}: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [lineComplete, setLineComplete] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<AiExpression>("neutral");
  const [navOpen, setNavOpen] = useState(false);

  const currentLine: DialogueLine = scene.lines[lineIndex];
  const isLastLine = lineIndex === scene.lines.length - 1;
  const nextScene = allScenes[sceneIndex + 1] ?? null;
  const locationLabel = getBackgroundLabel(scene.background);

  useEffect(() => {
    setLineIndex(0);
    setLineComplete(false);
    setCurrentExpression("neutral");
    setNavOpen(false);
  }, [scene]);

  useEffect(() => {
    if (currentLine.speaker === "ai" && currentLine.expression !== null) {
      setCurrentExpression(currentLine.expression);
    }
  }, [currentLine]);

  const handleLineComplete = () => setLineComplete(true);

  const handleAdvance = () => {
    if (isLastLine) {
      onSceneEnd();
    } else {
      setLineIndex((i) => i + 1);
      setLineComplete(false);
    }
  };

  const humanSpeaking = currentLine.speaker === "human" && !lineComplete;
  const aiSpeaking = currentLine.speaker === "ai" && !lineComplete;

  return (
    <div className="game-scene">
      <SceneBackground background={scene.background} />

      <div className="game-top-bar">
        <button
          className="nav-toggle-btn"
          onClick={() => setNavOpen((o) => !o)}
          aria-label="Scene navigation"
        >
          <span className="nav-toggle-icon">{navOpen ? "✕" : "☰"}</span>
        </button>

        <div className="top-bar-center">
          <span className="scene-title-chip">{scene.title}</span>
        </div>

        <div className="top-bar-right">
          {locationLabel && (
            <span className="scene-location-tag">{locationLabel}</span>
          )}
        </div>
      </div>

      {navOpen && (
        <SceneNav
          scenes={allScenes}
          currentIndex={sceneIndex}
          completedScenes={completedScenes}
          onSelectScene={(i) => { setNavOpen(false); onGoToScene(i); }}
          onReturnToMenu={() => { setNavOpen(false); onReturnToMenu(); }}
        />
      )}

      <div className="characters-stage">
        <div className="character-slot left">
          <HumanCharacter isSpeaking={humanSpeaking} isActive={currentLine.speaker === "human"} />
        </div>

        <div className="stage-divider" />

        <div className="character-slot right">
          <AiCharacter
            expression={currentExpression}
            isActive={currentLine.speaker === "ai"}
            isSpeaking={aiSpeaking}
          />
        </div>
      </div>

      <DialogueBox
        key={`${scene.id}-${lineIndex}`}
        line={currentLine}
        onComplete={handleLineComplete}
        onAdvance={handleAdvance}
        isLastLine={isLastLine}
        nextSceneName={nextScene?.title ?? null}
      />
    </div>
  );
}
