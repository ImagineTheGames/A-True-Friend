import { useEffect, useState } from "react";
import { Scene, DialogueLine, AiExpression } from "../data/types";
import SceneBackground from "../components/SceneBackground";
import HumanCharacter from "../components/HumanCharacter";
import AiCharacter from "../components/AiCharacter";
import DialogueBox from "../components/DialogueBox";

interface Props {
  scene: Scene;
  onSceneEnd: () => void;
}

export default function GameScene({ scene, onSceneEnd }: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [lineComplete, setLineComplete] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<AiExpression>("neutral");

  const currentLine: DialogueLine = scene.lines[lineIndex];
  const isLastLine = lineIndex === scene.lines.length - 1;

  useEffect(() => {
    setLineIndex(0);
    setLineComplete(false);
    setCurrentExpression("neutral");
  }, [scene]);

  useEffect(() => {
    if (currentLine.speaker === "ai" && currentLine.expression !== null) {
      setCurrentExpression(currentLine.expression);
    }
  }, [currentLine]);

  const handleLineComplete = () => {
    setLineComplete(true);
  };

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

      <div className="scene-title-chip">{scene.title}</div>

      <div className="characters-stage">
        <div className="character-slot left">
          <HumanCharacter
            isSpeaking={humanSpeaking}
            isActive={currentLine.speaker === "human"}
          />
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
      />
    </div>
  );
}
