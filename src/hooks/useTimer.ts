// 🔑 LEARNING: Custom Hook — React hooks that encapsulate reusable logic.
// "useTimer" is the most critical hook in the app. It implements an
// ABSOLUTE TIMESTAMP timer instead of a simple decrementing counter.
//
// WHY absolute timestamps?
// - Mobile browsers (especially iOS) suspend JavaScript timers when the
//   app goes to background. A decrementing counter would "freeze" and lose time.
// - With absolute timestamps, we store Date.now() + duration as the end time.
//   When JS resumes, it calculates remaining = endAt - Date.now(), which is
//   correct regardless of how long JS was suspended.
// - This is the same principle as NTP (Network Time Protocol) — you don't
//   count seconds, you compare timestamps against an absolute reference.
//
// This pattern is used in production apps like Uber (ETA), Pomodoro timers,
// and any app where timing accuracy matters across background/foreground.

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerState } from '../types/cooking';

/**
 * Absolute-timestamp based timer hook.
 *
 * @param durationSeconds - Total duration for the timer in seconds
 * @param onComplete - Callback fired when the timer reaches zero
 * @returns TimerState object with remaining, controls, and status
 */
export function useTimer(
  durationSeconds: number,
  onComplete?: () => void
): TimerState {
  // 🔑 LEARNING: endAt stores the ABSOLUTE timestamp when the timer should finish.
  // This is the key insight — we don't store "remaining seconds" as state
  // (that would drift). We store the endpoint and compute remaining on each tick.
  const [endAt, setEndAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number>(durationSeconds);
  const [isComplete, setIsComplete] = useState(false);

  // 💡 CONCEPT: useRef for callback — We store onComplete in a ref so the
  // useEffect doesn't re-run when the callback reference changes (which happens
  // on every render if the parent doesn't memoize it). This prevents the timer
  // from restarting every time the parent re-renders.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // 💡 CONCEPT: useRef for "already called" flag — React's StrictMode in dev
  // runs effects twice. And the timer might hit 0 multiple times due to the
  // 200ms interval. We need to ensure onComplete is called exactly once.
  const hasCompletedRef = useRef(false);

  // 🔑 LEARNING: Start the timer by setting the absolute end timestamp.
  // Date.now() returns milliseconds since Unix epoch (Jan 1, 1970).
  // We multiply by 1000 to convert seconds → milliseconds.
  const start = useCallback(() => {
    const end = Date.now() + durationSeconds * 1000;
    setEndAt(end);
    setIsComplete(false);
    hasCompletedRef.current = false;
  }, [durationSeconds]);

  // 💡 CONCEPT: Pause by saving remaining time, then clearing endAt.
  // When we resume (call start again), we use the saved remaining time
  // as the new duration. This is simpler than trying to "unpause" an absolute time.
  const pause = useCallback(() => {
    if (endAt !== null) {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(left);
      setEndAt(null);
    }
  }, [endAt]);

  // 🔑 LEARNING: Reset the timer to initial state.
  // We clear both endAt and remaining to go back to the start.
  const reset = useCallback(() => {
    setEndAt(null);
    setRemaining(durationSeconds);
    setIsComplete(false);
    hasCompletedRef.current = false;
  }, [durationSeconds]);

  // 🔑 LEARNING: The core timer effect — This is where the magic happens.
  // When endAt changes (timer starts), we set up a setInterval that ticks
  // every 200ms. 200ms is a good balance:
  // - Fast enough for smooth MM:SS display (updates ~5 times per second)
  // - Slow enough to not drain battery (compared to 16ms for 60fps)
  useEffect(() => {
    if (endAt === null) return;

    const tick = () => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(left);

      if (left <= 0 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setEndAt(null);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    };

    tick(); // 🔑 LEARNING: Immediate first tick — Don't wait 200ms to show
            // the initial time. Call tick() right away so the UI updates instantly.

    const intervalId = setInterval(tick, 200);

    // 💡 CONCEPT: Cleanup function — React calls this when the effect
    // re-runs or the component unmounts. Without this, intervals would
    // pile up and create memory leaks. This is the "subscription pattern".
    return () => clearInterval(intervalId);
  }, [endAt]);

  return {
    remaining,
    total: durationSeconds,
    isRunning: endAt !== null,
    isComplete,
    start,
    pause,
    reset,
  };
}
