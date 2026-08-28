import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { TeamCopy, TeamCollection } from '../../domain/types';
import { Team } from './Team';

const LONG_MESSAGE_MIN_WORDS = 75;
const LONG_MESSAGE_MAX_WORDS = 80;

const teamCopyFixture: TeamCopy = {
  eyebrow: 'Fixture support network',
  heading: 'Fixture team heading',
  intro: 'Fixture introduction for the people who accompany the journey.',
  listLabel: 'Fixture support network members',
  roleLabel: 'Fixture role',
  messageLabel: 'Fixture message',
  photoAltPrefix: 'Fixture portrait of',
  imageFallback: 'Fixture portrait unavailable',
};

const teamFixture: TeamCollection = [
  {
    id: 'team-test-01',
    name: 'Equipo fixture uno',
    role: 'Acompañamiento fixture',
    photo: '/images/fixtures/team-one.webp',
    message: 'Un mensaje fixture para comprobar la lectura completa de la tarjeta.',
  },
  {
    id: 'team-test-02',
    name: 'Equipo fixture dos',
    role: 'Orientación fixture',
    message:
      'Mensaje fixture deliberadamente extenso para comprobar que la tarjeta mantiene una lectura clara cuando el relato alcanza la frontera de setenta y cinco a ochenta palabras: debe leerse completo, sin recortes invisibles, sin desbordar el contenedor y sin ocultar el nombre, el mensaje ni el rol de la persona. Además, este texto largo protege la jerarquía visual acordada para la ficha: primero la persona, después su mensaje, luego el rol y al final la foto.',
  },
];

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function mediaName(member: TeamCollection[number]): string {
  return member.photo
    ? `${teamCopyFixture.photoAltPrefix} ${member.name}`
    : `${teamCopyFixture.imageFallback} de ${member.name}`;
}

function renderTeam() {
  return render(<Team members={teamFixture} copy={teamCopyFixture} />);
}

describe('Team', () => {
  it('renders injected copy and member data as a semantic linear list', () => {
    renderTeam();

    expect(screen.getByRole('heading', { level: 2, name: teamCopyFixture.heading })).toBeVisible();
    expect(screen.getByText(teamCopyFixture.eyebrow)).toBeVisible();
    expect(screen.getByText(teamCopyFixture.intro)).toBeVisible();

    const list = screen.getByRole('list', { name: teamCopyFixture.listLabel });
    const articles = within(list).getAllByRole('article');

    expect(articles).toHaveLength(teamFixture.length);
    expect(articles.map((article) => article.tagName)).toEqual(['ARTICLE', 'ARTICLE']);
    expect(
      articles.map((article) => within(article).getByRole('heading', { level: 3 }).textContent)
    ).toEqual(teamFixture.map((member) => member.name));

    for (const member of teamFixture) {
      const article = within(list).getByRole('article', { name: member.name });
      expect(within(article).getByText(member.role)).toBeVisible();
      expect(within(article).getByText(member.message)).toBeVisible();
      expect(within(article).getByText(teamCopyFixture.roleLabel)).toBeVisible();
      expect(within(article).getByText(teamCopyFixture.messageLabel)).toBeVisible();
    }

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('Contenido estructural de demostración.')).not.toBeInTheDocument();
  });

  it('carries a genuine 75–80 word boundary message in its fixture content', () => {
    renderTeam();

    const longMessage = teamFixture[1]!.message;
    const wordCount = countWords(longMessage);

    expect(wordCount).toBeGreaterThanOrEqual(LONG_MESSAGE_MIN_WORDS);
    expect(wordCount).toBeLessThanOrEqual(LONG_MESSAGE_MAX_WORDS);
    expect(screen.getByText(longMessage)).toBeVisible();
  });

  it('orders each card as person, message, role, then optional media', () => {
    renderTeam();
    const list = screen.getByRole('list', { name: teamCopyFixture.listLabel });

    for (const member of teamFixture) {
      const article = within(list).getByRole('article', { name: member.name });
      const heading = within(article).getByRole('heading', { level: 3 });
      const message = within(article).getByText(member.message);
      const role = within(article).getByText(member.role);
      const media = within(article).getByRole('img', { name: mediaName(member) });

      expect(
        heading.compareDocumentPosition(message) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      expect(message.compareDocumentPosition(role) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(role.compareDocumentPosition(media) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });

  it('gives real photos a contextual alt and unavailable photos a distinct copy-sourced label', () => {
    renderTeam();
    const [withPhoto, withoutPhoto] = teamFixture;

    const realPhoto = screen.getByRole('img', {
      name: `${teamCopyFixture.photoAltPrefix} ${withPhoto!.name}`,
    });
    expect(realPhoto).toHaveAttribute('src', withPhoto!.photo!);
    expect(realPhoto).toHaveAttribute('loading', 'lazy');
    expect(realPhoto).toHaveAttribute('decoding', 'async');

    const photolessFallback = screen.getByRole('img', {
      name: `${teamCopyFixture.imageFallback} de ${withoutPhoto!.name}`,
    });
    expect(photolessFallback).toHaveAttribute('data-team-photo-fallback', withoutPhoto!.id);
    expect(photolessFallback).not.toHaveAttribute('src');
    expect(photolessFallback.getAttribute('aria-label')).not.toBe(
      `${teamCopyFixture.photoAltPrefix} ${withoutPhoto!.name}`
    );
    expect(photolessFallback.querySelector('.team-member-card__fallback-mark')).toHaveAttribute(
      'aria-hidden',
      'true'
    );

    fireEvent.error(realPhoto);

    const brokenFallback = screen.getByRole('img', {
      name: `${teamCopyFixture.imageFallback} de ${withPhoto!.name}`,
    });
    expect(brokenFallback).toHaveAttribute('data-team-photo-fallback', withPhoto!.id);
    expect(
      screen.queryByRole('img', { name: `${teamCopyFixture.photoAltPrefix} ${withPhoto!.name}` })
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByRole('article', { name: withPhoto!.name })).getByText(
        teamCopyFixture.imageFallback
      )
    ).toBeVisible();
  });
});
