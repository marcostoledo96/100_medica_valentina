import { render, screen, within } from '@testing-library/react';
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

  it('renders Boot, Expediente, Timeline, and one final placeholder', () => {
    render(<App />);

    const openingHeading = screen.getByRole('heading', { level: 1, name: 'Inicio' });
    expect(openingHeading).toHaveAttribute('id', 'inicio-heading');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    ).toEqual(narrativeSections.slice(1).map((section) => section.label));

    const finalSection = screen.getByRole('region', { name: 'Final' });
    const placeholderText = 'Contenido estructural de demostración.';
    expect(within(finalSection).getByText(placeholderText)).toBeVisible();
    expect(screen.getAllByText(placeholderText)).toHaveLength(1);

    const expedienteScene = screen.getByTestId('expediente-scene');
    expect(expedienteScene).toHaveAttribute('aria-labelledby', 'expediente-heading');
    expect(
      within(expedienteScene).getByRole('heading', { level: 2, name: 'Expediente' })
    ).toBeVisible();
    expect(within(expedienteScene).getByRole('link', { name: 'Ver evolución' })).toHaveAttribute(
      'href',
      '#linea-tiempo'
    );

    const timeline = screen.getByTestId('timeline');
    expect(timeline).toBeInTheDocument();
    expect(within(timeline).getAllByRole('article')).toHaveLength(3);
    expect(screen.getAllByRole('region').map((region) => region.id)).toEqual(
      narrativeSections.map((section) => section.id)
    );
    expect(document.querySelector('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'clinical'
    );
  });
});
