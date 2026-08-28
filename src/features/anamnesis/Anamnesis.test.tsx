import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AnamnesisContent } from '../../domain/schemas/anamnesis.schema';
import { AnamnesisContentSchema } from '../../domain/schemas/anamnesis.schema';
import { Anamnesis } from './Anamnesis';

const baseFixture = {
  eyebrow: 'SENTINEL eyebrow',
  heading: 'SENTINEL heading',
  intro: 'Puente provisional SENTINEL intro.',
  blocks: [
    { id: 'demo-uno', title: 'SENTINEL title one', body: 'Cuerpo provisional SENTINEL body one.' },
    { id: 'demo-dos', title: 'SENTINEL title two', body: 'Cuerpo provisional SENTINEL body two.' },
  ],
  photoFallbackLabel: 'SENTINEL fallback label',
  transitionLabel: 'Transición SENTINEL transition label.',
  ctaLabel: 'SENTINEL CTA',
};

function buildContent(overrides: Partial<AnamnesisContent> = {}): AnamnesisContent {
  return AnamnesisContentSchema.parse({ ...baseFixture, ...overrides });
}

const completeContent = buildContent({
  photo: {
    src: '/images/demo/portrait.webp',
    alt: 'Retrato provisional SENTINEL alt',
    width: 320,
    height: 400,
  },
  quote: { text: 'Frase provisional SENTINEL quote.', attribution: 'SENTINEL attribution' },
});

describe('Anamnesis', () => {
  it('renders injected props: heading, blocks, photo, quote, and CTA href', () => {
    render(<Anamnesis content={completeContent} nextHref="#linea-tiempo" />);

    expect(screen.getByRole('heading', { level: 2, name: 'SENTINEL heading' })).toBeVisible();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(screen.getByText('Cuerpo provisional SENTINEL body two.')).toBeVisible();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Retrato provisional SENTINEL alt');
    expect(img).toHaveAttribute('src', '/images/demo/portrait.webp');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');

    const quote = screen.getByRole('blockquote');
    expect(quote).toBeVisible();
    expect(quote).toHaveTextContent('Frase provisional SENTINEL quote.');
    expect(screen.getByText('SENTINEL attribution').closest('cite')).not.toBeNull();

    expect(screen.getByRole('link', { name: /SENTINEL CTA/ })).toHaveAttribute(
      'href',
      '#linea-tiempo'
    );
  });

  it('renders at most three narrative blocks', () => {
    const threeBlocks = buildContent({
      blocks: [
        ...baseFixture.blocks,
        { id: 'demo-tres', title: 'SENTINEL title three', body: 'Cuerpo provisional tres.' },
      ],
    });
    render(<Anamnesis content={threeBlocks} nextHref="#signos-vitales" />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('renders no photo gap or wrapper when the photo is absent', () => {
    render(<Anamnesis content={buildContent()} nextHref="#signos-vitales" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByTestId('anamnesis-photo')).not.toBeInTheDocument();
    expect(screen.queryByTestId('anamnesis-photo-fallback')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('renders no quote when it is absent', () => {
    render(
      <Anamnesis
        content={buildContent({
          photo: {
            src: '/images/demo/portrait.webp',
            alt: 'Retrato provisional',
            width: 320,
            height: 400,
          },
        })}
        nextHref="#signos-vitales"
      />
    );
    expect(screen.queryByRole('blockquote')).not.toBeInTheDocument();
    expect(screen.queryByText('SENTINEL quote')).not.toBeInTheDocument();
  });

  it('renders an intentional narrative section with neither photo nor quote', () => {
    render(<Anamnesis content={buildContent()} nextHref="#signos-vitales" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('blockquote')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'SENTINEL heading' })).toBeVisible();
    expect(screen.getByTestId('anamnesis-bridge')).toBeVisible();
  });

  it('keeps the editorial DOM order: heading, photo, blocks, quote, bridge', () => {
    const { container } = render(<Anamnesis content={completeContent} nextHref="#linea-tiempo" />);
    const following = (before: Element, after: Element) =>
      Boolean(before.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING);

    const heading = screen.getByRole('heading', { level: 2 });
    const photo = screen.getByTestId('anamnesis-photo');
    const firstBlockTitle = screen.getAllByRole('heading', { level: 3 })[0];
    if (!firstBlockTitle) {
      throw new Error('Expected at least one narrative block heading');
    }
    const quote = screen.getByTestId('anamnesis-quote');
    const bridge = screen.getByTestId('anamnesis-bridge');

    expect(following(heading, photo)).toBe(true);
    expect(following(photo, firstBlockTitle)).toBe(true);
    expect(following(firstBlockTitle, quote)).toBe(true);
    expect(following(quote, bridge)).toBe(true);
    expect(container.firstElementChild).toHaveAttribute('data-testid', 'anamnesis');
  });

  it('shows the intentional accessible fallback when the photo fails to load', () => {
    render(<Anamnesis content={completeContent} nextHref="#signos-vitales" />);

    fireEvent.error(screen.getByRole('img'));

    const fallback = screen.getByRole('img', { name: 'SENTINEL fallback label' });
    expect(fallback).toBeVisible();
    expect(
      screen.queryByRole('img', { name: 'Retrato provisional SENTINEL alt' })
    ).not.toBeInTheDocument();
  });

  it('renders no invented personal copy: every visible string comes from props', () => {
    render(<Anamnesis content={completeContent} nextHref="#linea-tiempo" />);

    const text = document.body.textContent ?? '';
    // Production fixture strings must never leak into a prop-only render.
    expect(text).not.toContain('Origen');
    expect(text).not.toContain('Vocación');
    expect(text).not.toContain('Continuar la historia');
    expect(text).not.toContain('puente narrativo provisional');
  });
});
