import type { HeroId } from '../types/hifz';

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

function playSweep(
  startFreq: number,
  endFreq: number,
  durationSec: number,
  type: OscillatorType = 'sine',
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
    osc.frequency.setValueAtTime(Math.max(20, startFreq), now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + durationSec);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + Math.min(0.03, durationSec * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  } catch {
    // Ignore audio errors
  }
}

function playFilteredNoiseBurst(
  centerFreq: number,
  qFactor: number,
  filterType: BiquadFilterType,
  durationSec: number,
  volume: number = 0.12,
  delaySec: number = 0
): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + delaySec;
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(centerFreq, now);
    filter.Q.setValueAtTime(qFactor, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    src.start(now);
    src.stop(now + durationSec + 0.02);
  } catch {
    // Ignore audio errors
  }
}

export function playWheelTick(enabled: boolean): void {
  if (!enabled) return;
  playTone(720, 0.045, 'square', 0.06);
}

/**
 * Plays a distinct Avengers superhero theme sound effect + celebration fanfare
 * tailored to whichever Avenger avatar the student is using.
 */
export function playHeroThemeSound(
  heroId: HeroId,
  enabled: boolean,
  intensity: 'normal' | 'grand' = 'normal'
): void {
  if (!enabled) return;

  switch (heroId) {
    case 'iron-hafiz': {
      // Arc-reactor charge-up sweep -> repulsor blast -> heroic Iron brass fanfare
      playSweep(210, 920, 0.24, 'sawtooth', 0.09, 0);
      playSweep(1100, 180, 0.18, 'triangle', 0.14, 0.22);
      playFilteredNoiseBurst(1600, 1.5, 'bandpass', 0.14, 0.09, 0.22);
      playTone(523.25, 0.14, 'triangle', 0.13, 0.36);
      playTone(659.25, 0.14, 'triangle', 0.13, 0.45);
      playTone(783.99, 0.18, 'triangle', 0.14, 0.54);
      playTone(1046.5, 0.38, 'sawtooth', 0.08, 0.64);
      break;
    }
    case 'captain-noor': {
      // Vibranium shield metallic ping + ricochet -> classic heroic bugle march
      playTone(1174.66, 0.18, 'triangle', 0.14, 0);
      playTone(1760, 0.22, 'sine', 0.08, 0.01);
      playTone(1318.51, 0.16, 'triangle', 0.11, 0.14);
      playTone(392.0, 0.12, 'sawtooth', 0.08, 0.32);
      playTone(523.25, 0.12, 'sawtooth', 0.09, 0.43);
      playTone(659.25, 0.15, 'sawtooth', 0.09, 0.54);
      playTone(783.99, 0.36, 'triangle', 0.14, 0.66);
      break;
    }
    case 'spidey-reciter': {
      // Double web-shooter "thwip-thwip!" + agile upbeat hero riff
      playFilteredNoiseBurst(2600, 3.2, 'bandpass', 0.11, 0.13, 0);
      playSweep(440, 1480, 0.1, 'sine', 0.11, 0);
      playFilteredNoiseBurst(2900, 3.2, 'bandpass', 0.11, 0.13, 0.16);
      playSweep(520, 1680, 0.1, 'sine', 0.11, 0.16);
      playTone(587.33, 0.11, 'triangle', 0.13, 0.32);
      playTone(739.99, 0.11, 'triangle', 0.13, 0.41);
      playTone(880.0, 0.14, 'triangle', 0.14, 0.50);
      playTone(1174.66, 0.32, 'triangle', 0.13, 0.60);
      break;
    }
    case 'wakanda-guardian': {
      // Punchy Wakandan kinetic drum beats + shimmering vibranium chord
      playSweep(115, 48, 0.14, 'sine', 0.18, 0);
      playSweep(115, 48, 0.14, 'sine', 0.18, 0.15);
      playTone(622.25, 0.22, 'triangle', 0.12, 0.30);
      playTone(739.99, 0.22, 'sine', 0.12, 0.38);
      playTone(932.33, 0.26, 'triangle', 0.13, 0.46);
      playTone(1244.51, 0.38, 'sine', 0.11, 0.55);
      break;
    }
    case 'thunder-qari': {
      // Rolling thunder crack -> epic Norse power-chord fifths
      playSweep(95, 36, 0.36, 'sine', 0.2, 0);
      playFilteredNoiseBurst(240, 0.9, 'lowpass', 0.42, 0.16, 0.03);
      playTone(440.0, 0.22, 'sawtooth', 0.08, 0.34);
      playTone(659.25, 0.24, 'triangle', 0.14, 0.45);
      playTone(880.0, 0.38, 'triangle', 0.14, 0.57);
      break;
    }
  }

  if (intensity === 'grand') {
    playTone(1318.51, 0.34, 'triangle', 0.1, 0.78);
    playTone(1567.98, 0.4, 'sine', 0.09, 0.86);
  }
}

/**
 * Short signature sting played when picking an Avenger avatar.
 */
export function playHeroSelectSound(heroId: HeroId, enabled: boolean): void {
  if (!enabled) return;
  switch (heroId) {
    case 'iron-hafiz':
      playSweep(260, 880, 0.18, 'sawtooth', 0.08, 0);
      playTone(1046.5, 0.18, 'triangle', 0.1, 0.16);
      break;
    case 'captain-noor':
      playTone(1174.66, 0.16, 'triangle', 0.12, 0);
      playTone(1567.98, 0.2, 'sine', 0.09, 0.1);
      break;
    case 'spidey-reciter':
      playFilteredNoiseBurst(2600, 3, 'bandpass', 0.1, 0.11, 0);
      playSweep(480, 1420, 0.11, 'sine', 0.1, 0);
      break;
    case 'wakanda-guardian':
      playSweep(110, 48, 0.14, 'sine', 0.16, 0);
      playTone(932.33, 0.2, 'triangle', 0.11, 0.12);
      break;
    case 'thunder-qari':
      playSweep(85, 38, 0.22, 'sine', 0.16, 0);
      playFilteredNoiseBurst(260, 0.8, 'lowpass', 0.24, 0.12, 0);
      playTone(880, 0.2, 'triangle', 0.1, 0.14);
      break;
  }
}

export function playHeroFanfare(enabled: boolean): void {
  playHeroThemeSound('iron-hafiz', enabled, 'normal');
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
