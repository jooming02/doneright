// 🔑 LEARNING: 8-bit Progress Bar — Like a health bar in retro games.
// Key design: segmented blocks instead of a smooth bar.
// Each "block" is a small square, and they fill from left to right.
// This mimics the limited resolution of 8-bit graphics where you couldn't
// have sub-pixel rendering — you either had a block or you didn't.

import React from 'react';

interface PixelProgressProps {
  /** Current progress value */
  value: number;
  /** Maximum value (value/max = fill percentage) */
  max: number;
  /** Number of segments to display (more = smoother, less = more retro) */
  segments?: number;
  /** Whether to animate transitions */
  animate?: boolean;
  /** Optional label */
  label?: string;
}

/**
 * PixelProgress — An 8-bit segmented progress bar.
 *
 * 💡 CONCEPT: Segmented UI — In retro games, health bars were made of
 * discrete segments because that's all the hardware could render.
 * We replicate this intentionally for aesthetic reasons, not technical limits.
 * The number of segments controls the "chunkiness" — fewer = more retro.
 */
export const PixelProgress: React.FC<PixelProgressProps> = ({
  value,
  max,
  segments = 20,
  animate = true,
  label,
}) => {
  // 🔑 LEARNING: Normalized progress — Always work in 0-1 range internally,
  // then scale to your display units. This decouples the data from the visual.
  const progress = max > 0 ? Math.min(1, value / max) : 0;
  const filledSegments = Math.round(progress * segments);

  // 💡 CONCEPT: Color derived from progress — Same traffic-light system
  // as the timer: green → yellow → red as progress decreases.
  // Note: we invert because "value" goes DOWN as cooking progresses,
  // so high "value" = early stage = green, low value = almost done = red.
  const getSegmentColor = (index: number): string => {
    if (index >= filledSegments) return 'bg-sear-800'; // Empty segment

    // Filled segment color based on overall progress
    if (progress > 0.5) return 'bg-green-500';
    if (progress > 0.25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-pixel-1">
          <span className="font-pixel text-[8px] text-sear-300">{label}</span>
          <span className="font-pixel text-[8px] text-sear-400">
            {Math.round(progress * 100)}%
          </span>
        </div>
      )}

      {/* 🔑 LEARNING: Pixel-perfect progress bar — Each segment is a small
          square with a 1px gap. The gap creates the "segmented" look.
          We use inline style for the gap because Tailwind doesn't have
          a 1px gap utility in our custom spacing. */}
      <div
        className="flex w-full border-pixel border-solid border-sear-700 bg-stove-950 p-pixel-1"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={`
              flex-1 h-pixel-3 mx-[1px]
              ${getSegmentColor(i)}
              ${animate ? 'transition-colors duration-200' : ''}
            `}
          />
        ))}
      </div>
    </div>
  );
};
