import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { narrativeSections } from './content/sections';

describe('App Narrative Shell Integration', () => {
  it('renders one experience-root main landmark', () => {
    render(<App />);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveAttribute('id', 'experience-root');
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });

  it('renders configured sections with the expediente scene and remaining placeholders', () => {
    render(<App />);

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    ).toEqual(narrativeSections.map((section) => section.label));
    expect(screen.getAllByText('Contenido estructural de demostración.')).toHaveLength(3);
    expect(screen.getByRole('article')).toHaveAttribute('aria-labelledby', 'expediente-heading');
    expect(screen.getByRole('heading', { level: 2, name: 'Expediente' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Ver evolución' })).toHaveAttribute(
      'href',
      '#linea-tiempo'
    );
    expect(screen.getAllByRole('region').map((region) => region.id)).toEqual(
      narrativeSections.map((section) => section.id)
    );
    expect(document.querySelector('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'clinical'
    );
  });
});
