import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Profile } from '../../domain/schemas/profile.schema';
import { ExpedienteScene } from './ExpedienteScene';

const syntheticProfile: Profile = {
  firstName: 'Ada',
  fullName: 'Ada Lovelace Fixture',
  startYear: 2017,
  graduationYear: 2025,
  portrait: '/images/fixtures/ada-lovelace.webp',
  status: 'LISTA PARA CELEBRAR',
  diagnosis: 'VOCACIÓN EXTRAORDINARIA',
  prognosis: 'FUTURO LUMINOSO',
};

describe('ExpedienteScene', () => {
  it('renders the supplied profile values without relying on app content', () => {
    render(<ExpedienteScene profile={syntheticProfile} nextHref="#next-scene" />);

    expect(screen.getByText(syntheticProfile.firstName)).toBeInTheDocument();
    expect(screen.getAllByText(syntheticProfile.fullName)).not.toHaveLength(0);
    expect(screen.getByText(String(syntheticProfile.startYear))).toBeInTheDocument();
    expect(screen.getByText(String(syntheticProfile.graduationYear))).toBeInTheDocument();
    expect(screen.getByText(syntheticProfile.status)).toBeInTheDocument();
    expect(screen.getByText(syntheticProfile.diagnosis)).toBeInTheDocument();
    expect(screen.getByText(syntheticProfile.prognosis)).toBeInTheDocument();
    expect(screen.queryByText('Persona Demo de Prueba')).not.toBeInTheDocument();
  });

  it('uses the expected dossier semantics and keeps content non-editable', () => {
    render(<ExpedienteScene profile={syntheticProfile} nextHref="#next-scene" />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Expediente' })).toBeVisible();
    expect(document.querySelector('header')).toBeInTheDocument();
    expect(document.querySelector('figure')).toBeInTheDocument();
    expect(document.querySelector('figcaption')).toBeInTheDocument();
    expect(document.querySelector('dl')).toBeInTheDocument();
    expect(document.querySelectorAll('dt').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('dd').length).toBeGreaterThan(0);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(document.querySelector('input, textarea, select, [contenteditable="true"]')).toBeNull();
  });

  it('provides a configurable anchor CTA with an accessible portrait', () => {
    render(<ExpedienteScene profile={syntheticProfile} nextHref="#next-scene" />);

    const nextLink = screen.getByRole('link', { name: 'Ver evolución' });
    expect(nextLink).toHaveAttribute('href', '#next-scene');

    const portrait = screen.getByRole('img', {
      name: `Retrato ilustrado de ${syntheticProfile.fullName}`,
    });
    expect(portrait).toHaveAttribute('src', syntheticProfile.portrait);
    expect(portrait).toHaveAttribute('width', '320');
    expect(portrait).toHaveAttribute('height', '400');
    expect(portrait).toHaveAttribute('loading', 'lazy');
  });

  it('shows initials when the portrait cannot be loaded', () => {
    render(<ExpedienteScene profile={syntheticProfile} nextHref="#next-scene" />);

    fireEvent.error(
      screen.getByRole('img', { name: `Retrato ilustrado de ${syntheticProfile.fullName}` })
    );

    expect(
      screen.getByRole('img', { name: `Iniciales de ${syntheticProfile.fullName}` })
    ).toHaveTextContent('AL');
  });
});
