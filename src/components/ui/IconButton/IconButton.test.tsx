import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton Primitive', () => {
  const dummyIcon = <span data-testid="test-icon">🔍</span>;

  it('renders a button with mandatory accessible name (aria-label and title)', () => {
    render(<IconButton label="Search patient record" icon={dummyIcon} />);
    const button = screen.getByRole('button', { name: /search patient record/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Search patient record');
    expect(button).toHaveAttribute('title', 'Search patient record');
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('handles click events and user interactions', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<IconButton label="Close modal" icon={dummyIcon} onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /close modal/i });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('blocks interaction when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<IconButton label="Play audio" icon={dummyIcon} disabled onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /play audio/i });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<IconButton label="Loading record" icon={dummyIcon} isLoading />);
    const button = screen.getByRole('button', { name: /loading record/i });

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(screen.getByTestId('icon-button-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
  });

  it('guarantees touch target bounding classes', () => {
    render(<IconButton label="Toggle sound" icon={dummyIcon} size="md" />);
    const button = screen.getByRole('button', { name: /toggle sound/i });

    expect(button.className).toContain('min-h-[44px]');
    expect(button.className).toContain('min-w-[44px]');
  });

  it('forwards ref correctly to HTMLButtonElement', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} label="Ref icon" icon={dummyIcon} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
