import { useCallback, useEffect, useId, useRef, useState } from 'react';
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

  // Media elements are created lazily, only after an explicit play action, so
  // the document starts with zero <audio> nodes. Whenever one goes away its
  // playback is stopped, its source is dropped, and no reference is retained.
  const releaseAudioElement = useCallback((id: string) => {
    const element = audioRefs.current.get(id);
    if (element) {
      element.pause();
      element.removeAttribute('src');

      if (activeAudioIdRef.current === id) {
        activeAudioIdRef.current = null;
        playRequestRef.current += 1;
      }
    }

    audioRefs.current.delete(id);
    audioRefCallbacks.current.delete(id);
  }, []);

  const assignAudioRef = useCallback(
    (id: string, element: HTMLAudioElement | null) => {
      if (element === null) {
        releaseAudioElement(id);
        return;
      }

      audioRefs.current.set(id, element);
    },
    [releaseAudioElement]
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
  useEffect(() => {
    const activeIds = new Set(messages.map((message) => message.id));
    const pending = pendingPlayRef.current;
    const hasStalePending = pending !== null && !activeIds.has(pending.message.id);

    for (const id of Array.from(audioRefs.current.keys())) {
      if (!activeIds.has(id)) {
        releaseAudioElement(id);
      }
    }

    if (hasStalePending) {
      clearPendingPlayback();
    }

    // Playback state for removed ids is cleared as part of the same
    // lifecycle cleanup, so re-adding the same id cannot render or act on
    // stale paused/error/playing state. Queued after the stale pending
    // clear above so that clear cannot re-add an entry for a removed id.
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
  }, [messages, releaseAudioElement, clearPendingPlayback]);

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
      if (activeAudioIdRef.current === id) {
        activeAudioIdRef.current = null;
        playRequestRef.current += 1;
      }

      updatePlaybackState(id, 'error');
    },
    [updatePlaybackState]
  );

  useEffect(() => {
    isMountedRef.current = true;
    const mountedAudioRefs = audioRefs.current;
    const mountedAudioRefCallbacks = audioRefCallbacks.current;

    return () => {
      isMountedRef.current = false;
      playRequestRef.current += 1;

      for (const element of Array.from(mountedAudioRefs.values())) {
        element.pause();
      }

      activeAudioIdRef.current = null;
      pendingPlayRef.current = null;
      mountedAudioRefs.clear();
      mountedAudioRefCallbacks.clear();
    };
  }, []);

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
                      aria-pressed={state === 'playing'}
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
                      aria-live="polite"
                    >
                      {getStatusLabel(state, resolvedCopy)}
                    </p>
                  </div>

                  {mountedMediaIds.has(message.id) ? (
                    <audio
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
