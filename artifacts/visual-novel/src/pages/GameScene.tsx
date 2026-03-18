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
import SceneNav from "../components/SceneNav";
import SettingsPanel from "../components/SettingsPanel";

interface Props {
  scene: Scene;
  sceneIndex: number;
  allScenes: Scene[];
  completedScenes: Set<string>;
  settings: GameSettings;
  onSettingsChange: (patch: Partial<GameSettings>) => void;
  onSceneEnd: () => void;
  onGoToScene: (index: number) => void;
  onReturnToMenu: () => void;
}

// Resolve which characters appear and on which side for a given scene.
// If the scene declares a cast, use it; otherwise fall back to each
// character's defaultSide from the config.
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

// Build the map DialogueBox uses to resolve speaker names and dialogue styles.
const characterMap = Object.fromEntries(
  storyConfig.characters.map((c) => [c.id, { name: c.name, styleRole: c.styleRole }])
);

export default function GameScene({
  scene,
  sceneIndex,
  allScenes,
  completedScenes,
  settings,
  onSettingsChange,
  onSceneEnd,
  onGoToScene,
  onReturnToMenu,
}: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [lineComplete, setLineComplete] = useState(false);
  // Per-character expression state — each character keeps its last expression
  // until explicitly changed by a new line.
  const [expressions, setExpressions] = useState<Record<string, Expression>>({});
  const [navOpen, setNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const currentLine: DialogueLine = scene.lines[lineIndex];
  const isLastLine = lineIndex === scene.lines.length - 1;
  const nextScene = allScenes[sceneIndex + 1] ?? null;
  const locationLabel = getBackgroundLabel(scene.background);
  const isNarration = currentLine.speaker === "narration";

  // Resolve active cast once per scene change.
  const activeCast = useMemo(() => resolveActiveCast(scene), [scene]);

  // Determine left/right character slots for stable two-slot layout.
  const leftSlot  = activeCast.find((s) => s.side === "left")  ?? null;
  const rightSlot = activeCast.find((s) => s.side === "right") ?? null;

  useEffect(() => {
    setLineIndex(0);
    setLineComplete(false);
    setExpressions({});
    setNavOpen(false);
    setSettingsOpen(false);
  }, [scene]);

  useEffect(() => {
    // Update the speaking character's expression when a new line arrives.
    if (currentLine.expression !== null && currentLine.speaker !== "narration") {
      setExpressions((prev) => ({
        ...prev,
        [currentLine.speaker]: currentLine.expression,
      }));
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

  // Helpers for rendering a character component in a given slot.
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
          onClick={() => { setNavOpen((o) => !o); setSettingsOpen(false); }}
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
          onOpenSettings={() => { setNavOpen(false); setSettingsOpen(true); }}
          onReturnToMenu={() => { setNavOpen(false); onReturnToMenu(); }}
        />
      )}

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onChange={onSettingsChange}
          onClose={() => setSettingsOpen(false)}
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
        isLastLine={isLastLine}
        nextSceneName={nextScene?.title ?? null}
        settings={settings}
        characterMap={characterMap}
      />
    </div>
  );
}
