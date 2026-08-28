import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { NarrativeSectionConfig } from '../../content/sections';
import { ProgressIndicator } from './ProgressIndicator';

const compactSections = [
  { id: 'inicio', label: 'Inicio', phase: 'clinical', order: 0 },
  { id: 'expediente', label: 'Expediente', phase: 'clinical', order: 1 },
  { id: 'final', label: 'Final', phase: 'finale', order: 2 },
] as const satisfies readonly NarrativeSectionConfig[];

describe('ProgressIndicator', () => {
  it('renders native anchor navigation for a collection other than four sections', () => {
    render(<ProgressIndicator sections={compactSections} activeSectionId="expediente" />);

    const navigation = screen.getByRole('navigation', { name: 'Progreso del recorrido' });
    const links = screen.getAllByRole('link');

    expect(navigation).toBeInTheDocument();
    expect(links).toHaveLength(compactSections.length);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      compactSections.map((section) => `#${section.id}`)
    );
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual(
      compactSections.map((section) => section.label)
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('marks exactly one active section link with location currentness', () => {
    render(<ProgressIndicator sections={compactSections} activeSectionId="expediente" />);

    const links = screen.getAllByRole('link');
    const currentLinks = links.filter((link) => link.getAttribute('aria-current') === 'location');

    expect(currentLinks).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Expediente' })).toHaveAttribute(
      'aria-current',
      'location'
    );
    for (const link of links) {
      if (link !== currentLinks[0]) {
        expect(link).not.toHaveAttribute('aria-current');
      }
    }
  });
});
