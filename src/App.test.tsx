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

  it('renders the timeline feature while keeping the other sections as placeholders', () => {
    render(<App />);

    const openingHeading = screen.getByRole('heading', { level: 1, name: 'Inicio' });
    expect(openingHeading).toHaveAttribute('id', 'inicio-heading');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    ).toEqual(narrativeSections.slice(1).map((section) => section.label));
    expect(screen.getAllByText('Contenido estructural de demostración.')).toHaveLength(
      narrativeSections.length - 1
    );
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.getByTestId('timeline').querySelectorAll('article')).toHaveLength(3);
    expect(screen.getAllByRole('region').map((region) => region.id)).toEqual(
      narrativeSections.map((section) => section.id)
    );
    expect(document.querySelector('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'clinical'
    );
  });
});
