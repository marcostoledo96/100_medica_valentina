import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { narrativeSections } from '../../content/sections';
import { NarrativeShell } from './NarrativeShell';

describe('NarrativeShell', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('renders one main landmark and sections in configuration order', () => {
    render(<NarrativeShell />);

    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'experience-root');
    expect(screen.getAllByRole('region').map((region) => region.id)).toEqual(
      narrativeSections.map((section) => section.id)
    );
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    ).toEqual(narrativeSections.map((section) => section.label));
  });

  it('derives the provider phase from the active section, including direct fragments', () => {
    window.history.replaceState({}, '', '/#linea-tiempo');
    render(<NarrativeShell />);

    expect(screen.getByRole('link', { name: 'Línea de tiempo' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(document.querySelector('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'human'
    );
  });

  it('keeps all configured anchors inside the shell', () => {
    render(<NarrativeShell />);

    for (const section of narrativeSections) {
      expect(screen.getByRole('link', { name: section.label })).toHaveAttribute(
        'href',
        `#${section.id}`
      );
      expect(document.getElementById(section.id)).toBeInTheDocument();
    }
  });
});
