import React, { forwardRef } from 'react';

export type SectionWidth = 'sm' | 'md' | 'lg' | 'full';
export type SectionPaddingY = 'none' | 'sm' | 'md' | 'lg';
export type SectionAs = 'section' | 'div' | 'article' | 'main' | 'aside';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: SectionAs;
  containerWidth?: SectionWidth;
  paddingY?: SectionPaddingY;
  fullBleed?: boolean;
  children?: React.ReactNode;
}

const paddingYStyles: Record<SectionPaddingY, string> = {
  none: 'py-0',
  sm: 'py-4 sm:py-6',
  md: 'py-8 sm:py-12 md:py-16',
  lg: 'py-12 sm:py-16 md:py-24',
};

const widthStyles: Record<SectionWidth, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  full: 'max-w-full',
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      as: Component = 'section',
      containerWidth = 'md',
      paddingY = 'md',
      fullBleed = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const innerContainerClasses = fullBleed
      ? 'w-full'
      : `${widthStyles[containerWidth]} mx-auto px-4 sm:px-6 w-full`;

    return React.createElement(
      Component,
      {
        ref,
        className: `w-full relative ${paddingYStyles[paddingY]} ${className}`,
        ...props,
      },
      <div className={innerContainerClasses}>{children}</div>
    );
  }
);

Section.displayName = 'Section';
