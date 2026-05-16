// 🔑 LEARNING: Audio Manager — Web Audio API for sound effects.
// Instead of loading MP3 files (which need to be hosted and cached),
// we SYNTHESIZE sounds programmatically using oscillators.
// This is how retro games made sound effects — generate waveforms, not samples.

/** Type for sound effect identifiers used in the app */
export type SoundEffect = 'flip' | 'done' | 'rest-done';

// 💡 CONCEPT: Singleton AudioContext — Browsers limit the number of
// AudioContexts. We create one and reuse it. Also, AudioContext must be
// created from a user gesture (click/tap), so we lazy-initialize on first use.
let audioContext: AudioContext | null = null;

/**
 * Get or create the shared AudioContext.
 *
 * 🔑 LEARNING: Lazy initialization pattern — Don't create the AudioContext
 * until we actually need it. This avoids the "AudioContext was not allowed
 * to start" warning that browsers show when you create one without user gesture.
 */
function getAudioContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    // 🔑 LEARNING: Resume suspended context — Browsers auto-suspend
    // AudioContext if it wasn't created during a user gesture.
    // Calling resume() on a running context is a no-op, so it's safe to always call.
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  } catch {
    // 💡 CONCEPT: Graceful degradation — If Web Audio API isn't available
    // (rare, but possible in old browsers or server-side rendering),
    // we just return null and skip sound playback. The app still works.
    console.warn('Web Audio API not available — sounds will be silent');
    return null;
  }
}

/**
 * Synthesize a beep tone using an oscillator.
 *
 * 🔑 LEARNING: Web Audio API basics —
 * 1. OscillatorNode: generates a waveform (sine, square, sawtooth, triangle)
 * 2. GainNode: controls volume (amplitude)
 * 3. connect(): routes audio from one node to another (like audio cables)
 * 4. start()/stop(): schedule playback with sample-accurate timing
 *
 * For our pixel art aesthetic, we use SQUARE waves — that's the classic
 * 8-bit NES sound. Sine waves are smooth; square waves are chunky/buzzy.
 */
function playBeep(
  frequency: number,
  durationMs: number,
  type: OscillatorType = 'square',
  volume: number = 0.3
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Create an oscillator — this generates the raw tone
  const oscillator = ctx.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  // Create a gain node — this controls volume
  // 🔑 LEARNING: Gain envelope — We fade in/out to avoid "clicking"
  // sounds at the start/end. This is called an "envelope" in audio synthesis.
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01); // Fade in 10ms
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + durationMs / 1000); // Fade out

  // Connect: oscillator → gain → speakers
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Schedule playback
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + durationMs / 1000);
}

/**
 * Play a specific sound effect.
 *
 * 💡 CONCEPT: Sound design for different alerts —
 * - flip: Short high beep (urgency — "do something now!")
 * - done: Rising arpeggio (accomplishment — "phase complete!")
 * - rest-done: Triumphant chord (celebration — "food is ready!")
 */
export function playSound(effect: SoundEffect): void {
  switch (effect) {
    case 'flip':
      // Short urgent double-beep
      playBeep(880, 150, 'square', 0.3);
      setTimeout(() => playBeep(1100, 100, 'square', 0.3), 170);
      break;

    case 'done':
      // Rising 3-note arpeggio (C-E-G)
      playBeep(523, 150, 'square', 0.25); // C5
      setTimeout(() => playBeep(659, 150, 'square', 0.25), 170); // E5
      setTimeout(() => playBeep(784, 250, 'square', 0.25), 340); // G5
      break;

    case 'rest-done':
      // Triumphant 4-note fanfare (C-E-G-C)
      playBeep(523, 120, 'square', 0.2); // C5
      setTimeout(() => playBeep(659, 120, 'square', 0.2), 140); // E5
      setTimeout(() => playBeep(784, 120, 'square', 0.2), 280); // G5
      setTimeout(() => playBeep(1047, 400, 'square', 0.3), 420); // C6
      break;

    default: {
      // Exhaustive check
      const _exhaustive: never = effect;
      return _exhaustive;
    }
  }
}
