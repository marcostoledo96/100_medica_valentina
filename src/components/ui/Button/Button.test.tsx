import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button Primitive', () => {
  it('renders a native button element with children', () => {
    render(<Button>Confirm Action</Button>);
    const button = screen.getByRole('button', { name: /confirm action/i });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('handles click events when active', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole('button', { name: /clickable/i });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports custom button types (submit, reset)', () => {
    render(<Button type="submit">Submit Form</Button>);
    const button = screen.getByRole('button', { name: /submit form/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders disabled state correctly and blocks click interactions', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );
    const button = screen.getByRole('button', { name: /disabled button/i });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders loading state with aria-busy and spinner', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button isLoading onClick={handleClick}>
        Saving Data
      </Button>
    );
    const button = screen.getByRole('button', { name: /saving data/i });

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant and size classes appropriately', () => {
    const { rerender } = render(
      <Button variant="secondary" size="lg">
        Secondary
      </Button>
    );
    let button = screen.getByRole('button', { name: /secondary/i });
    expect(button.className).toContain('bg-surface-raised');
    expect(button.className).toContain('min-h-[48px]');

    rerender(
      <Button variant="outline" size="sm">
        Outline
      </Button>
    );
    button = screen.getByRole('button', { name: /outline/i });
    expect(button.className).toContain('border-border-strong');
    expect(button.className).toContain('min-h-[44px]');
  });

  it('forwards ref correctly to HTMLButtonElement', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
