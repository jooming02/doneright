import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  title,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const hoverStyles = hoverable
    ? 'hover:border-hi hover:scale-[1.02] hover:shadow-[0_0_0_1px_var(--hi),0_12px_36px_rgba(0,0,0,0.5)] cursor-pointer'
    : '';

  return (
    <div
      className={`
        border-pixel border-solid border-outline
        bg-surface
        rounded-xl shadow-pixel
        p-pixel-4
        transition-all duration-150
        ${hoverStyles}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {title && (
        <div className="border-b border-outline pb-pixel-2 mb-pixel-3">
          <h3 className="font-pixel text-xs text-hi">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
