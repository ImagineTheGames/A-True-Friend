import { useCallback } from "react";

// Single AudioContext shared for the entire session.
// Creating a new one per component causes browsers to hit their instance limit
// (~6-32 contexts) after just a few line advances, silently killing audio.
let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!_ctx || _ctx.state === "closed") {
      _ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return _ctx;
  } catch {
    return null;
  }
}

export function useTypingSound(enabled: boolean) {
  const playClick = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;

    const fire = () => {
      if (ctx.state !== "running") return;
      try {
        const duration = 0.045;
        const bufferSize = Math.ceil(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          const t = i / bufferSize;
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 6) * 0.9;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 900 + Math.random() * 300;
        filter.Q.value = 1.2;

        const gain = ctx.createGain();
        gain.gain.value = 0.06;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();
      } catch {
        // ignore
      }
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(fire).catch(() => {});
    } else {
      fire();
    }
  }, [enabled]);

  return playClick;
}
