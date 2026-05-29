// 🔑 LEARNING: useSteakCook — the cooking state machine as a hook.
// The cook has two user-gated segments: Cooking (one continuous timer, with a
// flip reminder partway through) and Cooling. The timer STOPS between them —
// after cooking finishes the user decides when to begin cooling. This mirrors
// real cooking: you pull the steak, then choose when to let it rest.
//
//   idle → cooking → awaiting (timer stopped) → cooling → done
//
// 💡 CONCEPT: Custom hook as a state machine — all timing, audio, notification,
// wake-lock and confetti side-effects live here so SteakSetup stays focused on
// rendering. The displayed time is the CURRENT segment's remaining, not a grand
// total (e.g. 2:00 while cooking, 5:00 while cooling).

import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import type { CookingPlan, CookingPhase } from '../types/cooking';
import { useTimer } from './useTimer';
import { useAudioAlert } from './useAudioAlert';
import { useWakeLock } from './useWakeLock';
import { useNotification } from './useNotification';

export type CookStatus = 'idle' | 'cooking' | 'awaiting' | 'done';

export interface SteakCook {
  status: CookStatus;
  /** Label of the current segment — "Cooking" or "Cooling" */
  stageLabel: string;
  /** Type of the current phase — lets the UI pick the right image */
  currentType: CookingPhase['type'] | null;
  /** Seconds remaining in the CURRENT segment (or its full length while awaiting) */
  remaining: number;
  isPaused: boolean;
  start: (plan: CookingPlan) => void;
  pause: () => void;
  resume: () => void;
  /** Begin the next segment (e.g. start Cooling once Cooking is done) */
  startNext: () => void;
  reset: () => void;
}

export function useSteakCook(): SteakCook {
  const [plan, setPlan] = useState<CookingPlan | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // True once we've advanced to a timed segment but are waiting for the user
  // to start it (the timer is stopped in between).
  const [awaitingStart, setAwaitingStart] = useState(false);

  const phase = plan?.phases[phaseIndex];
  const phaseDuration = phase?.durationSeconds ?? 0;

  const audio = useAudioAlert();
  const notification = useNotification();

  const status: CookStatus =
    plan === null ? 'idle'
    : phase?.type === 'done' ? 'done'
    : awaitingStart ? 'awaiting'
    : 'cooking';

  // Keep the screen awake only while a segment is actively running.
  void useWakeLock(status === 'cooking' && !isPaused);

  const phaseCompleteHandled = useRef(false);
  // Tracks the last flip-countdown number shown (3,2,1,0) so each fires once.
  const flipCountdownRef = useRef<number | null>(null);

  // 🔑 LEARNING: Phase completion — when a timed segment ends we play the alert,
  // then either finish (Serve) or advance to the next segment and WAIT for the
  // user instead of auto-starting it.
  const handlePhaseComplete = useCallback(() => {
    if (phaseCompleteHandled.current) return;
    phaseCompleteHandled.current = true;

    if (phase?.alertSound) audio.play(phase.alertSound);

    if (phase?.type === 'cook') {
      toast('Cooking done!', { description: 'Pull the steak — start cooling when ready', duration: 7000 });
      notification.notify('DoneRight — Cooking done', { body: 'Pull the steak. Start cooling when ready.' });
    } else if (phase?.type === 'rest') {
      toast.success('Ready to serve!', { description: 'Your steak is perfectly cooked', duration: 8000 });
      notification.notify('DoneRight — Serve!', { body: 'Your steak is ready to serve!' });
    }

    const nextIndex = phaseIndex + 1;
    const next = plan?.phases[nextIndex];
    if (!next) return;

    if (next.durationSeconds === 0) {
      // Instant phase (Serve!) — go straight to done.
      setPhaseIndex(nextIndex);
    } else {
      // Advance to the next timed segment but stop and wait for the user.
      setPhaseIndex(nextIndex);
      setAwaitingStart(true);
      phaseCompleteHandled.current = false;
    }
  }, [phase, phaseIndex, plan, audio, notification]);

  const timer = useTimer(phaseDuration, handlePhaseComplete);

  // Ref to the latest timer so effects can start it without re-running per render.
  const timerRef = useRef(timer);
  timerRef.current = timer;

  const start = useCallback((p: CookingPlan) => {
    audio.markInteracted();
    notification.requestPermission();
    setPlan(p);
    setPhaseIndex(0);
    setIsPaused(false);
    setAwaitingStart(false);
  }, [audio, notification]);

  // 💡 CONCEPT: Auto-start ONLY the first segment (Cooking) right after START.
  // Later segments are user-gated, so this effect deliberately fires for index 0.
  useEffect(() => {
    if (!phase || phaseIndex !== 0 || phase.durationSeconds === 0) return;
    flipCountdownRef.current = null;
    phaseCompleteHandled.current = false;
    timerRef.current.start();
    setIsPaused(false);
  }, [plan, phaseIndex, phase]);

  // 💡 CONCEPT: Flip countdown without stopping — as the cook segment nears the
  // flip point we show a single updating toast: "Flip in 3…2…1…" then "Flip now!".
  // The timer keeps running throughout. Guarding remaining > 0 also avoids a
  // spurious early fire while the timer's internal value is still stale on start.
  useEffect(() => {
    if (phase?.type !== 'cook' || phase.flipAtSeconds == null) return;
    if (!timer.isRunning || timer.remaining <= 0) return;

    // delta counts down 3 → 2 → 1 → 0 as we approach the flip moment.
    const delta = timer.remaining - phase.flipAtSeconds;
    if (delta < 0 || delta > 3) return;
    if (flipCountdownRef.current === delta) return; // already shown this number
    flipCountdownRef.current = delta;

    if (delta === 0) {
      audio.play('flip');
      toast('Flip now!', { id: 'flip', description: 'Turn your steak over — timer keeps running', duration: 4000 });
      notification.notify('DoneRight — FLIP!', { body: 'Time to flip your steak!' });
    } else {
      toast(`Flip in ${delta}…`, { id: 'flip', duration: 1500 });
    }
  }, [timer.remaining, timer.isRunning, phase, audio, notification]);

  // Celebration confetti when the done stage activates.
  useEffect(() => {
    if (status === 'done') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f5a623', '#D4901A', '#ffd700', '#e8a317', '#c17d0e'],
      });
    }
  }, [status]);

  const pause = useCallback(() => {
    setIsPaused(true);
    timer.pause();
  }, [timer]);

  const resume = useCallback(() => {
    setIsPaused(false);
    timer.start();
    phaseCompleteHandled.current = false;
  }, [timer]);

  // Begin the awaiting segment (e.g. start Cooling once Cooking finished).
  const startNext = useCallback(() => {
    setAwaitingStart(false);
    setIsPaused(false);
    flipCountdownRef.current = null;
    phaseCompleteHandled.current = false;
    timer.start();
  }, [timer]);

  const reset = useCallback(() => {
    setPlan(null);
    setPhaseIndex(0);
    setIsPaused(false);
    setAwaitingStart(false);
  }, []);

  // While awaiting, the timer still holds the previous segment's value, so show
  // the upcoming segment's full duration instead.
  const remaining = awaitingStart ? phaseDuration : timer.remaining;

  return {
    status,
    stageLabel: phase?.label ?? '',
    currentType: phase?.type ?? null,
    remaining,
    isPaused,
    start,
    pause,
    resume,
    startNext,
    reset,
  };
}
