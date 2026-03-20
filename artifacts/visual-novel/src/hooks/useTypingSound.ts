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

function resumeAndFire(ctx: AudioContext, fire: () => void) {
  if (ctx.state === "suspended") {
    ctx.resume().then(fire).catch(() => {});
  } else {
    fire();
  }
}

// Call this directly inside any click/keydown handler (i.e. from a user gesture).
// Browsers block AudioContext.resume() when called from setInterval/setTimeout —
// priming here ensures the context is "running" before the typing interval fires.
export function primeAudio(): void {
  const ctx = getCtx();
  if (ctx && ctx.state !== "running") {
    ctx.resume().catch(() => {});
  }
}

// ── Keyboard-click sound for dialogue ──────────────────────────────
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

    resumeAndFire(ctx, fire);
  }, [enabled]);

  return playClick;
}

// ── Soft digital-sine blip for narration ───────────────────────────
// A short downward sine sweep (300 → 220 Hz) — digital but calm,
// nothing like the keyboard noise used for dialogue.
export function useNarrationSound(enabled: boolean) {
  const playBlip = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;

    const fire = () => {
      if (ctx.state !== "running") return;
      try {
        const now = ctx.currentTime;
        const baseFreq = 280 + Math.random() * 60; // 280–340 Hz

        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq, now);
        // Gentle downward pitch drift — gives a "settling" digital feel
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.72, now + 0.075);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.032, now + 0.004); // soft attack
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085); // smooth decay

        // Low-pass to strip harshness
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 700;
        filter.Q.value = 0.4;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
      } catch {
        // ignore
      }
    };

    resumeAndFire(ctx, fire);
  }, [enabled]);

  return playBlip;
}
