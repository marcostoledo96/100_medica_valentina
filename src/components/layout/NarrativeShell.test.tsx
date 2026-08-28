import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { NarrativeSectionConfig } from '../../content/sections';
import { narrativeSections } from '../../content/sections';
import { NarrativeShell } from './NarrativeShell';

function renderDistinctSection(section: NarrativeSectionConfig) {
  return (
    <div data-testid={`scene-${section.id}`}>
      <h2>{section.label} scene</h2>
      <p>Contenido de {section.id}</p>
    </div>
  );
}

describe('NarrativeShell', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('renders one main landmark and injected content in configured order', () => {
    const sections = [...narrativeSections].reverse();

    render(<NarrativeShell sections={sections} renderSection={renderDistinctSection} />);

    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'experience-root');
    expect(screen.getAllByRole('region').map((region) => region.id)).toEqual(
      narrativeSections.map((section) => section.id)
    );
    expect(screen.getAllByTestId(/scene-/).map((scene) => scene.dataset.testid)).toEqual(
      narrativeSections.map((section) => `scene-${section.id}`)
    );

    for (const section of narrativeSections) {
      expect(screen.getByTestId(`scene-${section.id}`)).toHaveTextContent(
        `Contenido de ${section.id}`
      );
    }
  });

  it('derives the provider phase from the active section, including direct fragments', () => {
    window.history.replaceState({}, '', '/#linea-tiempo');
    render(<NarrativeShell renderSection={renderDistinctSection} />);

    expect(screen.getByRole('link', { name: 'Línea de tiempo' })).toHaveAttribute(
      'aria-current',
      'location'
    );
    expect(document.querySelector('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'human'
    );
  });

  it('keeps all configured anchors inside the shell', () => {
    render(<NarrativeShell renderSection={renderDistinctSection} />);

    for (const section of narrativeSections) {
      expect(screen.getByRole('link', { name: section.label })).toHaveAttribute(
        'href',
        `#${section.id}`
      );
      expect(document.getElementById(section.id)).toBeInTheDocument();
    }
  });
});
