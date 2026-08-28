import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AudioMessage } from '../../domain/types';
import { AudioMessages } from './AudioMessages';

const audioFixture: AudioMessage[] = [
  {
    id: 'audio-test-01',
    author: 'Amiga de prueba',
    title: 'Un mensaje para celebrar',
    src: '/audio/test/message-01.mp3',
    duration: 25,
  },
  {
    id: 'audio-test-02',
    author: 'Familia de prueba',
    src: '/audio/test/message-02.m4a',
  },
];

function mockMediaApi() {
  const play = vi
    .spyOn(HTMLMediaElement.prototype, 'play')
    .mockImplementation(() => Promise.resolve());
  const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);

  return { play, pause };
}

function getCard(id: string): HTMLElement {
  return screen.getByTestId(`audio-message-${id}`);
}

function getMedia(id: string): HTMLAudioElement {
  return screen.getByTestId(`audio-media-${id}`) as HTMLAudioElement;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('AudioMessages', () => {
  it('renders injected messages and optional authored metadata', () => {
    mockMediaApi();
    render(
      <AudioMessages
        messages={audioFixture}
        copy={{
          heading: 'Voces del equipo',
          intro: 'Mensajes recibidos para esta celebración.',
        }}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Voces del equipo' })).toBeVisible();
    expect(screen.getByText('Mensajes recibidos para esta celebración.')).toBeVisible();
    expect(screen.getByText(audioFixture[0]!.author)).toBeVisible();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Un mensaje para celebrar' })
    ).toBeVisible();
    expect(screen.getByText('Duración: 0:25')).toBeVisible();

    const messageWithoutOptionalFields = getCard(audioFixture[1]!.id);
    expect(within(messageWithoutOptionalFields).getByText(audioFixture[1]!.author)).toBeVisible();
    expect(within(messageWithoutOptionalFields).queryByRole('heading', { level: 3 })).toBeNull();
    expect(within(messageWithoutOptionalFields).queryByText(/Duración:/)).toBeNull();
  });

  it('creates no media elements and assigns no sources before an explicit play action', () => {
    const { play } = mockMediaApi();
    render(<AudioMessages messages={audioFixture} />);

    expect(document.querySelectorAll('audio')).toHaveLength(0);
    expect(screen.queryByTestId(`audio-media-${audioFixture[0]!.id}`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`audio-media-${audioFixture[1]!.id}`)).not.toBeInTheDocument();
    expect(play).not.toHaveBeenCalled();
  });

  it('creates media elements lazily, one per played message, without pre-play sources', async () => {
    const { play } = mockMediaApi();
    const user = userEvent.setup();
    render(<AudioMessages messages={audioFixture} />);

    expect(document.querySelectorAll('audio')).toHaveLength(0);

    await user.click(
      within(getCard(audioFixture[0]!.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );

    await waitFor(() =>
      expect(getCard(audioFixture[0]!.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    expect(document.querySelectorAll('audio')).toHaveLength(1);
    expect(getMedia(audioFixture[0]!.id)).toHaveAttribute('src', audioFixture[0]!.src);

    await user.click(
      within(getCard(audioFixture[1]!.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );

    await waitFor(() =>
      expect(getCard(audioFixture[1]!.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    expect(document.querySelectorAll('audio')).toHaveLength(2);
    expect(getMedia(audioFixture[1]!.id)).toHaveAttribute('src', audioFixture[1]!.src);
    expect(play).toHaveBeenCalledTimes(2);
  });

  it('supports keyboard activation and keeps focus on the control', async () => {
    mockMediaApi();
    const user = userEvent.setup();
    render(<AudioMessages messages={[audioFixture[0]!]} />);

    const card = getCard(audioFixture[0]!.id);
    const button = within(card).getByRole('button', { name: /Reproducir mensaje:/ });

    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');

    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'playing'));
    expect(within(card).getByRole('button', { name: /Pausar mensaje:/ })).toHaveFocus();

    await user.keyboard(' ');

    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'paused'));
    expect(within(card).getByRole('button', { name: /Reproducir mensaje:/ })).toHaveFocus();
  });

  it('pauses and releases media when a played message is removed from the collection', async () => {
    const { pause } = mockMediaApi();
    const user = userEvent.setup();
    const { rerender } = render(<AudioMessages messages={audioFixture} />);

    await user.click(
      within(getCard(audioFixture[0]!.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(audioFixture[0]!.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    expect(document.querySelectorAll('audio')).toHaveLength(1);

    rerender(<AudioMessages messages={[audioFixture[1]!]} />);

    expect(screen.queryByTestId(`audio-media-${audioFixture[0]!.id}`)).not.toBeInTheDocument();
    expect(document.querySelectorAll('audio')).toHaveLength(0);
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it('plays and pauses a message with visible and accessible state changes', async () => {
    const { play, pause } = mockMediaApi();
    const user = userEvent.setup();
    render(<AudioMessages messages={audioFixture} />);

    const firstMessage = audioFixture[0]!;
    const card = getCard(firstMessage.id);
    const button = within(card).getByRole('button', {
      name: `Reproducir mensaje: ${firstMessage.title} — ${firstMessage.author}`,
    });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(card).toHaveAttribute('data-audio-state', 'idle');

    await user.click(button);

    await waitFor(() => {
      expect(play).toHaveBeenCalledTimes(1);
      expect(card).toHaveAttribute('data-audio-state', 'playing');
    });
    expect(getMedia(firstMessage.id)).toHaveAttribute('src', firstMessage.src);
    expect(button).toHaveAttribute(
      'aria-label',
      `Pausar mensaje: ${firstMessage.title} — ${firstMessage.author}`
    );
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(within(card).getByText('Reproduciendo')).toBeVisible();

    await user.click(button);

    expect(pause).toHaveBeenCalledTimes(1);
    expect(card).toHaveAttribute('data-audio-state', 'paused');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(within(card).getByText('En pausa')).toBeVisible();
  });

  it('pauses the locally active message before playing another one', async () => {
    const { play, pause } = mockMediaApi();
    const user = userEvent.setup();
    render(<AudioMessages messages={audioFixture} />);

    const firstCard = getCard(audioFixture[0]!.id);
    const secondCard = getCard(audioFixture[1]!.id);
    await user.click(
      within(firstCard).getByRole('button', {
        name: /Reproducir mensaje: Un mensaje para celebrar/,
      })
    );
    await waitFor(() => expect(firstCard).toHaveAttribute('data-audio-state', 'playing'));

    await user.click(
      within(secondCard).getByRole('button', { name: /Reproducir mensaje: Familia de prueba/ })
    );

    await waitFor(() => expect(secondCard).toHaveAttribute('data-audio-state', 'playing'));
    expect(pause).toHaveBeenCalledTimes(1);
    expect(play).toHaveBeenCalledTimes(2);
    expect(firstCard).toHaveAttribute('data-audio-state', 'paused');
    expect(secondCard).toHaveAttribute('data-audio-state', 'playing');
  });

  it('surfaces a rejected play request as a recoverable error state', async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValue(new Error('blocked by media policy'));
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<AudioMessages messages={audioFixture} />);

    const card = getCard(audioFixture[0]!.id);
    await user.click(within(card).getByRole('button', { name: /Reproducir mensaje:/ }));

    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'error'));
    expect(
      within(card).getByText('Este mensaje no está disponible en este momento.')
    ).toBeVisible();
    expect(within(card).getByRole('button', { name: /Reintentar mensaje:/ })).toBeEnabled();
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('surfaces a media error without removing the message controls', async () => {
    mockMediaApi();
    const user = userEvent.setup();
    render(<AudioMessages messages={audioFixture} />);

    const firstMessage = audioFixture[0]!;
    const card = getCard(firstMessage.id);
    await user.click(within(card).getByRole('button', { name: /Reproducir mensaje:/ }));
    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'playing'));

    fireEvent.error(getMedia(firstMessage.id));

    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'error'));
    expect(within(card).getByRole('button', { name: /Reintentar mensaje:/ })).toBeVisible();
  });

  it('renders a graceful empty state without media controls', () => {
    render(<AudioMessages messages={[]} />);

    expect(screen.getByTestId('audio-messages')).toBeVisible();
    expect(screen.getByText('Todavía no hay mensajes de audio disponibles.')).toBeVisible();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.queryAllByRole('audio')).toHaveLength(0);
  });

  it('pauses mounted media during cleanup', async () => {
    const { pause } = mockMediaApi();
    const user = userEvent.setup();
    const { unmount } = render(<AudioMessages messages={[audioFixture[0]!]} />);

    await user.click(
      within(getCard(audioFixture[0]!.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(audioFixture[0]!.id)).toHaveAttribute('data-audio-state', 'playing')
    );

    unmount();

    expect(pause).toHaveBeenCalledTimes(1);
  });

  it('starts a reinserted message from a clean state and plays fresh media on first activation', async () => {
    const { play } = mockMediaApi();
    const user = userEvent.setup();
    const { rerender } = render(<AudioMessages messages={audioFixture} />);

    const removedMessage = audioFixture[0]!;
    await user.click(
      within(getCard(removedMessage.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(removedMessage.id)).toHaveAttribute('data-audio-state', 'playing')
    );

    rerender(<AudioMessages messages={[audioFixture[1]!]} />);
    expect(screen.queryByTestId(`audio-message-${removedMessage.id}`)).not.toBeInTheDocument();

    rerender(<AudioMessages messages={audioFixture} />);

    const reinsertedCard = getCard(removedMessage.id);
    expect(reinsertedCard).toHaveAttribute('data-audio-state', 'idle');
    expect(within(reinsertedCard).getByText('Listo para reproducir')).toBeVisible();
    expect(
      within(reinsertedCard).getByRole('button', { name: /Reproducir mensaje:/ })
    ).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByTestId(`audio-media-${removedMessage.id}`)).not.toBeInTheDocument();

    await user.click(within(reinsertedCard).getByRole('button', { name: /Reproducir mensaje:/ }));

    await waitFor(() => expect(reinsertedCard).toHaveAttribute('data-audio-state', 'playing'));
    expect(getMedia(removedMessage.id)).toBeInTheDocument();
    expect(getMedia(removedMessage.id)).toHaveAttribute('src', removedMessage.src);
    expect(play).toHaveBeenCalledTimes(2);
  });

  it('clears stale paused and error playback state when messages are removed and reinserted', async () => {
    mockMediaApi();
    const user = userEvent.setup();
    const { rerender } = render(<AudioMessages messages={audioFixture} />);

    const pausedMessage = audioFixture[0]!;
    await user.click(
      within(getCard(pausedMessage.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(pausedMessage.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    await user.click(
      within(getCard(pausedMessage.id)).getByRole('button', { name: /Pausar mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(pausedMessage.id)).toHaveAttribute('data-audio-state', 'paused')
    );

    const erroredMessage = audioFixture[1]!;
    await user.click(
      within(getCard(erroredMessage.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(erroredMessage.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    fireEvent.error(getMedia(erroredMessage.id));
    await waitFor(() =>
      expect(getCard(erroredMessage.id)).toHaveAttribute('data-audio-state', 'error')
    );

    rerender(<AudioMessages messages={[]} />);
    rerender(<AudioMessages messages={audioFixture} />);

    const reinsertedPausedCard = getCard(pausedMessage.id);
    expect(reinsertedPausedCard).toHaveAttribute('data-audio-state', 'idle');
    expect(within(reinsertedPausedCard).getByText('Listo para reproducir')).toBeVisible();
    expect(within(reinsertedPausedCard).queryByRole('alert')).toBeNull();

    const reinsertedErroredCard = getCard(erroredMessage.id);
    expect(reinsertedErroredCard).toHaveAttribute('data-audio-state', 'idle');
    expect(within(reinsertedErroredCard).getByText('Listo para reproducir')).toBeVisible();
    expect(within(reinsertedErroredCard).queryByRole('alert')).toBeNull();
    expect(
      screen.queryByText('Este mensaje no está disponible en este momento.')
    ).not.toBeInTheDocument();
  });
});
