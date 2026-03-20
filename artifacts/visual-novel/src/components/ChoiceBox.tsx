import { Choice } from "../data/types";

interface Props {
  choices: Choice[];
  onChoose: (sceneId: string) => void;
}

export default function ChoiceBox({ choices, onChoose }: Props) {
  return (
    <div className="choice-box-overlay">
      <div className="choice-box">
        <div className="choice-box-header">Make your choice…</div>
        <div className="choice-list">
          {choices.map((choice) => (
            <button
              key={`${choice.nextSceneId}:${choice.label}`}
              className="choice-btn"
              onClick={() => onChoose(choice.nextSceneId)}
            >
              <span className="choice-arrow">▶</span>
              <span className="choice-label">{choice.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
