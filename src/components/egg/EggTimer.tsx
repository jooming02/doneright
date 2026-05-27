// 🔑 LEARNING: Egg Timer — Simplified version of SteakTimer for eggs.
// Eggs have fewer phases than steak (no rest period for most methods),
// so the timer flow is simpler. But the same phase-based architecture applies.
//
// 💡 CONCEPT: Component reuse — We reuse the same PixelTimer, PixelProgress,
// and PixelCard components. The timer logic (useTimer hook) is also shared.
// This is the power of good abstractions — write once, use everywhere.

import React, { useState, useCallback, useRef } from 'react';
import type { CookingPlan, CookingPhase } from '../../types/cooking';
import { useTimer } from '../../hooks/useTimer';
import { useAudioAlert } from '../../hooks/useAudioAlert';
import { useWakeLock } from '../../hooks/useWakeLock';
import { useNotification } from '../../hooks/useNotification';
import { PixelCard } from '../ui/PixelCard';
import { PixelButton } from '../ui/PixelButton';
import { PixelTimer } from '../ui/PixelTimer';
import { PixelProgress } from '../ui/PixelProgress';

interface EggTimerProps {
  plan: CookingPlan;
  onDone: () => void;
  onBack: () => void;
}

/**
 * EggTimer — Multi-phase cooking timer for eggs.
 *
 * Same phase-based architecture as SteakTimer but with egg-specific messages.
 * The cooking plan data structure is identical — that's the power of the
 * FoodPlugin interface.
 */
export const EggTimer: React.FC<EggTimerProps> = ({ plan, onDone, onBack }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const currentPhase: CookingPhase | undefined = plan.phases[currentPhaseIndex];
  const phaseDuration = currentPhase?.durationSeconds ?? 0;

  const audio = useAudioAlert();
  void useWakeLock(hasStarted && !isPaused);
  const notification = useNotification();
  const phaseCompleteHandled = useRef(false);

  const handlePhaseComplete = useCallback(() => {
    if (phaseCompleteHandled.current) return;
    phaseCompleteHandled.current = true;

    if (currentPhase?.alertSound) {
      audio.play(currentPhase.alertSound);
    }

    // Egg-specific notifications
    if (currentPhase?.type === 'flip') {
      notification.notify('DoneRight — FLIP!', {
        body: 'Time to flip your egg!',
      });
    } else if (currentPhase?.type === 'done') {
      notification.notify('DoneRight — Done!', {
        body: 'Your egg is ready!',
      });
    }

    const nextIndex = currentPhaseIndex + 1;
    if (nextIndex < plan.phases.length) {
      const nextPhase = plan.phases[nextIndex];
      if (nextPhase && nextPhase.durationSeconds === 0) {
        setCurrentPhaseIndex(nextIndex);
      } else {
        setTimeout(() => {
          setCurrentPhaseIndex(nextIndex);
          phaseCompleteHandled.current = false;
        }, 500);
      }
    }
  }, [currentPhaseIndex, currentPhase, plan.phases, audio, notification]);

  const timer = useTimer(phaseDuration, handlePhaseComplete);

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

  const isInstantPhase = currentPhase && currentPhase.durationSeconds === 0;
  const isFlipPhase = currentPhase?.type === 'flip';
  const isDonePhase = currentPhase?.type === 'done';

  // Overall progress
  const totalElapsed = plan.phases
    .slice(0, currentPhaseIndex)
    .reduce((sum, p) => sum + p.durationSeconds, 0);
  const totalRemaining = plan.totalDurationSeconds - totalElapsed - (phaseDuration - timer.remaining);
  const overallProgress = Math.max(0, plan.totalDurationSeconds - totalRemaining);

  return (
    <div className="flex flex-col gap-pixel-4 p-pixel-4 max-w-md mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PixelButton variant="ghost" onClick={onBack} disabled={hasStarted}>
          ← Back
        </PixelButton>
        <h1 className="font-heading text-lg text-hi">
          🍳 {plan.donenessLabel.toUpperCase()}
        </h1>
        <div className="w-10" />
      </div>

      {/* Overall Progress */}
      <PixelProgress
        value={overallProgress}
        max={plan.totalDurationSeconds}
        segments={12}
        label="OVERALL"
      />

      {/* Main Timer Display */}
      <div className="flex-1 flex items-center justify-center">
        {isDonePhase ? (
          <div className="flex flex-col items-center gap-pixel-4 animate-glow">
            <div className="font-pixel text-2xl text-hi">✨</div>
            <div className="font-heading text-2xl text-timer-ok">DONE!</div>
            <div className="font-pixel text-sm text-body-sub">
              Your egg is ready
            </div>
            <PixelButton variant="primary" onClick={onDone}>
              DONE
            </PixelButton>
          </div>
        ) : isFlipPhase ? (
          <div className="flex flex-col items-center gap-pixel-4 animate-blink">
            <div className="font-pixel text-4xl">🔄</div>
            <div className="font-heading text-2xl text-timer-warn">FLIP!</div>
            <div className="font-pixel text-sm text-body-sub">
              Turn your egg now
            </div>
          </div>
        ) : (
          <PixelTimer
            remaining={timer.remaining}
            total={timer.total}
            isRunning={timer.isRunning}
            label={currentPhase?.label}
            size="lg"
          />
        )}
      </div>

      {/* Phase Info */}
      <PixelCard>
        <div className="flex flex-col gap-pixel-2">
          <div className="flex justify-between items-center">
            <span className="font-pixel text-xs text-body-muted">
              Step {currentPhaseIndex + 1} of {plan.phases.length}
            </span>
            <span className="font-pixel text-xs text-body-sub">
              {currentPhase?.label}
            </span>
          </div>
        </div>
      </PixelCard>

      {/* Control Buttons */}
      <div className="flex gap-pixel-2">
        {!hasStarted ? (
          <PixelButton
            variant="primary"
            className="flex-1 py-pixel-3"
            onClick={handleStart}
          >
            ▶ START
          </PixelButton>
        ) : (
          <>
            {timer.isRunning ? (
              <PixelButton
                variant="secondary"
                className="flex-1 py-pixel-3"
                onClick={handlePause}
              >
                ⏸ PAUSE
              </PixelButton>
            ) : (
              <PixelButton
                variant="primary"
                className="flex-1 py-pixel-3"
                onClick={handleResume}
                disabled={isDonePhase || isInstantPhase}
              >
                ▶ RESUME
              </PixelButton>
            )}
          </>
        )}
      </div>
    </div>
  );
};
