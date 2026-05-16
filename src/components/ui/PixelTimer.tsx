// 🔑 LEARNING: Pixel Timer — The main visual element of the app.
// This is a circular timer display with MM:SS format, pulsing animation,
// and color changes based on remaining time (green → yellow → red).
//
// 💡 CONCEPT: Derived state — The timer color is DERIVED from the remaining
// time, not stored as separate state. If remaining changes, the color
// automatically recalculates. This prevents state sync bugs.
// Rule of thumb: if you can compute it from existing state, don't store it.

import React from 'react';
import { formatTime } from '../../utils/cooking-calculator';

interface PixelTimerProps {
  remaining: number;
  total: number;
  isRunning: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * PixelTimer — Circular pixel-art timer display.
 *
 * 🔑 LEARNING: Color transitions as visual feedback —
 * - Green (>50%): Everything is fine, keep cooking
 * - Yellow (25-50%): Getting close, pay attention
 * - Red (<25%): Critical! About to finish
 * - Flashing (<10%): EMERGENCY! Act now!
 *
 * This uses the same color psychology as traffic lights and games.
 */
export const PixelTimer: React.FC<PixelTimerProps> = ({
  remaining,
  total,
  isRunning,
  label,
  size = 'lg',
}) => {
  // 🔑 LEARNING: Progress calculation — Normalize to 0-1 range.
  // This makes it easy to derive color, arc angle, progress bar width, etc.
  const progress = total > 0 ? remaining / total : 0;

  // 💡 CONCEPT: Derived color based on progress — No state, no useEffect,
  // just a function of the input. This is "declarative" programming.
  const getColor = (): string => {
    if (progress > 0.5) return 'text-green-400';
    if (progress > 0.25) return 'text-yellow-400';
    if (progress > 0.1) return 'text-red-400';
    return 'text-red-500'; // Critical!
  };

  const getGlow = (): string => {
    if (!isRunning) return '';
    if (progress > 0.5) return 'shadow-[0_0_20px_rgba(74,222,128,0.3)]';
    if (progress > 0.25) return 'shadow-[0_0_20px_rgba(250,204,21,0.3)]';
    if (progress > 0.1) return 'shadow-[0_0_20px_rgba(248,113,113,0.3)]';
    return 'shadow-[0_0_30px_rgba(239,68,68,0.5)]';
  };

  // Size configurations — bigger timer for the main timer screen
  const sizeConfig = {
    sm: { container: 'w-24 h-24', text: 'text-[10px]', time: 'text-sm' },
    md: { container: 'w-36 h-36', text: 'text-xs', time: 'text-lg' },
    lg: { container: 'w-48 h-48', text: 'text-xs', time: 'text-2xl' },
  };

  const config = sizeConfig[size];

  // 🔑 LEARNING: SVG arc for circular progress — We draw a circular border
  // using SVG, and overlay a progress arc. The arc is calculated using
  // stroke-dasharray and stroke-dashoffset. This is a common technique
  // for circular progress indicators.
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  // 💡 CONCEPT: Conditional animation class — We only apply the pulse
  // animation when the timer is actively running. When paused, it's static.
  const pulseClass = isRunning ? 'animate-pulse-slow' : '';

  // Flashing effect when time is critically low
  const flashClass = isRunning && progress <= 0.1 ? 'animate-blink' : '';

  return (
    <div className={`flex flex-col items-center gap-pixel-2 ${pulseClass}`}>
      {/* 🔑 LEARNING: SVG circle progress — The outer circle is the "track"
          (full gray circle). The inner circle is the "progress" (partial arc).
          stroke-dasharray = circumference means "draw full circle length".
          stroke-dashoffset = offset means "skip this much from the start".
          By reducing the offset, more of the arc becomes visible. */}
      <div className={`${config.container} relative flex items-center justify-center`}>
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Track circle (background) */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-sear-800"
          />
          {/* Progress arc */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={`${getColor()} transition-all duration-200`}
          />
        </svg>

        {/* Time display */}
        <div className={`relative z-10 flex flex-col items-center ${getGlow()}`}>
          {label && (
            <span className={`font-pixel ${config.text} text-sear-300 mb-pixel-1`}>
              {label}
            </span>
          )}
          <span
            className={`font-pixel ${config.time} ${getColor()} ${flashClass}`}
          >
            {formatTime(remaining)}
          </span>
        </div>
      </div>
    </div>
  );
};
