// 🔑 LEARNING: Web Audio API Hook — Encapsulates audio playback in a React hook.
// This hook provides a simple `play(soundName)` function that components can call.
// The complexity of AudioContext management is hidden behind the hook interface.
// This is the "Facade Pattern" — a simplified interface over a complex subsystem.

import { useCallback, useRef } from 'react';
import { playSound, type SoundEffect } from '../utils/audio-manager';

/**
 * Hook for playing sound effects with Web Audio API.
 *
 * 💡 CONCEPT: Graceful degradation — If the browser doesn't support
 * Web Audio API, the play() function becomes a no-op. The app still works,
 * just silently. This is important for accessibility and progressive enhancement.
 *
 * @returns Object with play function
 */
export function useAudioAlert() {
  // 💡 CONCEPT: useRef for mutable state that doesn't cause re-renders.
  // We track whether the user has interacted with the page (needed because
  // browsers block audio autoplay until a user gesture). We don't need to
  // re-render the component when this changes — we just need to know it.
  const hasInteracted = useRef(false);

  // Mark interaction on first call — this enables audio playback
  const markInteracted = useCallback(() => {
    hasInteracted.current = true;
  }, []);

  /**
   * Play a sound effect.
   *
   * 🔑 LEARNING: User gesture requirement — Modern browsers require a user
   * gesture (click, tap, keypress) before playing audio. This prevents
   * annoying auto-play sounds on web pages. We track interaction state
   * and only attempt playback after the user has interacted.
   */
  const play = useCallback(
    (effect: SoundEffect) => {
      if (!hasInteracted.current) {
        // 🔑 LEARNING: Silent fallback — If no user interaction yet,
        // we don't play sound. This avoids console errors and respects
        // browser autoplay policies.
        return;
      }
      try {
        playSound(effect);
      } catch (err) {
        // Graceful degradation — never let audio errors crash the app
        console.warn('Audio playback failed:', err);
      }
    },
    []
  );

  return { play, markInteracted };
}
