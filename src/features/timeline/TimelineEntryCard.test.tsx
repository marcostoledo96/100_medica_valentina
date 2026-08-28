import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { TimelineEntry } from '../../domain/schemas/timeline.schema';
import { TimelineEntryCard } from './TimelineEntryCard';

const entryWithoutOptionalContent: TimelineEntry = {
  id: 'fixture-minimal',
  date: '2021-06',
  title: 'Hito mínimo',
  description: 'Descripción del hito mínimo.',
  category: 'personal',
};

describe('TimelineEntryCard', () => {
  it('renders a semantic article with a visible date and category label', () => {
    render(<TimelineEntryCard entry={entryWithoutOptionalContent} />);

    const article = screen.getByRole('article', { name: 'Hito mínimo' });

    expect(article.tagName).toBe('ARTICLE');
    expect(screen.getByRole('heading', { level: 3, name: 'Hito mínimo' })).toBeInTheDocument();
    expect(screen.getByText('junio de 2021')).toBeVisible();
    expect(screen.getByText('Personal')).toBeVisible();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('blockquote')).not.toBeInTheDocument();
  });

  it('renders optional media with a stable aspect ratio and optional quote', () => {
    const entry: TimelineEntry = {
      ...entryWithoutOptionalContent,
      id: 'fixture-media',
      image: '/images/timeline/fixture-media.webp',
      imageAlt: 'Imagen del hito mínimo',
      quote: 'Una frase del hito mínimo.',
    };

    render(<TimelineEntryCard entry={entry} />);

    const image = screen.getByRole('img', { name: 'Imagen del hito mínimo' });
    expect(image).toHaveAttribute('src', '/images/timeline/fixture-media.webp');
    expect(image).toHaveAttribute('alt', 'Imagen del hito mínimo');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(image.parentElement).toHaveClass('aspect-[4/3]');
    expect(screen.getByRole('blockquote')).toHaveTextContent('Una frase del hito mínimo.');
  });

  it('falls back to the entry title for media without an explicit alt text', () => {
    const entry: TimelineEntry = {
      ...entryWithoutOptionalContent,
      id: 'fixture-media-fallback',
      image: '/images/timeline/fixture-fallback.webp',
    };

    render(<TimelineEntryCard entry={entry} />);

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Imagen de Hito mínimo');
  });
});
