import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Root & Design System Showcase Integration', () => {
  it('renders experience-root landmark main without errors', () => {
    render(<App />);
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveAttribute('id', 'experience-root');
  });

  it('renders the DesignSystemShowcase with phase switcher', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    expect(screen.getByText('Design System Showcase')).toBeInTheDocument();

    const rootElement = container.querySelector('[data-experience-phase]');
    expect(rootElement).toHaveAttribute('data-experience-phase', 'clinical');

    const humanBtn = screen.getByRole('button', { name: 'human' });
    await user.click(humanBtn);

    expect(rootElement).toHaveAttribute('data-experience-phase', 'human');
  });
});
