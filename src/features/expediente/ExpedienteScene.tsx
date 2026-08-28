import { useState } from 'react';
import type { Profile } from '../../domain/schemas/profile.schema';

export interface ExpedienteSceneCopy {
  readonly eyebrow: string;
  readonly heading: string;
  readonly intro: string;
  readonly completionLabel: string;
  readonly completionAriaLabelPrefix: string;
  readonly portraitAltPrefix: string;
  readonly portraitFallbackAriaLabelPrefix: string;
  readonly portraitUnavailableLabel: string;
  readonly portraitCaptionPrefix: string;
  readonly identityLabel: string;
  readonly identityDescription: string;
  readonly firstNameLabel: string;
  readonly fullNameLabel: string;
  readonly startYearLabel: string;
  readonly graduationYearLabel: string;
  readonly statusLabel: string;
  readonly diagnosisLabel: string;
  readonly prognosisLabel: string;
  readonly footer: string;
  readonly ctaLabel: string;
}

export interface ExpedienteSceneProps {
  profile: Profile;
  copy: ExpedienteSceneCopy;
  nextHref: string;
}

const COMPLETION_PERCENTAGE = 100;

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

export function ExpedienteScene({ profile, copy, nextHref }: ExpedienteSceneProps) {
  const [portraitFailed, setPortraitFailed] = useState(false);
  const portraitAlt = `${copy.portraitAltPrefix} ${profile.fullName}`;

  return (
    <article
      aria-labelledby="expediente-heading"
      data-testid="expediente-scene"
      className="w-full min-w-0 overflow-hidden rounded-md border border-border-default bg-surface-raised shadow-raised"
    >
      <header className="border-b border-border-subtle p-4 sm:p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-primary">
              {copy.eyebrow}
            </p>
            <h2
              id="expediente-heading"
              className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl"
            >
              {copy.heading}
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-text-secondary">{copy.intro}</p>
          </div>

          <div
            aria-label={`${copy.completionAriaLabelPrefix}: ${COMPLETION_PERCENTAGE}%`}
            data-completion="100"
            className="shrink-0 border-l-2 border-accent-primary bg-surface-subtle px-3 py-2"
          >
            <span className="block font-mono text-[0.6875rem] uppercase tracking-wide text-text-muted">
              {copy.completionLabel}
            </span>
            <data
              value={COMPLETION_PERCENTAGE}
              className="mt-1 block font-mono text-2xl font-bold leading-none text-accent-primary"
            >
              {COMPLETION_PERCENTAGE}%
            </data>
          </div>
        </div>
      </header>

      <div className="grid min-w-0 gap-8 p-4 sm:p-6 md:grid-cols-5 md:p-8">
        <figure data-profile-field="portrait" className="min-w-0 space-y-3 md:col-span-2">
          <div className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-md border border-border-strong bg-surface-subtle shadow-subtle">
            {portraitFailed ? (
              <div
                role="img"
                aria-label={`${copy.portraitFallbackAriaLabelPrefix} ${profile.fullName}`}
                className="flex h-full w-full flex-col items-center justify-center gap-2 bg-accent-muted text-accent-primary"
              >
                <span aria-hidden="true" className="font-display text-6xl font-bold">
                  {getInitials(profile.fullName)}
                </span>
                <span className="font-mono text-xs uppercase tracking-wide text-text-secondary">
                  {copy.portraitUnavailableLabel}
                </span>
              </div>
            ) : (
              <img
                src={profile.portrait}
                alt={portraitAlt}
                width={320}
                height={400}
                loading="lazy"
                onError={() => setPortraitFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <figcaption className="font-mono text-xs leading-relaxed text-text-muted">
            {copy.portraitCaptionPrefix} {profile.firstName}
          </figcaption>
        </figure>

        <div className="min-w-0 md:col-span-3">
          <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
            {copy.identityLabel}
          </p>
          <h3 className="mt-2 break-words font-display text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
            {profile.fullName}
          </h3>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-text-secondary">
            {copy.identityDescription}
          </p>

          <dl className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2">
            <div className="min-w-0 border-l-2 border-border-accent bg-surface-subtle px-3 py-3">
              <dt className="font-mono text-xs uppercase tracking-wide text-text-muted">
                {copy.firstNameLabel}
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold text-text-primary">
                {profile.firstName}
              </dd>
            </div>
            <div className="min-w-0 border-l-2 border-border-accent bg-surface-subtle px-3 py-3">
              <dt className="font-mono text-xs uppercase tracking-wide text-text-muted">
                {copy.fullNameLabel}
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold text-text-primary">
                {profile.fullName}
              </dd>
            </div>
            <div className="min-w-0 border-l-2 border-border-accent bg-surface-subtle px-3 py-3">
              <dt className="font-mono text-xs uppercase tracking-wide text-text-muted">
                {copy.startYearLabel}
              </dt>
              <dd className="mt-1 font-mono text-lg font-bold text-text-primary">
                {profile.startYear}
              </dd>
            </div>
            <div className="min-w-0 border-l-2 border-border-accent bg-surface-subtle px-3 py-3">
              <dt className="font-mono text-xs uppercase tracking-wide text-text-muted">
                {copy.graduationYearLabel}
              </dt>
              <dd className="mt-1 font-mono text-lg font-bold text-text-primary">
                {profile.graduationYear}
              </dd>
            </div>
            <div className="min-w-0 border-l-2 border-border-accent bg-surface-subtle px-3 py-3 sm:col-span-2">
              <dt className="font-mono text-xs uppercase tracking-wide text-text-muted">
                {copy.statusLabel}
              </dt>
              <dd className="mt-1 break-words text-sm font-bold uppercase text-status-success">
                {profile.status}
              </dd>
            </div>
            <div className="min-w-0 border-l-2 border-border-accent bg-surface-subtle px-3 py-3">
              <dt className="font-mono text-xs uppercase tracking-wide text-text-muted">
                {copy.diagnosisLabel}
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold text-text-primary">
                {profile.diagnosis}
              </dd>
            </div>
            <div className="min-w-0 border-l-2 border-border-accent bg-surface-subtle px-3 py-3">
              <dt className="font-mono text-xs uppercase tracking-wide text-text-muted">
                {copy.prognosisLabel}
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold text-text-primary">
                {profile.prognosis}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="flex flex-col gap-4 border-t border-border-subtle p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 md:p-8">
        <p className="max-w-prose text-sm leading-relaxed text-text-secondary">{copy.footer}</p>
        <a
          href={nextHref}
          className="inline-flex min-h-touch min-w-touch max-w-full shrink-0 items-center justify-center gap-2 rounded-sm border border-accent-primary bg-accent-primary px-4 py-2 text-center font-ui text-sm font-semibold text-accent-primary-fg no-underline transition-[background-color,border-color,color,box-shadow] duration-fast ease-clinical hover:bg-accent-primary-hover active:bg-accent-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised"
        >
          <span>{copy.ctaLabel}</span>
          <span aria-hidden="true">→</span>
        </a>
      </footer>
    </article>
  );
}
