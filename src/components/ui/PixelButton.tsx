// 🔑 LEARNING: Pixel Button — A reusable UI component with a retro 8-bit aesthetic.
// Key design decisions:
// 1. Thick 4px borders (pixel-border) instead of modern thin borders
// 2. Press Start 2P font (8px grid pixel font)
// 3. Pressed effect: translateY(2px) + reduced shadow = "button sinking in"
// 4. Color variants via props, not CSS classes (encapsulation)
//
// This component demonstrates the "compound component" pattern where
// variants are controlled through a `variant` prop rather than className overrides.

import React from 'react';

// 💡 CONCEPT: Variant type — Using a union type for variants gives us
// compile-time safety. If someone typos `variant="primery"`, TypeScript catches it.
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

// 🔑 LEARNING: Variant style maps — Instead of a giant if/else chain,
// we define styles as a lookup object. This is the "table-driven" approach.
// Adding a new variant = adding one entry to this object.
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-stove-600 border-stove-800 text-white hover:bg-stove-500 hover:border-stove-700',
  secondary: 'bg-sear-800 border-sear-950 text-sear-100 hover:bg-sear-700 hover:border-sear-900',
  success: 'bg-green-700 border-green-900 text-green-100 hover:bg-green-600 hover:border-green-800',
  danger: 'bg-red-700 border-red-900 text-red-100 hover:bg-red-600 hover:border-red-800',
};

/**
 * PixelButton — A chunky, retro-styled button component.
 *
 * 💡 CONCEPT: Spread props — {...rest} passes through any standard button
 * attributes (onClick, disabled, type, etc.) so consumers don't have to
 * re-declare them. This is the "delegation" or "forwarding" pattern.
 */
export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  ...rest
}) => {
  const baseStyles = `
    font-pixel text-xs
    border-pixel border-solid
    shadow-pixel
    px-pixel-4 py-pixel-2
    transition-all duration-100
    active:translate-y-0.5 active:shadow-pixel-sm
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-pixel
  `;

  return (
    <button
      className={`${baseStyles} ${VARIANT_STYLES[variant]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
