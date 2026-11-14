let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playTone(
  frequency: number,
  durationSec: number,
  type: OscillatorType = 'triangle',
  volume: number = 0.12,
  delaySec: number = 0
): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  } catch {
    // Ignore audio errors if blocked by browser autoplay policy
  }
}

export function playWheelTick(enabled: boolean): void {
  if (!enabled) return;
  playTone(720, 0.045, 'square', 0.06);
}

export function playHeroFanfare(enabled: boolean): void {
  if (!enabled) return;
  // Bright major hero arpeggio: C5 - E5 - G5 - C6
  playTone(523.25, 0.14, 'triangle', 0.14, 0);
  playTone(659.25, 0.14, 'triangle', 0.14, 0.09);
  playTone(783.99, 0.16, 'triangle', 0.15, 0.18);
  playTone(1046.5, 0.35, 'sawtooth', 0.1, 0.27);
}

export function playGrandPrizeChord(enabled: boolean): void {
  if (!enabled) return;
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
  notes.forEach((freq, i) => {
    playTone(freq, 0.25 + i * 0.04, 'triangle', 0.13, i * 0.075);
  });
}

export function playTapClick(enabled: boolean): void {
  if (!enabled) return;
  playTone(440, 0.04, 'sine', 0.06);
}
