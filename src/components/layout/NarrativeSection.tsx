import { forwardRef, type ReactNode } from 'react';
import { Section, type SectionProps } from '../ui/Section/Section';
import type { NarrativeSectionConfig } from '../../content/sections';

type NarrativeSectionLabelProps =
  | {
      labelledBy: string;
      ariaLabel?: never;
    }
  | {
      labelledBy?: never;
      ariaLabel: string;
    };

export type NarrativeSectionProps = Omit<
  SectionProps,
  'as' | 'aria-label' | 'aria-labelledby' | 'children' | 'id'
> &
  NarrativeSectionLabelProps & {
    section: NarrativeSectionConfig;
    children?: ReactNode;
  };

// eslint-disable-next-line react-refresh/only-export-components -- Keep the heading ID helper with its component contract.
export function getNarrativeHeadingId(sectionId: string): string {
  return `${sectionId}-heading`;
}

export const NarrativeSection = forwardRef<HTMLElement, NarrativeSectionProps>(
  ({ section, children, className = '', labelledBy, ariaLabel, ...props }, ref) => {
    const accessibilityProps =
      labelledBy !== undefined ? { 'aria-labelledby': labelledBy } : { 'aria-label': ariaLabel };

    return (
      <Section
        ref={ref}
        as="section"
        id={section.id}
        containerWidth="lg"
        paddingY="lg"
        className={`min-h-[70vh] scroll-mt-20 sm:scroll-mt-24 ${className}`}
        data-narrative-section={section.id}
        {...props}
        {...accessibilityProps}
      >
        <div className="flex min-h-[50vh] flex-col justify-center gap-8">{children}</div>
      </Section>
    );
  }
);

NarrativeSection.displayName = 'NarrativeSection';
