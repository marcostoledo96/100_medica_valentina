import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { AudioMessage } from '../../domain/types';
import './AudioMessages.css';

type AudioPlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

interface PendingPlayback {
  readonly message: AudioMessage;
  readonly requestId: number;
}

export interface AudioMessagesCopy {
  readonly eyebrow: string;
  readonly heading: string;
  readonly intro: string;
  readonly listLabel: string;
  readonly empty: string;
  readonly play: string;
  readonly pause: string;
  readonly retry: string;
  readonly ready: string;
  readonly loading: string;
  readonly playing: string;
  readonly paused: string;
  readonly error: string;
  readonly duration: string;
}

const DEFAULT_COPY: AudioMessagesCopy = {
  eyebrow: 'Mensajes de audio',
  heading: 'Voces que acompañan',
  intro: 'Escuchá algunos mensajes cuando tengas un momento para recibirlos.',
  listLabel: 'Mensajes de audio disponibles',
  empty: 'Todavía no hay mensajes de audio disponibles.',
  play: 'Reproducir mensaje',
  pause: 'Pausar mensaje',
  retry: 'Reintentar mensaje',
  ready: 'Listo para reproducir',
  loading: 'Cargando audio…',
  playing: 'Reproduciendo',
  paused: 'En pausa',
  error: 'Este mensaje no está disponible en este momento.',
  duration: 'Duración',
};

export interface AudioMessagesProps {
  readonly messages: readonly AudioMessage[];
  readonly copy?: Partial<AudioMessagesCopy>;
  readonly className?: string;
}

function formatDuration(duration: number): string {
  const totalSeconds = Math.round(duration);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formattedMinutes = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes);
  const formattedSeconds = String(seconds).padStart(2, '0');

  return hours > 0
    ? `${hours}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`;
}

function getMessageLabel(message: AudioMessage): string {
  return message.title ? `${message.title} — ${message.author}` : message.author;
}

// Stops playback and fully releases a media element's resource: the source is
// dropped and load() resets the element so the browser can free the fetched
// media. Used whenever an element leaves the component.
function releaseMediaResource(audio: HTMLMediaElement): void {
  audio.pause();
  audio.removeAttribute('src');
  audio.load();
}

// Re-arms a failed media element for a fresh resource-selection attempt.
// After a playback failure the browser has already run (and lost) resource
// selection for the current src, so play() alone keeps replaying the failed
// element state; load() re-runs selection from scratch. This runs only inside
// the user's retry action (never before interaction), so any resource fetch
// the browser performs is user-initiated by definition.
function resetFailedMediaResource(audio: HTMLMediaElement, src: string): void {
  if (!audio.paused) {
    audio.pause();
  }

  if (audio.getAttribute('src') !== src) {
    audio.setAttribute('src', src);
  }

  audio.load();
}

function getStatusLabel(state: AudioPlaybackState, copy: AudioMessagesCopy): string {
  switch (state) {
    case 'idle':
      return copy.ready;
    case 'loading':
      return copy.loading;
    case 'playing':
      return copy.playing;
    case 'paused':
      return copy.paused;
    case 'error':
      return copy.error;
  }
}

export function AudioMessages({ messages, copy, className = '' }: AudioMessagesProps) {
  const headingId = useId();
  const audioRefs = useRef(new Map<string, HTMLAudioElement>());
  const audioRefCallbacks = useRef(new Map<string, (element: HTMLAudioElement | null) => void>());
  const activeAudioIdRef = useRef<string | null>(null);
  const pendingPlayRef = useRef<PendingPlayback | null>(null);
  const playRequestRef = useRef(0);
  const isMountedRef = useRef(true);
  const [mountedMediaIds, setMountedMediaIds] = useState<ReadonlySet<string>>(() => new Set());
  const [pendingPlay, setPendingPlay] = useState<PendingPlayback | null>(null);
  const [playbackStates, setPlaybackStates] = useState<Record<string, AudioPlaybackState>>({});
  const resolvedCopy = { ...DEFAULT_COPY, ...copy };

  const updatePlaybackState = useCallback((id: string, state: AudioPlaybackState) => {
    setPlaybackStates((currentStates) => {
      if (currentStates[id] === state) {
        return currentStates;
      }

      return { ...currentStates, [id]: state };
    });
  }, []);

  const clearPendingPlayback = useCallback(() => {
    const pending = pendingPlayRef.current;
    if (pending === null) {
      return;
    }

    pendingPlayRef.current = null;
    setPendingPlay(null);
    updatePlaybackState(pending.message.id, 'idle');
  }, [updatePlaybackState]);

  // Single teardown path for any media element leaving the component:
  // message removal, same-id remove/reinsert, ref replacement to null, and
  // unmount. It first invalidates pending and active playback for the id (so
  // stale async completions are ignored), then pauses, drops the source, and
  // calls load() to release the resource.
  //
  // The cached ref callback for the id is intentionally kept: React may
  // reattach a replacement element for the same id right after a transient
  // null (ref swap or the dev-mode remount cycle), and dropping the cache
  // entry here would make the next render mint a new callback whose old-ref
  // detach would then release the live replacement element. Entries are
  // deleted only when the id truly leaves the collection (messages effect)
  // or at final unmount.
  //
  // The coherent idle reset runs last so synchronous media events dispatched
  // by pause()/load() during the release — while this teardown is still
  // inside the component's commit — cannot leave paused/error state behind.
  const teardownAudioElement = useCallback(
    (id: string) => {
      const pending = pendingPlayRef.current;
      if (pending !== null && pending.message.id === id) {
        pendingPlayRef.current = null;
        if (isMountedRef.current) {
          setPendingPlay(null);
        }
      }

      if (activeAudioIdRef.current === id) {
        activeAudioIdRef.current = null;
        playRequestRef.current += 1;
      }

      const element = audioRefs.current.get(id);
      if (element) {
        releaseMediaResource(element);
      }

      audioRefs.current.delete(id);

      if (isMountedRef.current) {
        updatePlaybackState(id, 'idle');
      }
    },
    [updatePlaybackState]
  );

  const assignAudioRef = useCallback(
    (id: string, element: HTMLAudioElement | null) => {
      if (element === null) {
        teardownAudioElement(id);
        return;
      }

      audioRefs.current.set(id, element);
    },
    [teardownAudioElement]
  );

  const getAudioRef = useCallback(
    (id: string) => {
      const existingCallback = audioRefCallbacks.current.get(id);
      if (existingCallback) {
        return existingCallback;
      }

      const callback = (element: HTMLAudioElement | null) => assignAudioRef(id, element);
      audioRefCallbacks.current.set(id, callback);
      return callback;
    },
    [assignAudioRef]
  );

  const startPlayback = useCallback(
    (message: AudioMessage, requestId: number) => {
      const audio = audioRefs.current.get(message.id);
      if (!audio) {
        return;
      }

      if (
        !isMountedRef.current ||
        playRequestRef.current !== requestId ||
        activeAudioIdRef.current !== message.id
      ) {
        return;
      }

      if (audio.getAttribute('src') !== message.src) {
        audio.setAttribute('src', message.src);
      }

      let playResult: Promise<void>;
      try {
        playResult = audio.play();
      } catch {
        if (
          isMountedRef.current &&
          playRequestRef.current === requestId &&
          activeAudioIdRef.current === message.id
        ) {
          activeAudioIdRef.current = null;
          updatePlaybackState(message.id, 'error');
        }
        return;
      }

      void Promise.resolve(playResult)
        .then(() => {
          if (
            isMountedRef.current &&
            playRequestRef.current === requestId &&
            activeAudioIdRef.current === message.id
          ) {
            updatePlaybackState(message.id, 'playing');
          }
        })
        .catch(() => {
          if (
            isMountedRef.current &&
            playRequestRef.current === requestId &&
            activeAudioIdRef.current === message.id
          ) {
            activeAudioIdRef.current = null;
            updatePlaybackState(message.id, 'error');
          }
        });
    },
    [updatePlaybackState]
  );

  // Newly mounted media elements only exist after the commit triggered by the
  // play request, so the actual start happens here once the element is live.
  useEffect(() => {
    if (pendingPlay === null) {
      return;
    }

    const audio = audioRefs.current.get(pendingPlay.message.id);
    if (!audio) {
      return;
    }

    pendingPlayRef.current = null;
    setPendingPlay(null);
    startPlayback(pendingPlay.message, pendingPlay.requestId);
  }, [pendingPlay, startPlayback]);

  // Messages removed from props must not keep playing or retain media,
  // listener, or callback references. React detaches refs before effects, so
  // this also prunes the mounted-ids state for messages that disappeared.
  // Callback cache entries must only be dropped for ids that truly leave the
  // collection: the transient ref-null teardown keeps them cached so a
  // replacement element for the same id reattaches the very same callback
  // instead of churning identities.
  useEffect(() => {
    const activeIds = new Set(messages.map((message) => message.id));

    const pending = pendingPlayRef.current;
    if (pending !== null && !activeIds.has(pending.message.id)) {
      teardownAudioElement(pending.message.id);
      audioRefCallbacks.current.delete(pending.message.id);
    }

    const knownIds = new Set([...audioRefs.current.keys(), ...audioRefCallbacks.current.keys()]);
    for (const id of knownIds) {
      if (!activeIds.has(id)) {
        teardownAudioElement(id);
        audioRefCallbacks.current.delete(id);
      }
    }

    // Playback state for removed ids is cleared as part of the same
    // lifecycle cleanup, so re-adding the same id cannot render or act on
    // stale paused/error/playing state. Queued after the teardowns above so
    // that a teardown cannot re-add an entry for a removed id.
    setPlaybackStates((currentStates) => {
      let changed = false;
      const nextStates: Record<string, AudioPlaybackState> = {};
      for (const [id, state] of Object.entries(currentStates)) {
        if (activeIds.has(id)) {
          nextStates[id] = state;
        } else {
          changed = true;
        }
      }

      return changed ? nextStates : currentStates;
    });

    setMountedMediaIds((currentIds) => {
      const nextIds = new Set([...currentIds].filter((id) => activeIds.has(id)));
      return nextIds.size === currentIds.size ? currentIds : nextIds;
    });
  }, [messages, teardownAudioElement]);

  const handlePlay = useCallback(
    (message: AudioMessage) => {
      const audio = audioRefs.current.get(message.id);
      const currentState = playbackStates[message.id] ?? 'idle';

      if (currentState === 'loading') {
        return;
      }

      if (currentState === 'playing') {
        audio?.pause();
        activeAudioIdRef.current = null;
        playRequestRef.current += 1;
        updatePlaybackState(message.id, 'paused');
        return;
      }

      clearPendingPlayback();

      for (const [otherId, otherAudio] of audioRefs.current) {
        if (otherId === message.id) {
          continue;
        }

        const otherState = playbackStates[otherId] ?? 'idle';
        if (otherState === 'playing' || activeAudioIdRef.current === otherId) {
          otherAudio.pause();
          updatePlaybackState(otherId, 'paused');
        }
      }

      // A failed element (rejected play() or media error) must not be replayed
      // from its broken state: before arming the new request, re-select the
      // resource from scratch. This runs while the state is still "error" and
      // no request is active, so events dispatched by pause()/load() cannot
      // corrupt the retry; the request below invalidates any stale promise from
      // the failed attempt.
      if (currentState === 'error' && audio) {
        resetFailedMediaResource(audio, message.src);
      }

      const requestId = ++playRequestRef.current;
      activeAudioIdRef.current = message.id;
      updatePlaybackState(message.id, 'loading');

      if (audio) {
        startPlayback(message, requestId);
        return;
      }

      const pending: PendingPlayback = { message, requestId };
      pendingPlayRef.current = pending;
      setPendingPlay(pending);
      setMountedMediaIds((currentIds) => {
        if (currentIds.has(message.id)) {
          return currentIds;
        }

        const nextIds = new Set(currentIds);
        nextIds.add(message.id);
        return nextIds;
      });
    },
    [clearPendingPlayback, playbackStates, startPlayback, updatePlaybackState]
  );

  const handleMediaPlay = useCallback(
    (id: string) => {
      if (!isMountedRef.current) {
        return;
      }

      if (activeAudioIdRef.current === id) {
        updatePlaybackState(id, 'playing');
      }
    },
    [updatePlaybackState]
  );

  const handleMediaPause = useCallback((id: string) => {
    if (!isMountedRef.current) {
      return;
    }

    setPlaybackStates((currentStates) => {
      if (currentStates[id] === 'error' || currentStates[id] === 'paused') {
        return currentStates;
      }

      return { ...currentStates, [id]: 'paused' };
    });

    if (activeAudioIdRef.current === id) {
      activeAudioIdRef.current = null;
      playRequestRef.current += 1;
    }
  }, []);

  const handleMediaEnded = useCallback(
    (id: string) => {
      if (!isMountedRef.current) {
        return;
      }

      if (activeAudioIdRef.current === id) {
        activeAudioIdRef.current = null;
        playRequestRef.current += 1;
      }

      updatePlaybackState(id, 'idle');
    },
    [updatePlaybackState]
  );

  const handleMediaError = useCallback(
    (id: string) => {
      if (!isMountedRef.current) {
        return;
      }

      if (activeAudioIdRef.current === id) {
        activeAudioIdRef.current = null;
        playRequestRef.current += 1;
      }

      updatePlaybackState(id, 'error');
    },
    [updatePlaybackState]
  );

  // Unmount-intent record: must flip BEFORE any child media ref detaches so
  // the ref-null teardown and the pause()/load() media events it dispatches
  // synchronously observe the guard as false and skip every state update.
  // This ordering is proven for this tree (react-dom 18.3):
  // commitDeletionEffectsOnFiber runs a deleted function component's OWN
  // layout-effect destroys before traversing into its children, so this
  // cleanup runs before the <audio> ref-null teardowns; a passive useEffect
  // cleanup cannot provide it — its destroys run after the refs detach (the
  // suite pins this contract in 'unmount lifecycle ordering contract').
  useLayoutEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const mountedAudioRefs = audioRefs.current;
    const mountedAudioRefCallbacks = audioRefCallbacks.current;

    return () => {
      isMountedRef.current = false;
      playRequestRef.current += 1;

      // Full resource teardown on unmount: the mounted guard inside the
      // teardown keeps every state update off while each element pauses,
      // drops its source, and calls load() to release the resource. Teardown
      // keeps callback entries by design, so the cached reference callbacks
      // must be cleared here at the final unmount.
      for (const id of Array.from(mountedAudioRefs.keys())) {
        teardownAudioElement(id);
      }

      activeAudioIdRef.current = null;
      pendingPlayRef.current = null;
      mountedAudioRefs.clear();
      mountedAudioRefCallbacks.clear();
    };
  }, [teardownAudioElement]);

  return (
    <div
      aria-labelledby={headingId}
      className={`audio-messages ${className}`.trim()}
      data-testid="audio-messages"
    >
      <header className="audio-messages__header">
        <p className="audio-messages__eyebrow">{resolvedCopy.eyebrow}</p>
        <h2 id={headingId} className="audio-messages__heading">
          {resolvedCopy.heading}
        </h2>
        <p className="audio-messages__intro">{resolvedCopy.intro}</p>
      </header>

      {messages.length === 0 ? (
        <p className="audio-messages__empty" data-audio-empty="true">
          {resolvedCopy.empty}
        </p>
      ) : (
        <ul className="audio-messages__list" aria-label={resolvedCopy.listLabel}>
          {messages.map((message) => {
            const state = playbackStates[message.id] ?? 'idle';
            const messageLabel = getMessageLabel(message);
            const titleId = `audio-message-${message.id}-title`;
            const statusId = `audio-message-${message.id}-status`;
            const buttonLabel =
              state === 'playing'
                ? resolvedCopy.pause
                : state === 'error'
                  ? resolvedCopy.retry
                  : resolvedCopy.play;

            return (
              <li key={message.id} className="audio-messages__item">
                <article
                  aria-label={messageLabel}
                  className="audio-messages__card"
                  data-audio-message={message.id}
                  data-audio-state={state}
                  data-testid={`audio-message-${message.id}`}
                >
                  <div className="audio-messages__metadata">
                    <p className="audio-messages__author">{message.author}</p>
                    {message.title ? (
                      <h3 id={titleId} className="audio-messages__title">
                        {message.title}
                      </h3>
                    ) : null}
                    {message.duration !== undefined ? (
                      <time
                        className="audio-messages__duration"
                        dateTime={`PT${message.duration}S`}
                        aria-label={`${resolvedCopy.duration}: ${formatDuration(message.duration)}`}
                      >
                        {resolvedCopy.duration}: {formatDuration(message.duration)}
                      </time>
                    ) : null}
                  </div>

                  <div className="audio-messages__controls">
                    <button
                      type="button"
                      className="audio-messages__button"
                      aria-label={`${buttonLabel}: ${messageLabel}`}
                      aria-describedby={statusId}
                      aria-busy={state === 'loading'}
                      data-audio-control={message.id}
                      data-testid={`audio-control-${message.id}`}
                      onClick={() => handlePlay(message)}
                    >
                      <span className="audio-messages__button-icon" aria-hidden="true">
                        {state === 'playing' ? '❚❚' : '▶'}
                      </span>
                      <span>{buttonLabel}</span>
                    </button>
                    <p
                      id={statusId}
                      className="audio-messages__status"
                      data-audio-status={message.id}
                      role={state === 'error' ? 'alert' : 'status'}
                      data-testid={`audio-status-${message.id}`}
                    >
                      {getStatusLabel(state, resolvedCopy)}
                    </p>
                  </div>

                  {mountedMediaIds.has(message.id) ? (
                    <audio
                      key={message.src}
                      ref={getAudioRef(message.id)}
                      className="audio-messages__media"
                      aria-hidden="true"
                      preload="none"
                      data-audio-media={message.id}
                      data-testid={`audio-media-${message.id}`}
                      onPlay={() => handleMediaPlay(message.id)}
                      onPause={() => handleMediaPause(message.id)}
                      onEnded={() => handleMediaEnded(message.id)}
                      onError={() => handleMediaError(message.id)}
                    />
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
