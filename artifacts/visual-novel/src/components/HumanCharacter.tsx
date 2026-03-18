import type { CharacterProps } from "../data/types";

export default function HumanCharacter({ isSpeaking, isActive }: CharacterProps) {
  return (
    <div
      className={`human-character ${isActive ? "active" : "inactive"}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 160 320"
        xmlns="http://www.w3.org/2000/svg"
        className="character-svg"
      >
        <defs>
          <style>{`
            .outline { stroke: #1a1a2e; stroke-width: 3; fill: none; }
            .skin { fill: #f4c99e; stroke: #c9956d; stroke-width: 2; }
            .hair { fill: #3d2b1f; stroke: #1a1a2e; stroke-width: 2; }
            .shirt { fill: #4a6fa5; stroke: #2c4a7a; stroke-width: 2; }
            .pants { fill: #2d3748; stroke: #1a202c; stroke-width: 2; }
            .mouth-open { fill: #b76e4a; }
            .mouth-closed { fill: #c27a58; }
            .eye { fill: #2d2d2d; }
            .cheek { fill: #f0a080; opacity: 0.4; }
          `}</style>
        </defs>

        <rect x="45" y="220" width="70" height="100" rx="4" className="pants" />
        <rect x="52" y="220" width="24" height="80" rx="4" className="pants" />
        <rect x="84" y="220" width="24" height="80" rx="4" className="pants" />

        <rect x="38" y="140" width="84" height="90" rx="8" className="shirt" />
        <rect x="14" y="148" width="32" height="70" rx="12" className="shirt" />
        <rect x="114" y="148" width="32" height="70" rx="12" className="shirt" />

        <ellipse cx="80" cy="110" rx="38" ry="44" className="skin" />
        <path d="M 44 90 Q 55 55 80 52 Q 105 55 116 90 Q 105 62 80 60 Q 55 62 44 90 Z" className="hair" />
        <path d="M 44 90 Q 42 75 48 68 Q 55 58 68 54" fill="none" stroke="#3d2b1f" strokeWidth="3" strokeLinecap="round" />
        <path d="M 116 90 Q 118 75 112 68 Q 105 58 92 54" fill="none" stroke="#3d2b1f" strokeWidth="3" strokeLinecap="round" />

        <ellipse cx="62" cy="108" rx="7" ry="7.5" fill="white" stroke="#c9956d" strokeWidth="1.5" />
        <ellipse cx="98" cy="108" rx="7" ry="7.5" fill="white" stroke="#c9956d" strokeWidth="1.5" />
        <circle cx="62" cy="109" r="4" className="eye" />
        <circle cx="98" cy="109" r="4" className="eye" />
        <circle cx="63" cy="108" r="1.2" fill="white" />
        <circle cx="99" cy="108" r="1.2" fill="white" />

        <ellipse cx="53" cy="120" rx="6" ry="3.5" className="cheek" />
        <ellipse cx="107" cy="120" rx="6" ry="3.5" className="cheek" />

        {isSpeaking ? (
          <ellipse cx="80" cy="130" rx="9" ry="6" className="mouth-open" />
        ) : (
          <path d="M 72 128 Q 80 135 88 128" fill="none" stroke="#c27a58" strokeWidth="2.5" strokeLinecap="round" />
        )}

        <ellipse cx="80" cy="112" rx="5" ry="4" fill="#f4c99e" stroke="#c9956d" strokeWidth="1" />
      </svg>
    </div>
  );
}
