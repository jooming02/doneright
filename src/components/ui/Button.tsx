import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

// Variant style map — adding a new variant means adding one entry here.
// primary   → 10% CTA color (the only vivid action color in the 60-30-10 system)
// secondary → 30% structure color (quiet, supporting)
// success/danger → semantic status colors (used for timer done/abort)
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:   'bg-cta     border-cta-ring  text-cta-ink  hover:bg-cta-dim hover:border-cta-ring',
  secondary: 'bg-panel border-outline border-l-2 border-l-hi text-body-sub hover:bg-panel-hover hover:border-outline hover:border-l-hi',
  success:   'bg-green-700 border-green-900 text-green-100 hover:bg-green-600 hover:border-green-800',
  danger:    'bg-red-700   border-red-900   text-red-100   hover:bg-red-600   hover:border-red-800',
  ghost:     'bg-transparent border-transparent text-body-muted hover:text-body-sub',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  ...rest
}) => {
  const baseStyles = `
    font-pixel text-xs font-medium
    border-pixel border-solid
    rounded-md shadow-pixel
    px-pixel-4 py-pixel-2
    transition-all duration-150
    active:scale-[0.98] active:shadow-pixel-sm
    disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
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
