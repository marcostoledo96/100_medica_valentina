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

  it('renders the configured narrative sections and starts in the clinical phase', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Experiencia narrativa' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('region').map((region) => region.id)).toEqual(
      narrativeSections.map((section) => section.id)
    );
    expect(document.querySelector('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'clinical'
    );
  });
});
