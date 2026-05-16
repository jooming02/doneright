// 🔑 LEARNING: Pixel Card — Container component with retro pixel border.
// In UI design, "card" is a container that groups related content with
// a visible boundary. Our pixel version uses thick borders + hard shadow.
//
// 💡 CONCEPT: Container/Presenter pattern — Cards are "container" components
// that don't know what's inside them. They just provide visual wrapping.
// This makes them infinitely reusable across the app.

import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * PixelCard — A pixel-bordered card container.
 *
 * The hoverable prop adds hover effects for cards that act as buttons
 * (like the food selection cards on the home screen).
 */
export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  title,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const hoverStyles = hoverable
    ? 'hover:shadow-pixel-hover hover:border-gold-500 hover:scale-[1.02] cursor-pointer'
    : '';

  return (
    <div
      className={`
        border-pixel border-solid border-sear-700
        bg-stove-950
        shadow-pixel
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
      {/* 🔑 LEARNING: Optional title header — Using conditional rendering
          instead of always showing an empty header div. This avoids
          unnecessary DOM nodes and visual spacing issues. */}
      {title && (
        <div className="border-b-2 border-sear-700 pb-pixel-2 mb-pixel-3">
          <h3 className="font-pixel text-xs text-gold-400">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
