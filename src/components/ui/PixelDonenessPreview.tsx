// 🔑 LEARNING: Doneness Preview — Shows pixel art representation of the
// selected doneness level. Since we don't have AI-generated pixel art yet,
// we use inline SVG placeholders that visually represent each doneness.
//
// 💡 CONCEPT: Placeholder/Mock pattern — In real projects, you often need
// to build the UI before the final assets are ready. Using SVG placeholders
// that roughly represent the final look lets you develop and test the UI
// flow without waiting for design assets. Later, swap in real images.

import React from 'react';

interface PixelDonenessPreviewProps {
  /** Image key from the doneness option (e.g., 'steak-rare', 'egg-soft-boiled') */
  imageKey: string;
  /** Alt text for accessibility */
  alt: string;
  /** Size of the preview */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// 🔑 LEARNING: SVG placeholder generator — Instead of loading external
// PNG files, we generate simple SVG graphics inline. This has advantages:
// 1. Zero network requests — instant display
// 2. Infinitely scalable — no pixelation (well, we WANT pixelation here)
// 3. Customizable at runtime — we can change colors based on state
// 4. No build step needed — no file copying or asset pipeline

/** Color map for steak doneness — from raw (red) to well-done (brown) */
const STEAK_COLORS: Record<string, { outside: string; inside: string }> = {
  'steak-rare': { outside: '#8B4513', inside: '#DC143C' },
  'steak-medium-rare': { outside: '#8B4513', inside: '#E25822' },
  'steak-medium': { outside: '#8B4513', inside: '#CD853F' },
  'steak-medium-well': { outside: '#8B4513', inside: '#A0522D' },
  'steak-well-done': { outside: '#6B3410', inside: '#654321' },
};

/** Color map for egg doneness */
const EGG_COLORS: Record<string, { white: string; yolk: string }> = {
  'egg-soft-boiled': { white: '#FAFAFA', yolk: '#FFD700' },
  'egg-medium-boiled': { white: '#FAFAFA', yolk: '#FFA500' },
  'egg-hard-boiled': { white: '#FAFAFA', yolk: '#FFBF00' },
  'egg-sunny-side-up': { white: '#FAFAFA', yolk: '#FFD700' },
  'egg-over-easy': { white: '#F5F5DC', yolk: '#FFD700' },
  'egg-over-medium': { white: '#F0E68C', yolk: '#FFA500' },
  'egg-over-hard': { white: '#DAA520', yolk: '#B8860B' },
};

/**
 * Generate an SVG placeholder for a steak doneness level.
 * Shows a cross-section: seared outside + colored inside.
 */
function SteakSVG({ colors }: { colors: { outside: string; inside: string } }): React.ReactElement {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* 🔑 LEARNING: SVG for pixel art — Using rect elements on a 64x64 grid
          creates a chunky, pixelated look. The style imageRendering: pixelated
          tells the browser to use nearest-neighbor scaling, preserving the
          blocky aesthetic at any display size. */}
      {/* Outer (seared) ring */}
      <rect x="8" y="16" width="48" height="32" rx="4" fill={colors.outside} />
      {/* Inner (doneness) area */}
      <rect x="14" y="20" width="36" height="24" rx="2" fill={colors.inside} />
      {/* Grill marks */}
      <rect x="12" y="28" width="40" height="2" fill="#2D1810" opacity="0.3" />
      <rect x="12" y="36" width="40" height="2" fill="#2D1810" opacity="0.3" />
    </svg>
  );
}

/**
 * Generate an SVG placeholder for an egg doneness level.
 * Shows top-down view: egg white + yolk center.
 */
function EggSVG({ colors, isBoiled }: { colors: { white: string; yolk: string }; isBoiled: boolean }): React.ReactElement {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {isBoiled ? (
        // Boiled egg: oval with cross-section showing yolk
        <>
          <ellipse cx="32" cy="32" rx="22" ry="26" fill={colors.white} />
          <ellipse cx="32" cy="32" rx="10" ry="10" fill={colors.yolk} />
        </>
      ) : (
        // Fried egg: irregular white with yolk
        <>
          <ellipse cx="32" cy="34" rx="26" ry="22" fill={colors.white} />
          <ellipse cx="32" cy="30" rx="10" ry="9" fill={colors.yolk} />
        </>
      )}
    </svg>
  );
}

/**
 * PixelDonenessPreview — Shows a pixel art preview of the selected doneness.
 *
 * 💡 CONCEPT: Component composition over conditional rendering — Instead of
 * one giant component with lots of ifs, we compose small SVG components.
 * Each food type has its own SVG generator, and this component just picks
 * the right one based on the imageKey.
 */
export const PixelDonenessPreview: React.FC<PixelDonenessPreviewProps> = ({
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

  // Determine food type from imageKey prefix
  const isSteak = imageKey.startsWith('steak');
  const isBoiled = imageKey.startsWith('egg-soft') || imageKey.startsWith('egg-medium-b') || imageKey.startsWith('egg-hard');

  const renderSVG = () => {
    if (isSteak) {
      const colors = STEAK_COLORS[imageKey] ?? STEAK_COLORS['steak-medium'] ?? { outside: '#8B4513', inside: '#CD853F' };
      return <SteakSVG colors={colors} />;
    }

    const eggKey = imageKey as string;
    const colors = EGG_COLORS[eggKey] ?? EGG_COLORS['egg-soft-boiled'] ?? { white: '#FAFAFA', yolk: '#FFD700' };
    return <EggSVG colors={colors} isBoiled={isBoiled} />;
  };

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
      {renderSVG()}
    </div>
  );
};
