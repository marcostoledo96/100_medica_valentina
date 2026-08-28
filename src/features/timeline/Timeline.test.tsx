import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { TimelineCollection } from '../../domain/schemas/timeline.schema';
import { TimelineCollectionSchema } from '../../domain/schemas/timeline.schema';
import { Timeline } from './Timeline';
import { timelinePresentation } from './timelinePresentation';

const fixtureCategories = [
  'academic',
  'personal',
  'hospital',
  'funny',
  'milestone',
  'academic',
  'personal',
  'hospital',
  'funny',
  'milestone',
] as const;

const timelineFixture: TimelineCollection = TimelineCollectionSchema.parse(
  fixtureCategories.map((category, index) => ({
    id: `fixture-${String(index + 1).padStart(2, '0')}`,
    date: `2020-${String(index + 1).padStart(2, '0')}`,
    title: `Momento provisional ${index + 1}`,
    description: `Descripción provisional ${index + 1}`,
    category,
    ...(index === 0
      ? {
          image: '/images/timeline/fixture-01.webp',
          imageAlt: 'Imagen provisional del primer momento',
        }
      : {}),
    ...(index === 1 ? { quote: 'Una frase provisional para el recorrido.' } : {}),
  }))
);

const categoryContracts = [
  {
    category: 'academic',
    label: 'Académico',
    badgeClassName: 'border-status-info bg-status-info text-status-info-fg',
  },
  {
    category: 'personal',
    label: 'Personal',
    badgeClassName: 'border-accent-secondary bg-accent-secondary text-accent-secondary-fg',
  },
  {
    category: 'hospital',
    label: 'Hospital',
    badgeClassName: 'border-status-success bg-status-success text-status-success-fg',
  },
  {
    category: 'funny',
    label: 'Anécdota',
    badgeClassName: 'border-status-warning bg-status-warning text-status-warning-fg',
  },
  {
    category: 'milestone',
    label: 'Hito',
    badgeClassName: 'border-accent-primary bg-accent-primary text-accent-primary-fg',
  },
] as const;

describe('Timeline', () => {
  it('renders ten authored entries in order without mutating the input collection', () => {
    const entries = timelineFixture.map((entry) => ({ ...entry }));
    const originalEntries = entries.map((entry) => ({ ...entry }));

    render(<Timeline entries={entries} heading="Línea de tiempo" />);

    const list = screen.getByRole('list', { name: 'Momentos en orden cronológico' });
    const articles = within(list).getAllByRole('article');
    const headings = articles.map((article) => within(article).getByRole('heading', { level: 3 }));

    expect(screen.getByRole('heading', { level: 2, name: 'Línea de tiempo' })).toBeVisible();
    expect(articles).toHaveLength(10);
    expect(headings.map((heading) => heading.textContent)).toEqual(
      entries.map((entry) => entry.title)
    );
    expect(entries).toEqual(originalEntries);
  });

  it('renders every canonical category with its visible label and semantic badge contract', () => {
    render(<Timeline entries={timelineFixture} />);

    const articles = within(
      screen.getByRole('list', { name: 'Momentos en orden cronológico' })
    ).getAllByRole('article');

    for (const contract of categoryContracts) {
      expect(timelinePresentation.categories[contract.category]).toEqual({
        label: contract.label,
        badgeClassName: contract.badgeClassName,
      });

      const article = articles[fixtureCategories.indexOf(contract.category)];
      expect(article).toBeDefined();

      const categoryBadge = within(article!).getByText(contract.label, { exact: true });
      expect(categoryBadge).toBeVisible();
      expect(categoryBadge).toHaveClass(...contract.badgeClassName.split(' '));
    }

    expect(new Set(categoryContracts.map(({ badgeClassName }) => badgeClassName)).size).toBe(5);
  });

  it('keeps entries visible without a scripted reveal state', () => {
    render(<Timeline entries={timelineFixture} />);

    for (const article of screen.getAllByRole('article')) {
      expect(article).toBeVisible();
      expect(article).not.toHaveAttribute('aria-hidden', 'true');
    }
  });
});
