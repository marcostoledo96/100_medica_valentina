import { useMemo } from 'react';
import type * as React from 'react';
import { ExperiencePhaseProvider } from '../ui/ExperiencePhase/ExperiencePhaseProvider';
import { narrativeSections, type NarrativeSectionConfig } from '../../content/sections';
import { useActiveSection } from '../../hooks/useActiveSection';
import { NarrativeSection } from './NarrativeSection';
import { ProgressIndicator } from './ProgressIndicator';

export interface NarrativeShellProps {
  sections?: readonly NarrativeSectionConfig[];
  renderSection?: (section: NarrativeSectionConfig) => React.ReactNode;
}

function sortSections(sections: readonly NarrativeSectionConfig[]): NarrativeSectionConfig[] {
  return sections
    .map((section, index) => ({ section, index }))
    .sort((left, right) => left.section.order - right.section.order || left.index - right.index)
    .map(({ section }) => section);
}

export function NarrativeShell({
  sections = narrativeSections,
  renderSection,
}: NarrativeShellProps) {
  const orderedSections = useMemo(() => sortSections(sections), [sections]);
  const activeSectionId = useActiveSection(orderedSections);
  const activeSection = orderedSections.find((section) => section.id === activeSectionId);
  const fallbackPhase = orderedSections[0]?.phase ?? 'clinical';
  const phase = activeSection?.phase ?? fallbackPhase;

  return (
    <ExperiencePhaseProvider
      phase={phase}
      className="min-h-screen bg-surface-base text-text-primary"
    >
      <main id="experience-root" className="w-full overflow-x-clip">
        <ProgressIndicator sections={orderedSections} activeSectionId={activeSectionId} />

        <div>
          {orderedSections.map((section) => (
            <NarrativeSection key={section.id} section={section} ariaLabel={section.label}>
              {renderSection?.(section)}
            </NarrativeSection>
          ))}
        </div>
      </main>
    </ExperiencePhaseProvider>
  );
}
