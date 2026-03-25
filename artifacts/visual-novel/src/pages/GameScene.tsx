import { useEffect, useMemo, useState } from "react";
import {
  Scene,
  DialogueLine,
  Expression,
  GameSettings,
  CharacterConfig,
} from "../data/types";
import storyConfig from "../data/story.config";
import SceneBackground, { getBackgroundLabel } from "../components/SceneBackground";
import DialogueBox from "../components/DialogueBox";
import ChoiceBox from "../components/ChoiceBox";
import SceneNav from "../components/SceneNav";

interface Props {
  scene: Scene;
  sceneIndex: number;
  allScenes: Scene[];
  visibleScenes: Scene[];
  completedScenes: Set<string>;
  settings: GameSettings;
  onSettingsChange: (patch: Partial<GameSettings>) => void;
  onSceneEnd: () => void;
  onChoose: (sceneId: string) => void;
  onGoToScene: (index: number) => void;
  onReturnToMenu: () => void;
}

function resolveActiveCast(scene: Scene): Array<{ character: CharacterConfig; side: "left" | "right" }> {
  if (scene.cast && scene.cast.length > 0) {
    return scene.cast
      .map((slot) => {
        const character = storyConfig.characters.find((c) => c.id === slot.characterId);
        return character ? { character, side: slot.side } : null;
      })
      .filter((s): s is { character: CharacterConfig; side: "left" | "right" } => s !== null);
  }
  return storyConfig.characters.map((c) => ({ character: c, side: c.defaultSide }));
}

const characterMap = Object.fromEntries(
  storyConfig.characters.map((c) => [c.id, { name: c.name, styleRole: c.styleRole }])
);

export default function GameScene({
  scene,
  sceneIndex,
  allScenes,
  visibleScenes,
  completedScenes,
  settings,
  onSettingsChange,
  onSceneEnd,
  onChoose,
  onGoToScene,
  onReturnToMenu,
}: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [lineComplete, setLineComplete] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [expressions, setExpressions] = useState<Record<string, Expression>>({});
  const [expressionHistory, setExpressionHistory] = useState<Record<string, Expression>[]>([{}]);
  const [goingBack, setGoingBack] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const currentLine: DialogueLine = scene.lines[lineIndex];
  const isLastLine = lineIndex === scene.lines.length - 1;
  const hasChoices = !!(scene.choices && scene.choices.length > 0);
  const locationLabel = getBackgroundLabel(scene.background);

  const resolvedNextScene = useMemo(() => {
    if (hasChoices) return null;
    if (scene.nextSceneId) {
      return allScenes.find((s) => s.id === scene.nextSceneId) ?? null;
    }
    for (let i = sceneIndex + 1; i < allScenes.length; i++) {
      const candidate = allScenes[i];
      if (!candidate.requiresChoice || visibleScenes.includes(candidate)) {
        return candidate;
      }
    }
    return null;
  }, [scene, sceneIndex, allScenes, visibleScenes, hasChoices]);
  const isNarration = currentLine.speaker === "narration";

  const activeCast = useMemo(() => resolveActiveCast(scene), [scene]);
  const leftSlot  = activeCast.find((s) => s.side === "left")  ?? null;
  const rightSlot = activeCast.find((s) => s.side === "right") ?? null;

  useEffect(() => {
    setLineIndex(0);
    setLineComplete(false);
    setShowChoices(false);
    setExpressions({});
    setExpressionHistory([{}]);
    setGoingBack(false);
    setNavOpen(false);
  }, [scene]);

  useEffect(() => {
    if (goingBack) return;
    if (currentLine.expression !== null && currentLine.speaker !== "narration") {
      setExpressions((prev) => ({
        ...prev,
        [currentLine.speaker]: currentLine.expression,
      }));
    }
  }, [currentLine, goingBack]);

  const handleLineComplete = () => {
    setLineComplete(true);
    if (isLastLine && scene.choices && scene.choices.length > 0) {
      setShowChoices(true);
    }
  };

  const handleAdvance = () => {
    setGoingBack(false);
    if (isLastLine) {
      if (scene.choices && scene.choices.length > 0) {
        setShowChoices(true);
      } else {
        onSceneEnd();
      }
    } else {
      setExpressionHistory((prev) => {
        const next = [...prev];
        next[lineIndex + 1] = { ...expressions };
        return next;
      });
      setLineIndex((i) => i + 1);
      setLineComplete(false);
    }
  };

  const handleBack = () => {
    if (lineIndex === 0) return;
    const prevIndex = lineIndex - 1;
    const prevExpressions = expressionHistory[prevIndex] ?? {};
    setExpressions(prevExpressions);
    setGoingBack(true);
    setLineIndex(prevIndex);
    setLineComplete(true);
    setShowChoices(false);
  };

  function renderSlot(slot: { character: CharacterConfig; side: "left" | "right" } | null) {
    if (!slot) return null;
    const { character } = slot;
    const Comp = character.component;
    const isCurrent = currentLine.speaker === character.id;
    return (
      <Comp
        isActive={!isNarration && isCurrent}
        isSpeaking={!isNarration && isCurrent && !lineComplete}
        expression={expressions[character.id] ?? null}
      />
    );
  }

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
          scenes={visibleScenes}
          allScenes={allScenes}
          currentIndex={visibleScenes.indexOf(scene)}
          completedScenes={completedScenes}
          settings={settings}
          onSettingsChange={onSettingsChange}
          onSelectScene={(i) => {
            const globalIdx = allScenes.indexOf(visibleScenes[i]);
            setNavOpen(false);
            onGoToScene(globalIdx);
          }}
          onReturnToMenu={() => { setNavOpen(false); onReturnToMenu(); }}
          onClose={() => setNavOpen(false)}
        />
      )}

      <div className="characters-stage">
        <div className="character-slot left">
          {renderSlot(leftSlot)}
        </div>

        <div className="stage-divider" />

        <div className="character-slot right">
          {renderSlot(rightSlot)}
        </div>
      </div>

      <DialogueBox
        key={`${scene.id}-${lineIndex}`}
        line={currentLine}
        onComplete={handleLineComplete}
        onAdvance={handleAdvance}
        onBack={handleBack}
        isFirstLine={lineIndex === 0}
        instantReveal={goingBack}
        isLastLine={isLastLine}
        nextSceneName={resolvedNextScene?.title ?? null}
        hasChoices={hasChoices}
        settings={settings}
        characterMap={characterMap}
      />

      {showChoices && scene.choices && (
        <ChoiceBox
          choices={scene.choices}
          onChoose={onChoose}
        />
      )}
    </div>
  );
}
