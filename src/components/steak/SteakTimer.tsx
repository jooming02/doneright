// 🔑 LEARNING: Steak Timer — The cooking flow screen with phase-based timing.
// This is the most complex component in the app. It demonstrates:
//
// 1. Phase-based state machine — Cooking a steak has multiple phases:
//    Cook Side 1 → Flip → Cook Side 2 → Rest → Done
//    Each phase has its own timer and transitions to the next.
//
// 2. Hook composition — We compose multiple hooks (useTimer, useAudioAlert,
//    useWakeLock, useNotification) to build the timer behavior.
//
// 3. Side effects on phase transitions — When a phase ends, we:
//    - Play a sound alert
//    - Show a notification
//    - Auto-advance to the next phase (or stop if done)
//
// 💡 CONCEPT: State machine — A cooking timer IS a state machine.
// Each phase is a state, and phase completion is the transition event.
// Explicit state machines prevent impossible states (e.g., "resting" before
// "cooking") and make the flow easy to reason about.

import React, { useState, useCallback, useRef } from 'react';
import type { CookingPlan, CookingPhase } from '../../types/cooking';
import { useTimer } from '../../hooks/useTimer';
import { useAudioAlert } from '../../hooks/useAudioAlert';
import { useWakeLock } from '../../hooks/useWakeLock';
import { useNotification } from '../../hooks/useNotification';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Timer } from '../ui/Timer';
import { Progress } from '../ui/Progress';

interface SteakTimerProps {
  plan: CookingPlan;
  onDone: () => void;
  onBack: () => void;
}

/**
 * SteakTimer — Multi-phase cooking timer for steak.
 *
 * 🔑 LEARNING: Phase state management —
 * currentPhaseIndex tracks which phase we're on.
 * The timer hook is re-created for each phase's duration.
 * When a phase completes, we advance to the next phase.
 *
 * This is simpler than trying to manage one timer for the entire cook —
 * each phase can have different durations and alert behaviors.
 */
export const SteakTimer: React.FC<SteakTimerProps> = ({ plan, onDone, onBack }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const currentPhase: CookingPhase | undefined = plan.phases[currentPhaseIndex];

  // 🔑 LEARNING: Derived state — The current phase's duration drives the timer.
  // If currentPhase changes (phase advance), the timer resets with new duration.
  const phaseDuration = currentPhase?.durationSeconds ?? 0;

  // 💡 CONCEPT: Multiple hooks composed — Each hook handles one concern:
  // - useTimer: time tracking
  // - useAudioAlert: sound playback
  // - useWakeLock: keep screen on
  // - useNotification: background alerts
  // Separation of concerns makes each hook testable and reusable.
  const audio = useAudioAlert();
  void useWakeLock(hasStarted && !isPaused);
  const notification = useNotification();

  // 🔑 LEARNING: Ref to track if we already handled completion for this phase.
  // Prevents double-firing the phase advance when React re-renders.
  const phaseCompleteHandled = useRef(false);

  const handlePhaseComplete = useCallback(() => {
    if (phaseCompleteHandled.current) return;
    phaseCompleteHandled.current = true;

    // Play alert sound for this phase
    if (currentPhase?.alertSound) {
      audio.play(currentPhase.alertSound);
    }

    // Show notification
    if (currentPhase?.type === 'flip') {
      notification.notify('DoneRight — FLIP!', {
        body: 'Time to flip your steak!',
      });
    } else if (currentPhase?.type === 'rest') {
      notification.notify('DoneRight — Rest Time!', {
        body: 'Remove from heat. Let it rest for 5 minutes.',
      });
    } else if (currentPhase?.type === 'done') {
      notification.notify('DoneRight — Serve!', {
        body: 'Your steak is ready to serve!',
      });
    }

    // Advance to next phase
    const nextIndex = currentPhaseIndex + 1;
    if (nextIndex < plan.phases.length) {
      const nextPhase = plan.phases[nextIndex];
      if (nextPhase && nextPhase.durationSeconds === 0) {
        // Phase with 0 duration = instant transition (like "Serve!")
        setCurrentPhaseIndex(nextIndex);
        if (nextPhase.type === 'done') {
          // Final phase — we're done
          return;
        }
      } else {
        // Normal phase — advance after a brief pause
        setTimeout(() => {
          setCurrentPhaseIndex(nextIndex);
          phaseCompleteHandled.current = false;
        }, 500);
      }
    }
  }, [currentPhaseIndex, currentPhase, plan.phases, audio, notification]);

  const timer = useTimer(phaseDuration, handlePhaseComplete);

  // 🔑 LEARNING: Request notification permission on first start.
  // This MUST happen inside a click handler (user gesture requirement).
  const handleStart = useCallback(() => {
    audio.markInteracted();
    notification.requestPermission();
    setHasStarted(true);
    setIsPaused(false);
    timer.start();
    phaseCompleteHandled.current = false;
  }, [audio, notification, timer]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    timer.pause();
  }, [timer]);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    timer.start();
    phaseCompleteHandled.current = false;
  }, [timer]);

  // 🔑 LEARNING: Auto-start for 0-duration phases (like "Serve!")
  // If the phase has no duration, we don't need a timer — just show the message.
  const isInstantPhase = currentPhase && currentPhase.durationSeconds === 0;

  // Calculate overall progress across all phases
  const totalElapsed = plan.phases
    .slice(0, currentPhaseIndex)
    .reduce((sum, p) => sum + p.durationSeconds, 0);
  const totalRemaining = plan.totalDurationSeconds - totalElapsed - (phaseDuration - timer.remaining);
  const overallProgress = Math.max(0, plan.totalDurationSeconds - totalRemaining);

  // Phase type determines visual treatment
  const isFlipPhase = currentPhase?.type === 'flip';
  const isDonePhase = currentPhase?.type === 'done';
  const isRestPhase = currentPhase?.type === 'rest';

  return (
    <div className="flex flex-col gap-pixel-4 p-pixel-4 max-w-md mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} disabled={hasStarted}>
          ← Back
        </Button>
        <h1 className="font-heading text-lg text-hi">
          🥩 {plan.donenessLabel.toUpperCase()}
        </h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Overall Progress */}
      <Progress
        value={overallProgress}
        max={plan.totalDurationSeconds}
        segments={16}
        label="OVERALL"
      />

      {/* Main Timer Display */}
      <div className="flex-1 flex items-center justify-center">
        {isDonePhase ? (
          // 🔑 LEARNING: Conditional UI for done state — When cooking is
          // complete, we show a celebration screen instead of a timer.
          <div className="flex flex-col items-center gap-pixel-4 animate-glow">
            <div className="font-pixel text-2xl text-hi">✨</div>
            <div className="font-heading text-2xl text-timer-ok">SERVE!</div>
            <div className="font-pixel text-sm text-body-sub">
              Your steak is ready
            </div>
            <Button variant="primary" onClick={onDone}>
              DONE
            </Button>
          </div>
        ) : isFlipPhase ? (
          // Flip alert — urgent, eye-catching
          <div className="flex flex-col items-center gap-pixel-4 animate-blink">
            <img src="/doneness/steak-flip.png" alt="Flip steak" className="w-48 h-auto rounded-lg" />
            <div className="font-heading text-2xl text-timer-warn">FLIP!</div>
            <div className="font-pixel text-sm text-body-sub">
              Turn your steak now
            </div>
          </div>
        ) : (
          // Normal timer display
          <Timer
            remaining={timer.remaining}
            total={timer.total}
            isRunning={timer.isRunning}
            label={currentPhase?.label}
            size="lg"
          />
        )}
      </div>

      {/* Phase Info */}
      <Card>
        <div className="flex flex-col gap-pixel-2">
          {/* 🔑 LEARNING: Phase indicator — Shows which step we're on.
              Like a progress stepper in a wizard UI. */}
          <div className="flex justify-between items-center">
            <span className="font-pixel text-xs text-body-muted">
              Step {currentPhaseIndex + 1} of {plan.phases.length}
            </span>
            <span className="font-pixel text-xs text-body-sub">
              {currentPhase?.label}
            </span>
          </div>

          {/* Internal temp reference (steak only) */}
          {plan.internalTemp && (
            <div className="font-pixel text-xs text-body-muted mt-pixel-1">
              Target: {plan.internalTemp.pullTempF[0]}-{plan.internalTemp.pullTempF[1]}°F pull | {plan.internalTemp.finalTempF}°F final
            </div>
          )}

          {/* Rest phase reminder */}
          {isRestPhase && (
            <div className="font-pixel text-xs text-hi mt-pixel-1 animate-blink">
              ⚠ Remove from heat! Carryover cooking continues.
            </div>
          )}
        </div>
      </Card>

      {/* Control Buttons */}
      <div className="flex gap-pixel-2">
        {!hasStarted ? (
          <Button
            variant="primary"
            className="flex-1 py-pixel-3"
            onClick={handleStart}
          >
            ▶ START
          </Button>
        ) : (
          <>
            {timer.isRunning ? (
              <Button
                variant="secondary"
                className="flex-1 py-pixel-3"
                onClick={handlePause}
              >
                ⏸ PAUSE
              </Button>
            ) : (
              <Button
                variant="primary"
                className="flex-1 py-pixel-3"
                onClick={handleResume}
                disabled={isDonePhase || isInstantPhase}
              >
                ▶ RESUME
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
