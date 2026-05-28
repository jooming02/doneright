import React from 'react';

interface ProgressProps {
  value: number;
  max: number;
  segments?: number;
  animate?: boolean;
  label?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max,
  segments = 20,
  animate = true,
  label,
}) => {
  const progress = max > 0 ? Math.min(1, value / max) : 0;
  const filledSegments = Math.round(progress * segments);

  const getSegmentColor = (index: number): string => {
    if (index >= filledSegments) return 'bg-panel'; // empty
    if (progress > 0.5) return 'bg-timer-ok';
    if (progress > 0.25) return 'bg-timer-warn';
    return 'bg-timer-danger';
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-pixel-1">
          <span className="font-pixel text-[8px] text-body-sub">{label}</span>
          <span className="font-pixel text-[8px] text-body-muted">
            {Math.round(progress * 100)}%
          </span>
        </div>
      )}

      <div
        className="flex w-full border-pixel border-solid border-outline bg-canvas p-pixel-1"
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
