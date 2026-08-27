import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden Primitive', () => {
  it('renders content accessible to assistive technology with sr-only styling', () => {
    render(
      <button>
        <span aria-hidden="true">🔔</span>
        <VisuallyHidden>Notifications (3 unread)</VisuallyHidden>
      </button>
    );

    const button = screen.getByRole('button', { name: /notifications \(3 unread\)/i });
    expect(button).toBeInTheDocument();

    const hiddenText = screen.getByText(/notifications \(3 unread\)/i);
    expect(hiddenText).toHaveClass('sr-only');
  });

  it('supports polymorphic rendering as span, div, or heading', () => {
    const { rerender } = render(
      <VisuallyHidden as="h1" data-testid="vh-element">
        Screen Reader Heading
      </VisuallyHidden>
    );
    expect(screen.getByTestId('vh-element').tagName).toBe('H1');

    rerender(
      <VisuallyHidden as="div" data-testid="vh-element">
        Screen Reader Block
      </VisuallyHidden>
    );
    expect(screen.getByTestId('vh-element').tagName).toBe('DIV');
  });

  it('forwards ref to underlying DOM element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<VisuallyHidden ref={ref}>Ref VisuallyHidden</VisuallyHidden>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
