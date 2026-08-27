import React, { forwardRef } from 'react';

export type VisuallyHiddenAs =
  'span' | 'div' | 'p' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  as?: VisuallyHiddenAs;
  children?: React.ReactNode;
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as: Component = 'span', className = '', children, ...props }, ref) => {
    return React.createElement(
      Component,
      {
        ref,
        className: `sr-only ${className}`,
        ...props,
      },
      children
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';
