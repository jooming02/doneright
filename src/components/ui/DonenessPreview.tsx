// 🔑 LEARNING: Doneness Preview — Shows pixel art representation of the
// selected doneness level. Since we don't have AI-generated pixel art yet,
// we use inline SVG placeholders that visually represent each doneness.
//
// 💡 CONCEPT: Placeholder/Mock pattern — In real projects, you often need
// to build the UI before the final assets are ready. Using SVG placeholders
// that roughly represent the final look lets you develop and test the UI
// flow without waiting for design assets. Later, swap in real images.

import React from 'react';

interface DonenessPreviewProps {
  /** Image key from the doneness option (e.g., 'steak-rare', 'egg-soft-boiled') */
  imageKey: string;
  /** Alt text for accessibility */
  alt: string;
  /** Size of the preview */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/** Maps imageKey → public asset path */
const STEAK_IMAGES: Record<string, string> = {
  'steak-rare':        '/images/steak-rare.png',
  'steak-medium-rare': '/images/steak-medium-rare.png',
  'steak-medium':      '/images/steak-medium.png',
  'steak-medium-well': '/images/steak-medium-well.png',
  'steak-well-done':   '/images/steak-well-done.png',
};

/**
 * DonenessPreview — Shows a pixel art preview of the selected doneness.
 *
 * 💡 CONCEPT: Component composition over conditional rendering — Instead of
 * one giant component with lots of ifs, we compose small SVG components.
 * Each food type has its own SVG generator, and this component just picks
 * the right one based on the imageKey.
 */
export const DonenessPreview: React.FC<DonenessPreviewProps> = ({
  imageKey,
  alt,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  const src = STEAK_IMAGES[imageKey] ?? STEAK_IMAGES['steak-medium'];

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-pixel border-solid border-outline
        bg-canvas
        p-pixel-1
        animate-glow
      `}
      role="img"
      aria-label={alt}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};
