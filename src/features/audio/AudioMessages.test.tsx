import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useEffect, useLayoutEffect } from 'react';
import type { AudioMessage } from '../../domain/types';
import { AudioMessages } from './AudioMessages';

describe('unmount lifecycle ordering contract', () => {
  // The unmount guard in AudioMessages relies on this reconciler property of
  // react-dom 18.3: commitDeletionEffectsOnFiber runs a deleted function
  // component's OWN layout-effect destroys BEFORE recursivelyTraverse-
  // DeletionEffects reaches the descendant host fibers (where the <audio>
  // ref detaches), while passive destroys for the deleted subtree run after
  // the whole mutation. The component flips its mounted guard in a
  // useLayoutEffect cleanup so every media ref-null teardown observes the
  // guard as false; this tripwire fails if that ordering ever changes.
  it('runs layout-effect destroys before child ref detach and passive destroys after', () => {
    const lifecycleLog: string[] = [];
    function TestComponent() {
      useLayoutEffect(
        () => () => {
          lifecycleLog.push('layout-destroy');
        },
        []
      );
      useEffect(
        () => () => {
          lifecycleLog.push('passive-destroy');
        },
        []
      );
      return (
        <audio
          ref={(element) => {
            lifecycleLog.push(element === null ? 'ref-detach' : 'ref-attach');
          }}
          preload="none"
        />
      );
    }

    const { unmount } = render(<TestComponent />);
    unmount();

    expect(lifecycleLog).toEqual(['ref-attach', 'layout-destroy', 'ref-detach', 'passive-destroy']);
  });
});

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

  const load = vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);

  return { play, pause, load };
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

  it('pauses and fully releases media when a played message is removed from the collection', async () => {
    const { pause, load } = mockMediaApi();
    const user = userEvent.setup();
    const { rerender } = render(<AudioMessages messages={audioFixture} />);

    await user.click(
      within(getCard(audioFixture[0]!.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(audioFixture[0]!.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    expect(document.querySelectorAll('audio')).toHaveLength(1);
    const detachedMedia = getMedia(audioFixture[0]!.id);

    rerender(<AudioMessages messages={[audioFixture[1]!]} />);

    expect(screen.queryByTestId(`audio-media-${audioFixture[0]!.id}`)).not.toBeInTheDocument();
    expect(document.querySelectorAll('audio')).toHaveLength(0);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(detachedMedia).not.toHaveAttribute('src');
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('plays and pauses a message with visible and accessible state changes', async () => {
    const { play, pause, load } = mockMediaApi();
    const user = userEvent.setup();
    render(<AudioMessages messages={audioFixture} />);

    const firstMessage = audioFixture[0]!;
    const card = getCard(firstMessage.id);
    const button = within(card).getByRole('button', {
      name: `Reproducir mensaje: ${firstMessage.title} — ${firstMessage.author}`,
    });

    expect(card).toHaveAttribute('data-audio-state', 'idle');
    const status = within(card).getByTestId(`audio-status-${firstMessage.id}`);
    expect(status).toHaveAttribute('role', 'status');
    expect(status).not.toHaveAttribute('aria-live');

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
    expect(within(card).getByText('Reproduciendo')).toBeVisible();

    await user.click(button);

    expect(pause).toHaveBeenCalledTimes(1);
    expect(card).toHaveAttribute('data-audio-state', 'paused');
    expect(within(card).getByText('En pausa')).toBeVisible();
    expect(load).not.toHaveBeenCalled();
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
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<AudioMessages messages={audioFixture} />);

    const card = getCard(audioFixture[0]!.id);
    await user.click(within(card).getByRole('button', { name: /Reproducir mensaje:/ }));

    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'error'));
    expect(
      within(card).getByText('Este mensaje no está disponible en este momento.')
    ).toBeVisible();
    const status = within(card).getByTestId(`audio-status-${audioFixture[0]!.id}`);
    expect(status).toHaveAttribute('role', 'alert');
    expect(status).not.toHaveAttribute('aria-live');
    expect(within(card).getByRole('button', { name: /Reintentar mensaje:/ })).toBeEnabled();
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('retries after a failed play request by resetting the media resource and playing again', async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValueOnce(new Error('transient decode failure'))
      .mockResolvedValueOnce(undefined);
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    const load = vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<AudioMessages messages={audioFixture} />);

    const firstMessage = audioFixture[0]!;
    const card = getCard(firstMessage.id);
    await user.click(within(card).getByRole('button', { name: /Reproducir mensaje:/ }));

    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'error'));
    expect(play).toHaveBeenCalledTimes(1);
    expect(load).not.toHaveBeenCalled();

    await user.click(within(card).getByRole('button', { name: /Reintentar mensaje:/ }));

    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'playing'));
    expect(play).toHaveBeenCalledTimes(2);
    expect(load).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll('audio')).toHaveLength(1);
    expect(getMedia(firstMessage.id)).toHaveAttribute('src', firstMessage.src);
    expect(pause).not.toHaveBeenCalled();
  });

  it('surfaces a media error without removing the message controls', async () => {
    const { load } = mockMediaApi();
    const user = userEvent.setup();
    render(<AudioMessages messages={audioFixture} />);

    const firstMessage = audioFixture[0]!;
    const card = getCard(firstMessage.id);
    await user.click(within(card).getByRole('button', { name: /Reproducir mensaje:/ }));
    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'playing'));

    fireEvent.error(getMedia(firstMessage.id));

    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'error'));
    expect(within(card).getByRole('button', { name: /Reintentar mensaje:/ })).toBeVisible();

    await user.click(within(card).getByRole('button', { name: /Reintentar mensaje:/ }));

    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'playing'));
    expect(load).toHaveBeenCalledTimes(1);
    expect(getMedia(firstMessage.id)).toHaveAttribute('src', firstMessage.src);
  });

  it('renders a graceful empty state without media controls', () => {
    render(<AudioMessages messages={[]} />);

    expect(screen.getByTestId('audio-messages')).toBeVisible();
    expect(screen.getByText('Todavía no hay mensajes de audio disponibles.')).toBeVisible();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.queryAllByRole('audio')).toHaveLength(0);
  });

  it('pauses and fully releases mounted media during unmount cleanup', async () => {
    const { pause, load } = mockMediaApi();
    const user = userEvent.setup();
    const { unmount } = render(<AudioMessages messages={[audioFixture[0]!]} />);

    await user.click(
      within(getCard(audioFixture[0]!.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(audioFixture[0]!.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    const detachedMedia = getMedia(audioFixture[0]!.id);

    unmount();

    expect(pause).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledTimes(1);
    expect(detachedMedia).not.toHaveAttribute('src');
  });

  it('ignores a stale play() promise that resolves after another message wins playback', async () => {
    let resolveFirstPlay: (() => void) | undefined;
    vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            resolveFirstPlay = resolve;
          })
      )
      .mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<AudioMessages messages={audioFixture} />);

    const firstCard = getCard(audioFixture[0]!.id);
    const secondCard = getCard(audioFixture[1]!.id);
    await user.click(within(firstCard).getByRole('button', { name: /Reproducir mensaje:/ }));
    await waitFor(() => expect(firstCard).toHaveAttribute('data-audio-state', 'loading'));
    expect(resolveFirstPlay).toBeDefined();

    await user.click(within(secondCard).getByRole('button', { name: /Reproducir mensaje:/ }));
    await waitFor(() => expect(secondCard).toHaveAttribute('data-audio-state', 'playing'));
    expect(firstCard).toHaveAttribute('data-audio-state', 'paused');

    resolveFirstPlay!();

    await waitFor(() => expect(secondCard).toHaveAttribute('data-audio-state', 'playing'));
    expect(firstCard).toHaveAttribute('data-audio-state', 'paused');
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
    ).toBeInTheDocument();
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

  it('pauses and fully releases a paused message on removal, then reinserts it into a clean playable state', async () => {
    const { play, pause, load } = mockMediaApi();
    const user = userEvent.setup();
    const { rerender } = render(<AudioMessages messages={audioFixture} />);

    const removedMessage = audioFixture[0]!;
    const card = getCard(removedMessage.id);
    await user.click(within(card).getByRole('button', { name: /Reproducir mensaje:/ }));
    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'playing'));
    await user.click(within(card).getByRole('button', { name: /Pausar mensaje:/ }));
    await waitFor(() => expect(card).toHaveAttribute('data-audio-state', 'paused'));

    const detachedMedia = getMedia(removedMessage.id);
    rerender(<AudioMessages messages={[audioFixture[1]!]} />);

    // Pause semantics: one user pause plus the centralized teardown release
    // pause. Dropping the source and load() release the detached resource.
    expect(pause).toHaveBeenCalledTimes(2);
    expect(screen.queryByTestId(`audio-media-${removedMessage.id}`)).not.toBeInTheDocument();
    expect(document.querySelectorAll('audio')).toHaveLength(0);
    expect(detachedMedia).not.toHaveAttribute('src');
    expect(load).toHaveBeenCalledTimes(1);

    // Refs are effectively gone: clean reinsertion starts from idle with no
    // media node, and playing again mounts a brand-new working element.
    rerender(<AudioMessages messages={audioFixture} />);
    const reinsertedCard = getCard(removedMessage.id);
    expect(reinsertedCard).toHaveAttribute('data-audio-state', 'idle');
    expect(screen.queryByTestId(`audio-media-${removedMessage.id}`)).not.toBeInTheDocument();

    await user.click(within(reinsertedCard).getByRole('button', { name: /Reproducir mensaje:/ }));
    await waitFor(() => expect(reinsertedCard).toHaveAttribute('data-audio-state', 'playing'));
    const freshMedia = getMedia(removedMessage.id);
    expect(freshMedia).not.toBe(detachedMedia);
    expect(freshMedia).toHaveAttribute('src', removedMessage.src);
    expect(play).toHaveBeenCalledTimes(2);
  });

  it('releases an errored message on removal and reinserts it without stale error state', async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValueOnce(new Error('transient decode failure'))
      .mockResolvedValue(undefined);
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    const load = vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
    const user = userEvent.setup();
    const { rerender } = render(<AudioMessages messages={audioFixture} />);

    const removedMessage = audioFixture[0]!;
    await user.click(
      within(getCard(removedMessage.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(removedMessage.id)).toHaveAttribute('data-audio-state', 'error')
    );
    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).not.toHaveBeenCalled();

    const detachedMedia = getMedia(removedMessage.id);
    rerender(<AudioMessages messages={[audioFixture[1]!]} />);

    // Play already failed, so release still pauses, drops the source and
    // calls load() on the detached errored element.
    expect(pause).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId(`audio-media-${removedMessage.id}`)).not.toBeInTheDocument();
    expect(document.querySelectorAll('audio')).toHaveLength(0);
    expect(detachedMedia).not.toHaveAttribute('src');

    rerender(<AudioMessages messages={audioFixture} />);
    const reinsertedCard = getCard(removedMessage.id);
    expect(reinsertedCard).toHaveAttribute('data-audio-state', 'idle');
    expect(within(reinsertedCard).queryByRole('alert')).toBeNull();
    expect(
      within(reinsertedCard).queryByText('Este mensaje no está disponible en este momento.')
    ).not.toBeInTheDocument();
    expect(
      within(reinsertedCard).getByRole('button', { name: /Reproducir mensaje:/ })
    ).toBeEnabled();

    await user.click(within(reinsertedCard).getByRole('button', { name: /Reproducir mensaje:/ }));
    await waitFor(() => expect(reinsertedCard).toHaveAttribute('data-audio-state', 'playing'));
    expect(getMedia(removedMessage.id)).not.toBe(detachedMedia);
    expect(getMedia(removedMessage.id)).toHaveAttribute('src', removedMessage.src);
    expect(play).toHaveBeenCalledTimes(2);
  });

  it('keeps a same-id media replacement valid across later renders after a same-id removal cycle', async () => {
    const { play, pause, load } = mockMediaApi();
    const user = userEvent.setup();
    const { rerender } = render(<AudioMessages messages={audioFixture} />);

    const replacedMessage = audioFixture[0]!;
    const otherMessage = audioFixture[1]!;

    await user.click(
      within(getCard(replacedMessage.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(replacedMessage.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    const detachedMedia = getMedia(replacedMessage.id);
    expect(detachedMedia).toHaveAttribute('src', replacedMessage.src);

    // Same-id removal: the detached element must be fully released.
    rerender(<AudioMessages messages={[otherMessage]} />);
    expect(screen.queryByTestId(`audio-media-${replacedMessage.id}`)).not.toBeInTheDocument();
    expect(detachedMedia).not.toHaveAttribute('src');
    expect(load).toHaveBeenCalledTimes(1);

    // Replacement element for the same id becomes active.
    rerender(<AudioMessages messages={audioFixture} />);
    await user.click(
      within(getCard(replacedMessage.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(replacedMessage.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    const replacementMedia = getMedia(replacedMessage.id);
    expect(replacementMedia).not.toBe(detachedMedia);
    expect(replacementMedia).toHaveAttribute('src', replacedMessage.src);
    const pauseCallsBeforeRerender = pause.mock.calls.length;
    const loadCallsBeforeRerender = load.mock.calls.length;

    // A later benign rerender must reuse the stable ref callback for the id:
    // no detach cascade, no second release of the live replacement.
    rerender(<AudioMessages messages={[...audioFixture]} />);

    expect(screen.queryByTestId(`audio-media-${replacedMessage.id}`)).toBe(replacementMedia);
    expect(replacementMedia).toHaveAttribute('src', replacedMessage.src);
    expect(getCard(replacedMessage.id)).toHaveAttribute('data-audio-state', 'playing');
    expect(pause).toHaveBeenCalledTimes(pauseCallsBeforeRerender);
    expect(load).toHaveBeenCalledTimes(loadCallsBeforeRerender);
    expect(play).toHaveBeenCalledTimes(2);
  });

  it('keeps teardown event-safe when pause and load dispatch synchronous media events', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => Promise.resolve());
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, 'pause')
      .mockImplementation(function dispatchPauseEvent(this: HTMLMediaElement) {
        this.dispatchEvent(new Event('pause'));
      });
    const load = vi
      .spyOn(HTMLMediaElement.prototype, 'load')
      .mockImplementation(function dispatchErrorEvent(this: HTMLMediaElement) {
        this.dispatchEvent(new Event('error'));
      });
    const user = userEvent.setup();
    const { rerender, unmount } = render(<AudioMessages messages={audioFixture} />);

    const firstMessage = audioFixture[0]!;
    await user.click(
      within(getCard(firstMessage.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(firstMessage.id)).toHaveAttribute('data-audio-state', 'playing')
    );

    // Ref-null leg: the centralized pause → remove src → load release can
    // dispatch pause and error media events synchronously while the component
    // is still mounted. The id must land on a coherent idle state, never on
    // stale paused/error left behind by those events.
    rerender(<AudioMessages messages={[audioFixture[1]!]} />);
    expect(screen.queryByTestId(`audio-media-${firstMessage.id}`)).not.toBeInTheDocument();
    expect(pause).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledTimes(1);

    rerender(<AudioMessages messages={audioFixture} />);
    const reinsertedCard = getCard(firstMessage.id);
    expect(reinsertedCard).toHaveAttribute('data-audio-state', 'idle');
    expect(within(reinsertedCard).queryByRole('alert')).toBeNull();
    expect(
      within(reinsertedCard).queryByText('Este mensaje no está disponible en este momento.')
    ).not.toBeInTheDocument();

    // Unmount leg: the same synchronous events during final teardown must not
    // throw, must not warn, and must not schedule state updates after the
    // component is gone.
    await user.click(
      within(getCard(firstMessage.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(firstMessage.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    expect(() => unmount()).not.toThrow();
    expect(pause).toHaveBeenCalledTimes(2);
    expect(load).toHaveBeenCalledTimes(2);
    expect(play).toHaveBeenCalledTimes(2);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('replaces the media element in place when the same message id changes src and releases only the old element', async () => {
    const { play, pause, load } = mockMediaApi();
    const pauseTargets: HTMLMediaElement[] = [];
    const loadTargets: HTMLMediaElement[] = [];
    const playTargets: HTMLMediaElement[] = [];
    const sourcesAtLoad: Array<string | null> = [];
    const releaseOrder: string[] = [];

    // Direct per-element observation: the mocks record WHICH element they ran
    // on and, for load(), the src still present at call time, so the canonical
    // release of the OLD element (pause → src dropped → load) is provable
    // per-target, not just by call counts.
    pause.mockImplementation(function recordPauseTarget(this: HTMLMediaElement) {
      releaseOrder.push('pause');
      pauseTargets.push(this);
    });
    load.mockImplementation(function recordLoadTarget(this: HTMLMediaElement) {
      releaseOrder.push('load');
      sourcesAtLoad.push(this.getAttribute('src'));
      loadTargets.push(this);
    });
    play.mockImplementation(function recordPlayTarget(this: HTMLMediaElement) {
      playTargets.push(this);
      return Promise.resolve();
    });

    const user = userEvent.setup();
    const message = audioFixture[0]!;
    // Same message id, new authored src: a minimal valid product scenario
    // (an edited/re-uploaded recording for an existing message). The lazy
    // <audio> is keyed by the authored src, so only the media node is
    // replaced while the message and its article stay mounted.
    const replacementMessage = { ...message, src: '/audio/test/message-01-updated.mp3' };
    const { rerender } = render(<AudioMessages messages={[message]} />);

    // Lazy contract is untouched: no media node exists before any play.
    expect(document.querySelectorAll('audio')).toHaveLength(0);

    await user.click(
      within(getCard(message.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() => expect(getCard(message.id)).toHaveAttribute('data-audio-state', 'playing'));
    const originalMedia = getMedia(message.id);
    expect(originalMedia).toHaveAttribute('src', message.src);

    rerender(<AudioMessages messages={[replacementMessage]} />);

    const replacementMedia = getMedia(message.id);
    expect(replacementMedia).not.toBe(originalMedia);
    expect(originalMedia.isConnected).toBe(false);
    expect(replacementMedia.isConnected).toBe(true);
    expect(screen.getByTestId(`audio-message-${message.id}`)).toBeInTheDocument();
    expect(pauseTargets).toEqual([originalMedia]);
    expect(releaseOrder).toEqual(['pause', 'load']);
    expect(sourcesAtLoad).toEqual([null]);
    expect(loadTargets).toEqual([originalMedia]);
    expect(originalMedia).not.toHaveAttribute('src');
    // The replacement is lazy too: attached but still has no source and no
    // playback attempt until the user asks for it again.
    expect(replacementMedia).not.toHaveAttribute('src');
    expect(replacementMedia).toHaveAttribute('preload', 'none');
    expect(playTargets).toEqual([originalMedia]);
    expect(getCard(message.id)).toHaveAttribute('data-audio-state', 'idle');

    // The replacement survives attachment and plays with the new source.
    await user.click(
      within(getCard(message.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() => expect(getCard(message.id)).toHaveAttribute('data-audio-state', 'playing'));
    expect(getMedia(message.id)).toBe(replacementMedia);
    expect(replacementMedia).toHaveAttribute('src', replacementMessage.src);
    expect(playTargets).toEqual([originalMedia, replacementMedia]);

    // A later benign rerender (same content, fresh array identity, stable
    // cached ref callback) must not detach or release the live replacement.
    const pauseCallsBeforeRerender = pauseTargets.length;
    const loadCallsBeforeRerender = loadTargets.length;
    rerender(<AudioMessages messages={[{ ...replacementMessage }]} />);

    expect(getMedia(message.id)).toBe(replacementMedia);
    expect(replacementMedia).toHaveAttribute('src', replacementMessage.src);
    expect(getCard(message.id)).toHaveAttribute('data-audio-state', 'playing');
    expect(pauseTargets).toHaveLength(pauseCallsBeforeRerender);
    expect(loadTargets).toHaveLength(loadCallsBeforeRerender);
  });

  it('absorbs synchronous pause and error events dispatched during final unmount teardown without state updates', async () => {
    const diagnostics: string[] = [];
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      diagnostics.push(`console.error: ${args.join(' ')}`);
    });
    vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
      diagnostics.push(`console.warn: ${args.join(' ')}`);
    });
    const mediaEventDispatches: string[] = [];
    const sourcesAtLoad: Array<string | null> = [];
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, 'pause')
      .mockImplementation(function dispatchPauseEventSync(this: HTMLMediaElement) {
        // Synchronous media event, dispatched while the unmount commit is
        // still tearing the element down: the component's pause handler can
        // only observe a live guard, so this event must be absorbed.
        mediaEventDispatches.push('pause-event');
        this.dispatchEvent(new Event('pause'));
      });
    const load = vi
      .spyOn(HTMLMediaElement.prototype, 'load')
      .mockImplementation(function dispatchErrorEventSync(this: HTMLMediaElement) {
        mediaEventDispatches.push('error-event');
        sourcesAtLoad.push(this.getAttribute('src'));
        this.dispatchEvent(new Event('error'));
      });
    const user = userEvent.setup();
    const { unmount } = render(<AudioMessages messages={audioFixture} />);

    const firstMessage = audioFixture[0]!;
    await user.click(
      within(getCard(firstMessage.id)).getByRole('button', { name: /Reproducir mensaje:/ })
    );
    await waitFor(() =>
      expect(getCard(firstMessage.id)).toHaveAttribute('data-audio-state', 'playing')
    );
    const mountedMedia = getMedia(firstMessage.id);

    unmount();

    // Canonical centralized release ran synchronously inside the unmount
    // commit: pause first, source already gone by the time load() runs.
    expect(pause).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledTimes(1);
    expect(sourcesAtLoad).toEqual([null]);
    expect(mediaEventDispatches).toEqual(['pause-event', 'error-event']);
    expect(mountedMedia.isConnected).toBe(false);
    expect(document.querySelectorAll('audio')).toHaveLength(0);
    // No update/warning trace: the teardown ran with the guard already
    // false, so the synchronous events could not reach a state-update path.
    expect(diagnostics).toEqual([]);
  });
});
