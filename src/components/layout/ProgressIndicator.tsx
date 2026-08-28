import type { NarrativeSectionConfig } from '../../content/sections';

export interface ProgressIndicatorProps {
  sections: readonly NarrativeSectionConfig[];
  activeSectionId: string | null;
}

export function ProgressIndicator({ sections, activeSectionId }: ProgressIndicatorProps) {
  const orderedSections = sections
    .map((section, index) => ({ section, index }))
    .sort((left, right) => left.section.order - right.section.order || left.index - right.index)
    .map(({ section }) => section);
  const currentSectionId = orderedSections.some((section) => section.id === activeSectionId)
    ? activeSectionId
    : orderedSections[0]?.id;

  return (
    <nav
      aria-label="Progreso del recorrido"
      data-progress-rail
      className="safe-area-inset w-full overflow-x-clip border-b border-border-subtle bg-surface-base"
    >
      <div className="mx-auto w-full min-w-0 max-w-5xl px-4 sm:px-6">
        <ol
          className="flex w-full min-w-0 flex-wrap gap-1 py-2"
          aria-label="Secciones del recorrido"
        >
          {orderedSections.map((section) => {
            const isActive = section.id === currentSectionId;

            return (
              <li key={section.id} className="min-w-[44px] flex-1">
                <a
                  href={`#${section.id}`}
                  aria-label={section.label}
                  aria-current={isActive ? 'location' : undefined}
                  data-section-link={section.id}
                  className={`group flex min-h-[44px] min-w-[44px] max-w-full flex-col items-center justify-center gap-1 rounded-md px-1 py-1 text-center font-mono text-[0.6875rem] leading-tight transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base sm:text-xs ${
                    isActive
                      ? 'text-accent-primary'
                      : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-3 w-3 rounded-full border-2 transition-colors duration-fast ${
                      isActive
                        ? 'border-accent-primary bg-accent-primary'
                        : 'border-border-strong bg-transparent group-hover:border-text-primary'
                    }`}
                  />
                  <span className="max-w-full break-words">{section.label}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
