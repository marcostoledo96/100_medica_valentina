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

  it('renders implemented features and placeholders only for unimplemented sections', () => {
    render(<App />);

    const openingHeading = screen.getByRole('heading', { level: 1, name: 'Inicio' });
    const implementedSectionIds = new Set([
      'inicio',
      'expediente',
      'signos-vitales',
      'linea-tiempo',
      'galeria',
      'equipo-tratante',
      'final',
    ]);
    const placeholderSections = narrativeSections.filter(
      (section) => !implementedSectionIds.has(section.id)
    );
    const structuralPlaceholder = 'Contenido estructural de demostración.';

    expect(openingHeading).toHaveAttribute('id', 'inicio-heading');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Abrir expediente' })).toBeVisible();

    const expedienteScene = screen.getByTestId('expediente-scene');
    expect(expedienteScene).toHaveAttribute('aria-labelledby', 'expediente-heading');
    expect(
      within(expedienteScene).getByRole('heading', { level: 2, name: 'Expediente' })
    ).toBeVisible();
    expect(within(expedienteScene).getByRole('link', { name: 'Ver evolución' })).toHaveAttribute(
      'href',
      '#signos-vitales'
    );

    const vitalSigns = screen.getByTestId('vital-signs');
    expect(
      within(vitalSigns).getByRole('heading', { level: 2, name: 'Signos vitales' })
    ).toBeVisible();

    const timeline = screen.getByTestId('timeline');
    expect(timeline).toBeInTheDocument();
    expect(within(timeline).getAllByRole('article')).toHaveLength(3);

    const gallery = screen.getByTestId('gallery');
    expect(gallery).toBeInTheDocument();
    expect(within(gallery).getByRole('heading', { level: 2, name: 'Galería' })).toBeVisible();
    expect(within(gallery).queryByText(structuralPlaceholder)).not.toBeInTheDocument();

    const galleryRegion = screen.getByRole('region', { name: 'Galería' });
    const audioMessages = within(galleryRegion).getByTestId('audio-messages');
    expect(audioMessages).toBeVisible();
    expect(
      within(audioMessages).getByRole('heading', { level: 2, name: 'Voces que acompañan' })
    ).toBeVisible();
    expect(within(audioMessages).getByText('Amigo de la Carrera Demo')).toBeVisible();
    expect(
      within(audioMessages).getAllByRole('button', { name: /Reproducir mensaje:/ })
    ).toHaveLength(2);

    const team = screen.getByTestId('team');
    expect(team).toBeInTheDocument();
    expect(within(team).getByRole('heading', { level: 2, name: 'Equipo tratante' })).toBeVisible();
    expect(within(team).getByRole('list', { name: 'Personas del equipo tratante' })).toBeVisible();
    expect(within(team).getAllByRole('article')).toHaveLength(2);
    expect(within(team).queryByText(structuralPlaceholder)).not.toBeInTheDocument();

    const finale = screen.getByTestId('finale-scene');
    expect(finale).toHaveAttribute('data-content-status', 'provisional');
    expect(within(finale).getByRole('heading', { level: 2, name: 'MÉDICA DEMO' })).toBeVisible();
    expect(
      within(finale).getByRole('heading', { level: 2, name: '¡Felicitaciones Médica!' })
    ).toBeVisible();
    const returnLink = within(finale).getByRole('link', { name: 'Volver al comienzo' });
    expect(returnLink).toHaveAttribute('href', '#inicio');
    expect(screen.queryAllByText(structuralPlaceholder)).toHaveLength(placeholderSections.length);
    for (const section of placeholderSections) {
      const region = screen.getByRole('region', { name: section.label });
      expect(within(region).getByRole('heading', { level: 2, name: section.label })).toBeVisible();
      expect(within(region).getByText(structuralPlaceholder)).toBeVisible();
    }

    expect(screen.getAllByRole('region').map((region) => region.id)).toEqual(
      narrativeSections.map((section) => section.id)
    );
    expect(document.querySelector('[data-experience-phase]')).toHaveAttribute(
      'data-experience-phase',
      'clinical'
    );
  });
});
