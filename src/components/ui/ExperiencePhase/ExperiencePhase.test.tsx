import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ExperiencePhaseProvider } from './ExperiencePhaseProvider';
import { useExperiencePhase } from '../../../hooks/useExperiencePhase';

function TestConsumer() {
  const { phase, setPhase } = useExperiencePhase();

  return (
    <div>
      <span data-testid="current-phase">{phase}</span>
      <button onClick={() => setPhase('human')}>Switch to Human</button>
      <button onClick={() => setPhase('finale')}>Switch to Finale</button>
      <button onClick={() => setPhase('clinical')}>Switch to Clinical</button>
    </div>
  );
}

describe('ExperiencePhase Provider & Hook', () => {
  it('provides default clinical phase and data-experience-phase attribute', () => {
    const { container } = render(
      <ExperiencePhaseProvider>
        <TestConsumer />
      </ExperiencePhaseProvider>
    );

    expect(screen.getByTestId('current-phase')).toHaveTextContent('clinical');
    expect(container.firstChild).toHaveAttribute('data-experience-phase', 'clinical');
  });

  it('allows dynamic switching between clinical, human, and finale', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ExperiencePhaseProvider initialPhase="clinical">
        <TestConsumer />
      </ExperiencePhaseProvider>
    );

    await user.click(screen.getByRole('button', { name: /switch to human/i }));
    expect(screen.getByTestId('current-phase')).toHaveTextContent('human');
    expect(container.firstChild).toHaveAttribute('data-experience-phase', 'human');

    await user.click(screen.getByRole('button', { name: /switch to finale/i }));
    expect(screen.getByTestId('current-phase')).toHaveTextContent('finale');
    expect(container.firstChild).toHaveAttribute('data-experience-phase', 'finale');

    await user.click(screen.getByRole('button', { name: /switch to clinical/i }));
    expect(screen.getByTestId('current-phase')).toHaveTextContent('clinical');
    expect(container.firstChild).toHaveAttribute('data-experience-phase', 'clinical');
  });

  it('calls onPhaseChange callback when phase changes', async () => {
    const handlePhaseChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ExperiencePhaseProvider initialPhase="clinical" onPhaseChange={handlePhaseChange}>
        <TestConsumer />
      </ExperiencePhaseProvider>
    );

    await user.click(screen.getByRole('button', { name: /switch to human/i }));
    expect(handlePhaseChange).toHaveBeenCalledWith('human');
  });

  it('throws error when useExperiencePhase is used outside of provider', () => {
    // Suppress React boundary console.error for expected test error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      /useExperiencePhase must be used within an ExperiencePhaseProvider/i
    );

    spy.mockRestore();
  });
});
