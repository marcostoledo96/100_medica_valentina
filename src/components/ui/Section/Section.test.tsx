import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Section } from './Section';

describe('Section Primitive', () => {
  it('renders semantic section element with children', () => {
    render(
      <Section aria-label="Clinical Telemetry">
        <p>Section Content</p>
      </Section>
    );
    const section = screen.getByRole('region', { name: /clinical telemetry/i });
    expect(section).toBeInTheDocument();
    expect(section.tagName).toBe('SECTION');
    expect(screen.getByText('Section Content')).toBeInTheDocument();
  });

  it('supports polymorphic HTML elements (div, article, main)', () => {
    const { rerender } = render(
      <Section as="article" data-testid="section-root">
        Article Section
      </Section>
    );
    expect(screen.getByTestId('section-root').tagName).toBe('ARTICLE');

    rerender(
      <Section as="div" data-testid="section-root">
        Div Section
      </Section>
    );
    expect(screen.getByTestId('section-root').tagName).toBe('DIV');
  });

  it('applies paddingY and containerWidth configurations', () => {
    const { container, rerender } = render(
      <Section paddingY="lg" containerWidth="sm">
        Small Container
      </Section>
    );
    expect(container.firstChild).toHaveClass('py-12');
    expect(container.querySelector('.max-w-md')).toBeInTheDocument();

    rerender(
      <Section paddingY="sm" containerWidth="lg">
        Large Container
      </Section>
    );
    expect(container.firstChild).toHaveClass('py-4');
    expect(container.querySelector('.max-w-4xl')).toBeInTheDocument();
  });

  it('supports fullBleed layout without inner container max-width constraints', () => {
    const { container } = render(
      <Section fullBleed>
        <p>Full Bleed Hero</p>
      </Section>
    );
    expect(container.querySelector('.max-w-2xl')).not.toBeInTheDocument();
    expect(container.querySelector('.w-full')).toBeInTheDocument();
  });

  it('forwards ref to underlying DOM element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Section ref={ref}>Ref Section</Section>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
