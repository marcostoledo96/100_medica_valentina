import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card Primitive', () => {
  it('renders children within a surface container', () => {
    render(
      <Card>
        <p>Card Content</p>
      </Card>
    );
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('supports polymorphic rendering (article, section, div, aside)', () => {
    const { container, rerender } = render(
      <Card as="article" data-testid="card-article">
        Article Body
      </Card>
    );
    expect(screen.getByTestId('card-article').tagName).toBe('ARTICLE');

    rerender(
      <Card as="section" data-testid="card-section">
        Section Body
      </Card>
    );
    expect(screen.getByTestId('card-section').tagName).toBe('SECTION');
    expect(container).toBeInTheDocument();
  });

  it('applies variant styling classes', () => {
    const { rerender } = render(
      <Card variant="raised" data-testid="card">
        Raised
      </Card>
    );
    let card = screen.getByTestId('card');
    expect(card.className).toContain('shadow-raised');

    rerender(
      <Card variant="outlined" data-testid="card">
        Outlined
      </Card>
    );
    card = screen.getByTestId('card');
    expect(card.className).toContain('border-border-strong');
  });

  it('forwards ref to underlying DOM element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Card ref={ref}>Ref Card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
