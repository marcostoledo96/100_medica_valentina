import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Finale } from '../../domain/schemas/finale.schema';
import type { Profile } from '../../domain/schemas/profile.schema';
import { DiagnosisReveal, FinaleScene } from './FinaleScene';

const finaleStyles = readFileSync(
  resolve(process.cwd(), 'src/features/finale/FinaleScene.css'),
  'utf8'
);

const finaleFixture: Finale = {
  headline: 'Fixture finale heading',
  message: ['Fixture closing paragraph one.', 'Fixture closing paragraph two.'],
  image: '/images/fixtures/finale.webp',
  imageAlt: 'Fixture celebration photograph',
  date: '2025-12-15',
};

const profileFixture: Profile = {
  firstName: 'Ada',
  fullName: 'Ada Lovelace Fixture',
  startYear: 2017,
  graduationYear: 2025,
  portrait: '/images/fixtures/portrait.webp',
  status: 'Fixture final status',
  diagnosis: 'Fixture definitive diagnosis',
  prognosis: 'Fixture bright prognosis',
};

function renderScene() {
  return render(<FinaleScene content={finaleFixture} profile={profileFixture} />);
}

describe('FinaleScene', () => {
  it('renders supplied finale and profile content without embedding app-specific copy', () => {
    renderScene();

    expect(screen.getByRole('heading', { level: 2, name: finaleFixture.headline })).toBeVisible();
    expect(screen.getByText(profileFixture.fullName)).toBeVisible();
    expect(screen.getByText(profileFixture.status)).toBeVisible();
    expect(screen.getByText(profileFixture.diagnosis)).toBeVisible();
    for (const paragraph of finaleFixture.message)
      expect(screen.getByText(paragraph)).toBeVisible();
    expect(screen.getByText(finaleFixture.date)).toHaveAttribute('dateTime', finaleFixture.date);
    expect(screen.queryByText('¡Felicitaciones Médica!')).not.toBeInTheDocument();
  });

  it('keeps the diagnosis reveal before the discharge finale, headed by the finale headline', () => {
    renderScene();

    const scene = screen.getByTestId('finale-scene');
    const stages = Array.from(scene.querySelectorAll<HTMLElement>('[data-finale-stage]'));

    expect(stages.map((stage) => stage.dataset.finaleStage)).toEqual(['diagnosis', 'discharge']);
    expect(
      within(stages[0]!).getByRole('heading', { name: profileFixture.diagnosis })
    ).toBeVisible();
    expect(within(stages[1]!).getByRole('heading', { name: finaleFixture.headline })).toBeVisible();
    expect(scene).toHaveAttribute('aria-labelledby', 'finale-heading');
    expect(scene).toHaveAttribute('data-content-status', 'provisional');
  });

  it('provides a real, focusable return anchor to the opening section', () => {
    renderScene();

    const returnLink = screen.getByRole('link', { name: 'Volver al comienzo' });
    expect(returnLink).toHaveAttribute('href', '#inicio');
    expect(returnLink).not.toHaveAttribute('role', 'button');
  });

  it('replaces an unavailable image with an accessible visual placeholder', () => {
    renderScene();

    fireEvent.error(screen.getByRole('img', { name: finaleFixture.imageAlt }));

    const fallback = screen.getByTestId('finale-image-fallback');
    expect(fallback).toHaveAttribute('role', 'img');
    expect(fallback).toHaveAttribute('aria-label', finaleFixture.imageAlt);
    expect(fallback).toHaveTextContent('Imagen no disponible');
    expect(fallback).toHaveAttribute('data-content-status', 'placeholder');
    expect(screen.getByRole('img', { name: finaleFixture.imageAlt })).toBe(fallback);
  });

  it('keeps the static reveal available without JavaScript timers', () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    try {
      renderScene();

      expect(screen.getByText(profileFixture.diagnosis)).toBeVisible();
      expect(screen.getByRole('link', { name: 'Volver al comienzo' })).toBeVisible();
      expect(setTimeoutSpy).not.toHaveBeenCalled();
    } finally {
      setTimeoutSpy.mockRestore();
    }
  });

  it('declares explicit motion-safe and reduced-motion reveal paths', () => {
    expect(finaleStyles).toContain('@media (prefers-reduced-motion: no-preference)');
  });
});

describe('DiagnosisReveal', () => {
  it('renders diagnosis from its own props, honoring custom label and status', () => {
    render(<DiagnosisReveal diagnosis="Falla renal" provenance="placeholder" />);

    expect(screen.getByRole('heading', { name: 'Falla renal' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Falla renal' }).closest('[data-finale-stage]')
    ).toHaveAttribute('data-content-status', 'placeholder');
  });
});
