import { ExperiencePhaseProvider } from '../ui/ExperiencePhase/ExperiencePhaseProvider';
import { narrativeSections, type NarrativeSectionConfig } from '../../content/sections';
import { useActiveSection } from '../../hooks/useActiveSection';
import { NarrativeSection } from './NarrativeSection';
import { ProgressIndicator } from './ProgressIndicator';

export interface NarrativeShellProps {
  sections?: readonly NarrativeSectionConfig[];
}

export function NarrativeShell({ sections = narrativeSections }: NarrativeShellProps) {
  const activeSectionId = useActiveSection(sections);
  const activeSection = sections.find((section) => section.id === activeSectionId);
  const fallbackPhase = sections[0]?.phase ?? 'clinical';
  const phase = activeSection?.phase ?? fallbackPhase;

  return (
    <ExperiencePhaseProvider
      phase={phase}
      className="min-h-screen bg-surface-base text-text-primary"
    >
      <main id="experience-root" className="w-full overflow-x-clip">
        <ProgressIndicator sections={sections} activeSectionId={activeSectionId} />

        <header className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
            Recorrido narrativo
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
            Experiencia narrativa
          </h1>
        </header>

        <div>
          {sections.map((section) => (
            <NarrativeSection key={section.id} section={section} />
          ))}
        </div>
      </main>
    </ExperiencePhaseProvider>
  );
}
