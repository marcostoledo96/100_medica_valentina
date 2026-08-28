import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ExpedienteContent } from '../../domain/schemas/expediente.schema';
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

const syntheticCopy: ExpedienteContent = {
  eyebrow: 'Fixture dossier eyebrow',
  heading: 'Fixture expediente heading',
  intro: 'Fixture narrative introduction.',
  completionLabel: 'Fixture completion',
  completionAriaLabelPrefix: 'Fixture dossier completion',
  portraitAltPrefix: 'Fixture illustrated portrait of',
  portraitFallbackAriaLabelPrefix: 'Fixture initials of',
  portraitUnavailableLabel: 'Fixture portrait unavailable',
  portraitCaptionPrefix: 'Fixture portrait caption for',
  identityLabel: 'Fixture celebrated identity',
  identityDescription: 'Fixture identity narrative.',
  firstNameLabel: 'Fixture first name',
  fullNameLabel: 'Fixture full name',
  startYearLabel: 'Fixture start year',
  graduationYearLabel: 'Fixture graduation year',
  statusLabel: 'Fixture status',
  diagnosisLabel: 'Fixture diagnosis',
  prognosisLabel: 'Fixture prognosis',
  footer: 'Fixture footer narrative.',
  ctaLabel: 'Fixture next step',
};

function renderScene() {
  return render(
    <ExpedienteScene profile={syntheticProfile} copy={syntheticCopy} nextHref="#next-scene" />
  );
}

describe('ExpedienteScene', () => {
  it('renders supplied profile values and injected copy without relying on app content', () => {
    renderScene();

    expect(screen.getByText(syntheticCopy.eyebrow)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: syntheticCopy.heading })).toBeVisible();
    expect(screen.getByText(syntheticCopy.intro)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.completionLabel)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.identityLabel)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.identityDescription)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.portraitCaptionPrefix + ' Ada')).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.firstNameLabel)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.fullNameLabel)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.startYearLabel)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.graduationYearLabel)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.statusLabel)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.diagnosisLabel)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.prognosisLabel)).toBeInTheDocument();
    expect(screen.getByText(syntheticCopy.footer)).toBeInTheDocument();

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
    renderScene();

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: syntheticCopy.heading })).toBeVisible();
    expect(document.querySelector('header')).toBeInTheDocument();
    expect(document.querySelector('figure')).toBeInTheDocument();
    expect(document.querySelector('figcaption')).toBeInTheDocument();
    expect(document.querySelector('dl')).toBeInTheDocument();
    expect(document.querySelectorAll('dt').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('dd').length).toBeGreaterThan(0);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(
      screen.getByLabelText(`${syntheticCopy.completionAriaLabelPrefix}: 100%`)
    ).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(document.querySelector('input, textarea, select, [contenteditable="true"]')).toBeNull();
  });

  it('provides a configurable anchor CTA with an accessible portrait', () => {
    renderScene();

    const nextLink = screen.getByRole('link', { name: syntheticCopy.ctaLabel });
    expect(nextLink).toHaveAttribute('href', '#next-scene');

    const portrait = screen.getByRole('img', {
      name: `${syntheticCopy.portraitAltPrefix} ${syntheticProfile.fullName}`,
    });
    expect(portrait).toHaveAttribute('src', syntheticProfile.portrait);
    expect(portrait).toHaveAttribute('width', '320');
    expect(portrait).toHaveAttribute('height', '400');
    expect(portrait).toHaveAttribute('loading', 'lazy');
  });

  it('shows injected fallback copy and initials when the portrait cannot be loaded', () => {
    renderScene();

    fireEvent.error(
      screen.getByRole('img', {
        name: `${syntheticCopy.portraitAltPrefix} ${syntheticProfile.fullName}`,
      })
    );

    expect(
      screen.getByRole('img', {
        name: `${syntheticCopy.portraitFallbackAriaLabelPrefix} ${syntheticProfile.fullName}`,
      })
    ).toHaveTextContent('AL');
    expect(screen.getByText(syntheticCopy.portraitUnavailableLabel)).toBeInTheDocument();
  });
});
