// 🔑 LEARNING: Wake Lock API — Keeps the screen on while the timer runs.
// Without this, your phone screen turns off after 30-60 seconds of inactivity,
// which would make a cooking timer useless! The Wake Lock API prevents this.
//
// Browser support: Chrome (Android), Edge — NOT Safari/iOS as of 2024.
// That's why we have graceful degradation (the app still works, screen
// might just dim). iOS users can manually set auto-lock to "Never" in Settings.

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook to request and manage a screen Wake Lock.
 *
 * 💡 CONCEPT: Device API pattern — Modern browsers expose hardware capabilities
 * through JavaScript APIs. The pattern is always:
 * 1. Feature detection: 'wakeLock' in navigator
 * 2. Request the capability with parameters
 * 3. Handle success/failure
 * 4. Clean up when done (release the lock)
 *
 * @param enabled - Whether to request the wake lock
 */
export function useWakeLock(enabled: boolean = false) {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // 🔑 LEARNING: Feature detection — Check if the API exists before using it.
  // This is the progressive enhancement pattern: detect → enhance → fallback.
  // Never assume an API is available — browser capabilities vary widely.
  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  /**
   * Request a wake lock from the browser.
   *
   * 🔑 LEARNING: Wake Lock returns a "Sentinel" object — This is like a
   * lease or handle. As long as you hold the sentinel, the screen stays on.
   * When you call release() or the sentinel gets garbage collected, the
   * screen can turn off again. This prevents accidental battery drain.
   */
  const request = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;

    try {
      const sentinel = await navigator.wakeLock.request('screen');
      wakeLockRef.current = sentinel;
      setIsActive(true);

      // 💡 CONCEPT: Event-driven cleanup — The sentinel fires a 'release'
      // event when the wake lock is released (either by us or by the browser).
      // We listen for it to update our state. This is the Observer Pattern.
      sentinel.addEventListener('release', () => {
        setIsActive(false);
        wakeLockRef.current = null;
      });
    } catch (err) {
      // Wake lock can fail if: page is not focused, too many locks,
      // or the browser decided to deny it. We just log and continue.
      console.warn('Wake Lock request failed:', err);
      setIsActive(false);
    }
  }, []);

  /**
   * Release the wake lock.
   *
   * 🔑 LEARNING: Explicit resource management — Just like closing a file
   * or database connection, you should release resources when you're done.
   * The browser will eventually release it, but being explicit is better.
   */
  const release = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      setIsActive(false);
    }
  }, []);

  // 🔑 LEARNING: Auto-request when enabled changes — When the timer starts,
  // we set enabled=true, which triggers this effect to request the lock.
  // When the timer stops, enabled=false triggers release.
  useEffect(() => {
    if (enabled && isSupported && !wakeLockRef.current) {
      request();
    } else if (!enabled && wakeLockRef.current) {
      release();
    }
  }, [enabled, isSupported, request, release]);

  // 💡 CONCEPT: Re-acquire on visibility change — When the user switches
  // tabs or the app goes to background, the browser releases the wake lock.
  // When they come back, we need to re-request it. This is a common gotcha!
  useEffect(() => {
    if (!isSupported) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && enabled) {
        await request();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSupported, enabled, request]);

  // 🔑 LEARNING: Cleanup on unmount — If the component that uses this hook
  // unmounts while the timer is running, we need to release the wake lock.
  // Otherwise, the screen stays on forever (battery drain!).
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, []);

  return { isSupported, isActive, request, release };
}
