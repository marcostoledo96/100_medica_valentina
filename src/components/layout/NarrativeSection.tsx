import { forwardRef, type ReactNode } from 'react';
import { Section, type SectionProps } from '../ui/Section/Section';
import type { NarrativeSectionConfig } from '../../content/sections';

export interface NarrativeSectionProps extends Omit<
  SectionProps,
  'as' | 'aria-labelledby' | 'children' | 'id'
> {
  section: NarrativeSectionConfig;
  children?: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components -- Keep the heading ID helper with its component contract.
export function getNarrativeHeadingId(sectionId: string): string {
  return `${sectionId}-heading`;
}

export const NarrativeSection = forwardRef<HTMLElement, NarrativeSectionProps>(
  ({ section, children, className = '', ...props }, ref) => {
    const headingId = getNarrativeHeadingId(section.id);

    return (
      <Section
        ref={ref}
        as="section"
        id={section.id}
        aria-labelledby={headingId}
        containerWidth="lg"
        paddingY="lg"
        className={`min-h-[70vh] scroll-mt-20 sm:scroll-mt-24 ${className}`}
        data-narrative-section={section.id}
        {...props}
      >
        <div className="flex min-h-[50vh] flex-col justify-center gap-8">
          <div className="max-w-2xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              Escena estructural
            </p>
            <h2
              id={headingId}
              className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl"
            >
              {section.label}
            </h2>
          </div>
          {children ?? (
            <div className="flex min-h-32 items-center border-l-2 border-accent-primary pl-5">
              <span className="font-ui text-sm text-text-secondary">Contenido narrativo</span>
            </div>
          )}
        </div>
      </Section>
    );
  }
);

NarrativeSection.displayName = 'NarrativeSection';
