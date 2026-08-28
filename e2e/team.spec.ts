import type { Page } from '@playwright/test';
import { test, expect } from './narrative-test';
import { teamCopy, teamMembers } from '../src/content/team';

const viewports = [
  { width: 360, height: 740, label: '360px' },
  { width: 390, height: 844, label: '390px' },
  { width: 412, height: 915, label: '412px' },
  { width: 430, height: 932, label: '430px' },
];

const MIN_LONG_WORDS = 75;
const MAX_LONG_WORDS = 80;

const photoAltFor = (name: string) => `${teamCopy.photoAltPrefix} ${name}`;
const fallbackAltFor = (name: string) => `${teamCopy.imageFallback} de ${name}`;

async function openTeam(page: Page) {
  await page.goto('/#equipo-tratante');
  const team = page.getByTestId('team');
  await team.scrollIntoViewIfNeeded();
  await expect(team).toBeVisible();
  return team;
}

test.describe('Team feature E2E', () => {
  test('renders the human-phase team section as visible semantic content', async ({ page }) => {
    const team = await openTeam(page);
    const rootProvider = page.locator('[data-experience-phase]');
    const list = team.getByRole('list', { name: 'Personas del equipo tratante' });
    const articles = list.getByRole('article');

    await expect(rootProvider).toHaveAttribute('data-experience-phase', 'human');
    await expect(team.getByRole('heading', { level: 2, name: 'Equipo tratante' })).toBeVisible();
    await expect(list).toBeVisible();
    await expect(articles).toHaveCount(teamMembers.length);

    for (const [index, member] of teamMembers.entries()) {
      await expect(articles.nth(index)).toContainText(member.name);
      await expect(articles.nth(index)).toContainText(member.role);
      await expect(articles.nth(index)).toContainText(member.message);
      await expect(articles.nth(index).getByRole('button')).toHaveCount(0);
      await expect(articles.nth(index).getByRole('link')).toHaveCount(0);
    }

    const photoMember = teamMembers.find((member) => member.photo !== undefined)!;
    const photolessMember = teamMembers.find((member) => member.photo === undefined)!;

    const photoCard = team.getByRole('article', { name: photoMember.name });
    const realPhoto = photoCard.getByRole('img', { name: photoAltFor(photoMember.name) });
    await expect(realPhoto).toBeVisible();
    await expect(realPhoto).toHaveAttribute('src', photoMember.photo!);
    await expect(
      photoCard.getByRole('img', { name: fallbackAltFor(photoMember.name) })
    ).toHaveCount(0);

    const photolessCard = team.getByRole('article', { name: photolessMember.name });
    const photolessFallback = photolessCard.getByRole('img', {
      name: fallbackAltFor(photolessMember.name),
    });
    await expect(photolessFallback).toBeVisible();
    await expect(
      photolessCard.getByRole('img', { name: photoAltFor(photolessMember.name) })
    ).toHaveCount(0);

    const longMessageMember = teamMembers[1]!;
    const longMessageCard = team.getByRole('article', { name: longMessageMember.name });
    const longWordCount = await longMessageCard
      .locator('.team-member-card__message-text')
      .evaluate(
        (element) => (element.textContent ?? '').trim().split(/\s+/).filter(Boolean).length
      );
    expect(longWordCount).toBeGreaterThanOrEqual(MIN_LONG_WORDS);
    expect(longWordCount).toBeLessThanOrEqual(MAX_LONG_WORDS);

    for (const [index, member] of teamMembers.entries()) {
      const sequence = await articles.nth(index).evaluate((element) => {
        const follows = (a: Element | null, b: Element | null) =>
          Boolean(a && b && a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
        const body = element.querySelector('.team-member-card__body');
        const media = element.querySelector('figure');

        return {
          nameFirst: follows(
            element.querySelector('.team-member-card__name'),
            element.querySelector('.team-member-card__message-text')
          ),
          messageBeforeRole: follows(
            element.querySelector('.team-member-card__message-text'),
            element.querySelector('.team-member-card__role-value')
          ),
          roleBeforeMedia: follows(element.querySelector('.team-member-card__role-value'), media),
          noVisualReorder:
            (!body || window.getComputedStyle(body).order === '0') &&
            (!media || window.getComputedStyle(media).order === '0'),
        };
      });

      expect(sequence, `DOM sequence for ${member.name}`).toEqual({
        nameFirst: true,
        messageBeforeRole: true,
        roleBeforeMedia: true,
        noVisualReorder: true,
      });
    }
  });

  test('keeps the team cards contained across required mobile widths', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const team = await openTeam(page);
      const metrics = await team.evaluate((element) => {
        const cards = Array.from(element.querySelectorAll<HTMLElement>('[data-team-member]'));
        const teamRect = element.getBoundingClientRect();

        return {
          pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          teamOverflow: element.scrollWidth > element.clientWidth,
          cardsWithinTeam: cards.every((card) => {
            const cardRect = card.getBoundingClientRect();
            return cardRect.left >= teamRect.left && cardRect.right <= teamRect.right;
          }),
          messagesWithinCards: cards.every((card) => {
            const cardRect = card.getBoundingClientRect();
            const text = card.querySelector<HTMLElement>('.team-member-card__message-text');
            if (!text) {
              return true;
            }
            const textRect = text.getBoundingClientRect();
            return (
              textRect.left >= cardRect.left &&
              textRect.right <= cardRect.right &&
              textRect.top >= cardRect.top &&
              textRect.bottom <= cardRect.bottom
            );
          }),
        };
      });

      expect(metrics.pageOverflow, `Page overflow detected at ${viewport.label}`).toBe(false);
      expect(metrics.teamOverflow, `Team overflow detected at ${viewport.label}`).toBe(false);
      expect(metrics.cardsWithinTeam, `Cards out of team bounds at ${viewport.label}`).toBe(true);
      expect(
        metrics.messagesWithinCards,
        `Message text clipped or overflowing at ${viewport.label}`
      ).toBe(true);
    }
  });

  test('swaps a broken photo for the distinct unavailable fallback label', async ({ page }) => {
    const team = await openTeam(page);
    const photoMember = teamMembers.find((member) => member.photo !== undefined)!;
    const photoCard = team.getByRole('article', { name: photoMember.name });
    const realPhoto = photoCard.getByRole('img', { name: photoAltFor(photoMember.name) });

    await expect(realPhoto).toBeVisible();

    await realPhoto.evaluate((element) => {
      element.dispatchEvent(new Event('error'));
    });

    const fallback = photoCard.getByRole('img', { name: fallbackAltFor(photoMember.name) });
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveAttribute('data-team-photo-fallback', photoMember.id);
    await expect(photoCard.getByRole('img', { name: photoAltFor(photoMember.name) })).toHaveCount(
      0
    );
    await expect(photoCard.getByText(teamCopy.imageFallback, { exact: true })).toBeVisible();
    await expect(photoCard.locator('img')).toHaveCount(0);
  });

  test('keeps photo motion disabled with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const team = await openTeam(page);
    const photoMember = teamMembers.find((member) => member.photo !== undefined)!;
    const photoCard = team.getByRole('article', { name: photoMember.name });
    const realPhoto = photoCard.getByRole('img', { name: photoAltFor(photoMember.name) });

    await expect(realPhoto).toBeVisible();

    const motionStyles = await photoCard.evaluate((element) => {
      const card = window.getComputedStyle(element);
      const image = element.querySelector('img');
      return {
        cardTransitionDuration: parseFloat(card.transitionDuration),
        cardTransform: card.transform,
        imageTransitionDuration: image
          ? parseFloat(window.getComputedStyle(image).transitionDuration)
          : 0,
      };
    });

    expect(motionStyles.cardTransitionDuration).toBeLessThan(0.001);
    expect(motionStyles.imageTransitionDuration).toBeLessThan(0.001);
    expect(motionStyles.cardTransform).toBe('none');
  });
});
