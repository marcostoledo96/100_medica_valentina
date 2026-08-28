import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { NarrativeSectionConfig } from '../../content/sections';
import { NarrativeSection, getNarrativeHeadingId } from './NarrativeSection';

const section = {
  id: 'expediente',
  label: 'Expediente',
  phase: 'clinical',
  order: 1,
} as const satisfies NarrativeSectionConfig;

describe('NarrativeSection', () => {
  it('uses a child-owned heading supplied through external labelledBy', () => {
    const headingId = getNarrativeHeadingId(section.id);

    render(
      <NarrativeSection section={section} labelledBy={headingId}>
        <h2 id={headingId}>Encabezado del expediente</h2>
      </NarrativeSection>
    );

    const narrativeSection = screen.getByRole('region', { name: 'Encabezado del expediente' });

    expect(narrativeSection).toHaveAttribute('id', section.id);
    expect(narrativeSection).toHaveAttribute('aria-labelledby', headingId);
    expect(narrativeSection).not.toHaveAttribute('aria-label');
    expect(narrativeSection.tagName).toBe('SECTION');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Encabezado del expediente' })
    ).toHaveAttribute('id', headingId);
    expect(screen.queryByText('Escena estructural')).not.toBeInTheDocument();
    expect(screen.queryByText('Contenido narrativo')).not.toBeInTheDocument();
  });

  it('supports an aria-label alternative while rendering supplied children', () => {
    render(
      <NarrativeSection section={section} ariaLabel="Sección de expediente">
        <p>Contenido de prueba</p>
      </NarrativeSection>
    );

    const narrativeSection = screen.getByRole('region', { name: 'Sección de expediente' });

    expect(narrativeSection).toHaveAttribute('aria-label', 'Sección de expediente');
    expect(narrativeSection).not.toHaveAttribute('aria-labelledby');
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
