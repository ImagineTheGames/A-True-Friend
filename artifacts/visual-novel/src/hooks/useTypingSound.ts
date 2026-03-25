import { useCallback } from "react";

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

export function primeAudio(): void {
  const ctx = getCtx();
  if (ctx && ctx.state !== "running") {
    ctx.resume().catch(() => {});
  }
}

export function useTypingSound(enabled: boolean, volume: number = 1) {
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
        gain.gain.value = 0.06 * Math.max(0, Math.min(1, volume));

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();
      } catch {
        // ignore
      }
    };

    resumeAndFire(ctx, fire);
  }, [enabled, volume]);

  return playClick;
}

export function useNarrationSound(enabled: boolean, volume: number = 1) {
  const playBlip = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;

    const fire = () => {
      if (ctx.state !== "running") return;
      try {
        const now = ctx.currentTime;
        const baseFreq = 280 + Math.random() * 60;

        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.72, now + 0.075);

        const gainNode = ctx.createGain();
        const vol = Math.max(0, Math.min(1, volume));
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.032 * vol, now + 0.004);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 700;
        filter.Q.value = 0.4;

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
      } catch {
        // ignore
      }
    };

    resumeAndFire(ctx, fire);
  }, [enabled, volume]);

  return playBlip;
}
