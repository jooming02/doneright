import React from 'react';
import { formatTime } from '../../utils/cooking-calculator';

interface PixelTimerProps {
  remaining: number;
  total: number;
  isRunning: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PixelTimer: React.FC<PixelTimerProps> = ({
  remaining,
  total,
  isRunning,
  label,
  size = 'lg',
}) => {
  const progress = total > 0 ? remaining / total : 0;

  // Timer color derived from remaining time — same semantic meaning across all themes.
  const getColor = (): string => {
    if (progress > 0.5) return 'text-timer-ok';
    if (progress > 0.25) return 'text-timer-warn';
    if (progress > 0.1) return 'text-timer-danger';
    return 'text-timer-critical';
  };

  // Glow effect uses the CSS variable directly so it respects theme overrides.
  const getGlow = (): React.CSSProperties => {
    if (!isRunning) return {};
    if (progress > 0.5)  return { filter: 'drop-shadow(0 0 8px var(--timer-ok))' };
    if (progress > 0.25) return { filter: 'drop-shadow(0 0 8px var(--timer-warn))' };
    if (progress > 0.1)  return { filter: 'drop-shadow(0 0 8px var(--timer-danger))' };
    return { filter: 'drop-shadow(0 0 12px var(--timer-critical))' };
  };

  const sizeConfig = {
    sm: { container: 'w-24 h-24', text: 'text-[10px]', time: 'text-sm' },
    md: { container: 'w-36 h-36', text: 'text-xs',     time: 'text-lg' },
    lg: { container: 'w-48 h-48', text: 'text-xs',     time: 'text-2xl' },
  };

  const config = sizeConfig[size];

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const pulseClass = isRunning ? 'animate-pulse-slow' : '';
  const flashClass = isRunning && progress <= 0.1 ? 'animate-blink' : '';

  return (
    <div className={`flex flex-col items-center gap-pixel-2 ${pulseClass}`}>
      <div className={`${config.container} relative flex items-center justify-center`}>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Track (background circle) */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-panel"
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

        <div className="relative z-10 flex flex-col items-center" style={getGlow()}>
          {label && (
            <span className={`font-pixel ${config.text} text-body-sub mb-pixel-1`}>
              {label}
            </span>
          )}
          <span className={`font-pixel ${config.time} ${getColor()} ${flashClass}`}>
            {formatTime(remaining)}
          </span>
        </div>
      </div>
    </div>
  );
};
