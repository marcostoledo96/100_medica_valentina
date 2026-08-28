import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { bootContent } from '../../../content/boot';
import { BootScene, type BootSceneProps } from './BootScene';

function renderScene(overrides: Partial<BootSceneProps> = {}) {
  const props: BootSceneProps = {
    content: {
      ...bootContent,
      heading: 'Contenido inyectado',
      primaryAction: 'Abrir contenido inyectado',
      skipAction: 'Saltar contenido inyectado',
      replayAction: 'Reproducir contenido inyectado',
    },
    mode: 'intro',
    nextHref: '#siguiente-seccion',
    onOpen: vi.fn(),
    onSkip: vi.fn(),
    onReplay: vi.fn(),
    ...overrides,
  };

  return {
    ...render(<BootScene {...props} />),
    props,
  };
}

describe('BootScene', () => {
  it('renders injected copy, heading association, and an immediate CTA anchor', () => {
    const { props } = renderScene();

    expect(screen.getByRole('heading', { level: 1, name: 'Contenido inyectado' })).toHaveAttribute(
      'id',
      'inicio-heading'
    );
    expect(screen.getByText(props.content.intro)).toBeInTheDocument();

    const cta = screen.getByRole('link', { name: 'Abrir contenido inyectado' });
    expect(cta).toHaveAttribute('href', '#siguiente-seccion');
    expect(cta).toBeVisible();
    expect(screen.getByRole('link', { name: 'Saltar contenido inyectado' })).toBeVisible();
  });

  it('exposes accessible skip and replay actions for their respective modes', async () => {
    const user = userEvent.setup();
    const onSkip = vi.fn();
    const onReplay = vi.fn();
    const { rerender } = renderScene({ onSkip, onReplay });

    await user.click(screen.getByRole('link', { name: 'Saltar contenido inyectado' }));
    expect(onSkip).toHaveBeenCalledTimes(1);

    rerender(
      <BootScene
        content={{
          ...bootContent,
          replayAction: 'Reproducir contenido inyectado',
        }}
        mode="revisit"
        nextHref="#siguiente-seccion"
        onOpen={vi.fn()}
        onSkip={onSkip}
        onReplay={onReplay}
      />
    );

    expect(
      screen.queryByRole('link', { name: 'Saltar contenido inyectado' })
    ).not.toBeInTheDocument();
    const replay = screen.getByRole('button', { name: 'Reproducir contenido inyectado' });
    expect(replay).toBeVisible();
    await user.click(replay);
    expect(onReplay).toHaveBeenCalledTimes(1);
  });

  it('does not depend on JavaScript timers to render content or actions', () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');

    renderScene();

    expect(screen.getByRole('link', { name: 'Abrir contenido inyectado' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Saltar contenido inyectado' })).toBeVisible();
    expect(setTimeoutSpy).not.toHaveBeenCalled();
    expect(setIntervalSpy).not.toHaveBeenCalled();

    setTimeoutSpy.mockRestore();
    setIntervalSpy.mockRestore();
  });
});
