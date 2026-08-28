import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NarrativeSection, getNarrativeHeadingId } from './NarrativeSection';
import type { NarrativeSectionConfig } from '../../content/sections';

const section = {
  id: 'expediente',
  label: 'Expediente',
  phase: 'clinical',
  order: 1,
} as const satisfies NarrativeSectionConfig;

describe('NarrativeSection', () => {
  it('renders a semantic section with a visible, associated heading', () => {
    render(<NarrativeSection section={section} />);

    const headingId = getNarrativeHeadingId(section.id);
    const narrativeSection = screen.getByRole('region', { name: section.label });

    expect(narrativeSection).toHaveAttribute('id', section.id);
    expect(narrativeSection).toHaveAttribute('aria-labelledby', headingId);
    expect(narrativeSection.tagName).toBe('SECTION');
    expect(screen.getByRole('heading', { level: 2, name: section.label })).toHaveAttribute(
      'id',
      headingId
    );
  });

  it('keeps supplied scene content inside the narrative section', () => {
    render(
      <NarrativeSection section={section}>
        <p>Contenido de prueba</p>
      </NarrativeSection>
    );

    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
  });
});
