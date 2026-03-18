import storyConfig from "../data/story.config";

interface Props {
  background: string;
}

const builtinBackgrounds: Record<string, { gradient: string; label: string }> = {
  "bedroom-night": {
    gradient: "linear-gradient(160deg, #0a0a1a 0%, #1a1a3e 40%, #0d1b2a 100%)",
    label: "Bedroom — Late Night",
  },
  "bedroom-day": {
    gradient: "linear-gradient(160deg, #f0c27f 0%, #e8a87c 30%, #d4a5a5 100%)",
    label: "Bedroom — Morning",
  },
  "cafe": {
    gradient: "linear-gradient(160deg, #c9a96e 0%, #8b6343 50%, #d4a76a 100%)",
    label: "Café",
  },
  "void": {
    gradient: "linear-gradient(160deg, #111 0%, #222 100%)",
    label: "",
  },
};

// Fork authors add extra backgrounds in story.config.ts → backgrounds: { ... }
const allBackgrounds = { ...builtinBackgrounds, ...(storyConfig.backgrounds ?? {}) };

export function getBackgroundLabel(background: string): string {
  return allBackgrounds[background]?.label ?? "";
}

export default function SceneBackground({ background }: Props) {
  const bg = allBackgrounds[background] ?? {
    gradient: "linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)",
  };
  return (
    <div className="scene-background" style={{ background: bg.gradient }}>
      <div className="bg-grid" />
      <div className="bg-vignette" />
    </div>
  );
}
