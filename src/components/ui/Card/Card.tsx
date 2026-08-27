import React, { forwardRef } from 'react';

export type CardVariant = 'default' | 'raised' | 'outlined' | 'subtle';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardAs = 'div' | 'article' | 'section' | 'aside';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  as?: CardAs;
  children?: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-surface-raised border border-border-default shadow-subtle',
  raised: 'bg-surface-raised border border-border-default shadow-raised',
  outlined: 'bg-surface-base border border-border-strong shadow-none',
  subtle: 'bg-surface-subtle border border-border-subtle shadow-none',
};

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export const Card = forwardRef<HTMLElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      as: Component = 'div',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return React.createElement(
      Component,
      {
        ref,
        className: `rounded-md transition-colors duration-normal ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`,
        ...props,
      },
      children
    );
  }
);

Card.displayName = 'Card';
