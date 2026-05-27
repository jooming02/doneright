// 💡 CONCEPT: react-circular-progressbar handles the SVG ring rendering.
// We own the timer logic (useTimer hook) and just pass values in.
// This is the right separation: library = visual chrome, we = business logic.

import React from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { formatTime } from '../../utils/cooking-calculator';

interface TimerProps {
  remaining: number;
  total: number;
  isRunning: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Color progression as time runs out.
// "ok" uses the theme CTA so it always matches the palette — no hardcoded green.
const getPathColor = (progress: number): string => {
  if (progress > 0.5)  return 'var(--cta)';
  if (progress > 0.25) return 'var(--timer-warn)';
  if (progress > 0.1)  return 'var(--timer-danger)';
  return 'var(--timer-critical)';
};

const getTextColor = (progress: number): string => {
  if (progress > 0.5)  return 'text-cta';
  if (progress > 0.25) return 'text-timer-warn';
  if (progress > 0.1)  return 'text-timer-danger';
  return 'text-timer-critical';
};

export const Timer: React.FC<TimerProps> = ({
  remaining,
  total,
  isRunning,
  label,
  size = 'lg',
}) => {
  const progress = total > 0 ? remaining / total : 0;
  const pathColor = getPathColor(progress);
  const textColor = getTextColor(progress);
  const flashClass = isRunning && progress <= 0.1 ? 'animate-blink' : '';

  const sizeClass = {
    sm: 'w-24',
    md: 'w-36',
    lg: 'w-48',
  }[size];

  const timeTextSize = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size];

  return (
    <div className={`${sizeClass} mx-auto`}>
      <CircularProgressbarWithChildren
        value={progress * 100}
        strokeWidth={5}
        styles={buildStyles({
          trailColor:             'var(--panel)',
          pathColor,
          pathTransitionDuration: 0.3,
          rotation:               0,
        })}
      >
        <div className="flex flex-col items-center gap-1">
          {label && (
            <span className="font-pixel text-[10px] text-body-muted tracking-widest">
              {label.toUpperCase()}
            </span>
          )}
          <span className={`font-pixel ${timeTextSize} ${textColor} ${flashClass}`}>
            {formatTime(remaining)}
          </span>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};
