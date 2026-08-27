import React, { forwardRef } from 'react';
import type { ButtonVariant } from '../Button/Button';

export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
> {
  /**
   * Mandatory accessible name for assistive technologies and tooltips.
   */
  label: string;
  icon: React.ReactNode;
  variant?: Exclude<ButtonVariant, 'danger'>;
  size?: IconButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<Exclude<ButtonVariant, 'danger'>, string> = {
  primary:
    'bg-accent-primary text-accent-primary-fg hover:bg-accent-primary-hover active:bg-accent-primary-active border border-transparent shadow-subtle',
  secondary:
    'bg-surface-raised text-text-primary hover:bg-surface-overlay active:bg-surface-sunken border border-border-default shadow-subtle',
  outline:
    'bg-transparent text-text-primary hover:bg-surface-subtle active:bg-surface-raised border border-border-strong',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-subtle active:bg-surface-raised border border-transparent',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'h-11 w-11 min-h-[44px] min-w-[44px] p-2 text-sm rounded-sm',
  md: 'h-11 w-11 min-h-[44px] min-w-[44px] p-2.5 text-base rounded-md',
  lg: 'h-12 w-12 min-h-[48px] min-w-[48px] p-3 text-lg rounded-md',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      label,
      icon,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      disabled = false,
      type = 'button',
      className = '',
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        disabled={isButtonDisabled}
        aria-busy={isLoading || undefined}
        aria-disabled={isButtonDisabled || undefined}
        className={`inline-flex items-center justify-center select-none cursor-pointer shrink-0 transition-[transform,background-color,border-color,color,box-shadow] duration-fast ease-clinical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid="icon-button-spinner"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          icon
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
