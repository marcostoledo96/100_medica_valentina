import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-primary text-accent-primary-fg hover:bg-accent-primary-hover active:bg-accent-primary-active border border-transparent shadow-subtle',
  secondary:
    'bg-surface-raised text-text-primary hover:bg-surface-overlay active:bg-surface-sunken border border-border-default shadow-subtle',
  outline:
    'bg-transparent text-text-primary hover:bg-surface-subtle active:bg-surface-raised border border-border-strong',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-subtle active:bg-surface-raised border border-transparent',
  danger:
    'bg-status-danger text-status-danger-fg hover:opacity-90 active:opacity-100 border border-transparent shadow-subtle',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] min-w-[44px] px-3.5 py-2 text-xs font-medium rounded-sm gap-1.5',
  md: 'min-h-[44px] min-w-[44px] px-4 py-2.5 text-sm font-semibold rounded-md gap-2',
  lg: 'min-h-[48px] min-w-[48px] px-6 py-3 text-base font-semibold rounded-md gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled = false,
      type = 'button',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isButtonDisabled}
        aria-busy={isLoading || undefined}
        aria-disabled={isButtonDisabled || undefined}
        className={`inline-flex items-center justify-center font-ui select-none cursor-pointer text-center no-underline transition-[transform,background-color,border-color,color,box-shadow] duration-fast ease-clinical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid="button-spinner"
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
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
