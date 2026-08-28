import { useState } from 'react';
import type { Finale } from '../../domain/schemas/finale.schema';
import type { Profile } from '../../domain/schemas/profile.schema';
import './FinaleScene.css';

const DIAGNOSIS_LABEL = 'Diagnóstico definitivo';
const RETURN_LABEL = 'Volver al comienzo';
const IMAGE_FALLBACK_LABEL = 'Imagen no disponible';

/** Internal provenance classification for displayed fixture content (not user-facing copy). */
export type ContentProvenance = 'provisional' | 'placeholder';

export interface FinaleSceneProps {
  readonly content: Finale;
  readonly profile: Profile;
  readonly provenance?: ContentProvenance;
}

export interface DiagnosisRevealProps {
  readonly diagnosis: string;
  readonly provenance?: ContentProvenance;
}

const eyebrowClasses =
  'm-0 font-mono text-[0.6875rem] font-bold uppercase leading-snug tracking-[0.16em]';

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}

export function DiagnosisReveal({ diagnosis, provenance = 'provisional' }: DiagnosisRevealProps) {
  return (
    <div
      data-finale-stage="diagnosis"
      data-content-status={provenance}
      className="finale-scene__reveal grid min-h-[min(54vh,28rem)] content-center justify-items-start gap-3.5 border-y border-border-subtle px-[clamp(1rem,5vw,4rem)] py-[clamp(3.5rem,12vw,8rem)]"
    >
      <p className={`${eyebrowClasses} text-accent-primary`}>{DIAGNOSIS_LABEL}</p>
      <h2 className="m-0 max-w-full font-display text-[clamp(3.25rem,15vw,8rem)] font-bold leading-[0.92] tracking-[-0.055em] [overflow-wrap:anywhere]">
        {diagnosis}
      </h2>
    </div>
  );
}

export function FinaleScene({ content, profile, provenance = 'provisional' }: FinaleSceneProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article
      aria-labelledby="finale-heading"
      data-testid="finale-scene"
      data-content-status={provenance}
      className="w-full min-w-0 overflow-hidden bg-surface-base text-text-primary"
    >
      <DiagnosisReveal diagnosis={profile.diagnosis} provenance={provenance} />

      <div
        data-finale-stage="discharge"
        className="finale-scene__reveal motion-safe:[animation-delay:140ms] grid min-w-0 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      >
        <div className="relative aspect-[4/3] min-w-0 overflow-hidden bg-surface-sunken">
          {imageFailed ? (
            <div
              role="img"
              aria-label={content.imageAlt}
              data-testid="finale-image-fallback"
              data-content-status="placeholder"
              className="grid h-full place-content-center justify-items-center gap-2 bg-surface-subtle p-6 text-center font-mono text-xs tracking-wider text-text-secondary"
            >
              <span
                aria-hidden="true"
                className="grid size-14 place-items-center rounded-full border border-border-accent font-display text-[2rem] leading-none text-accent-primary"
              >
                ◇
              </span>
              <span>{IMAGE_FALLBACK_LABEL}</span>
              <span
                aria-hidden="true"
                className="text-[0.6875rem] font-bold tracking-[0.14em] text-text-muted"
              >
                {getInitials(profile.fullName)}
              </span>
            </div>
          ) : (
            <img
              src={content.image}
              alt={content.imageAlt}
              width="1200"
              height="900"
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          )}
        </div>

        <div className="flex min-w-0 flex-col items-start justify-center gap-4 bg-surface-raised px-[clamp(1rem,5vw,4rem)] py-[clamp(2rem,5vw,5rem)]">
          <p className={`${eyebrowClasses} text-accent-secondary [overflow-wrap:anywhere]`}>
            {profile.status}
          </p>
          <h2
            id="finale-heading"
            className="m-0 max-w-[13ch] font-display text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-[0.96] tracking-[-0.045em] [overflow-wrap:anywhere]"
          >
            {content.headline}
          </h2>
          <p className="m-0 font-ui text-[clamp(1rem,2vw,1.25rem)] font-semibold leading-normal text-text-secondary [overflow-wrap:anywhere]">
            {profile.fullName}
          </p>

          <div className="grid max-w-[34rem] gap-3 font-ui text-[0.95rem] leading-[1.65] text-text-secondary [&_p]:m-0">
            {content.message.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <time dateTime={content.date} className={`${eyebrowClasses} text-text-muted`}>
            {content.date}
          </time>

          <a
            href="#inicio"
            className="inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-sm border border-accent-primary bg-accent-primary px-4 py-2 font-ui text-sm font-bold text-accent-primary-fg shadow-subtle transition-colors duration-fast ease-standard hover:border-accent-primary-hover hover:bg-accent-primary-hover motion-reduce:transition-none"
          >
            {RETURN_LABEL}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
