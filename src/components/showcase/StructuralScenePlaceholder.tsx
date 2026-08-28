import type { NarrativeSectionConfig } from '../../content/sections';

export interface StructuralScenePlaceholderProps {
  section: NarrativeSectionConfig;
}

export function StructuralScenePlaceholder({ section }: StructuralScenePlaceholderProps) {
  return (
    <div className="max-w-2xl space-y-3">
      <h2
        id={`${section.id}-heading`}
        className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl"
      >
        {section.label}
      </h2>
      <p className="font-ui text-sm leading-relaxed text-text-secondary">
        Contenido estructural de demostración.
      </p>
    </div>
  );
}
