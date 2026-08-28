import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { narrativeSections } from '../../content/sections';
import { ProgressIndicator } from './ProgressIndicator';

describe('ProgressIndicator', () => {
  it('renders native Spanish anchor navigation for every section', () => {
    render(<ProgressIndicator sections={narrativeSections} activeSectionId="linea-tiempo" />);

    const navigation = screen.getByRole('navigation', { name: 'Progreso del recorrido' });
    const links = screen.getAllByRole('link');

    expect(navigation).toBeInTheDocument();
    expect(navigation).toHaveClass('safe-area-inset', 'overflow-x-clip');
    expect(links).toHaveLength(narrativeSections.length);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      narrativeSections.map((section) => `#${section.id}`)
    );
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual(
      narrativeSections.map((section) => section.label)
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('marks only the active section link with page currentness', () => {
    render(<ProgressIndicator sections={narrativeSections} activeSectionId="linea-tiempo" />);

    const activeLink = screen.getByRole('link', { name: 'Línea de tiempo' });
    const inactiveLinks = narrativeSections
      .filter((section) => section.id !== 'linea-tiempo')
      .map((section) => screen.getByRole('link', { name: section.label }));

    expect(activeLink).toHaveAttribute('aria-current', 'page');
    for (const link of inactiveLinks) {
      expect(link).not.toHaveAttribute('aria-current');
    }
  });
});
