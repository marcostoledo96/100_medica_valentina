import { Button } from '../../../components/ui';
import type { BootContent } from '../../../domain/schemas/boot.schema';
import './BootScene.css';

export type BootSceneMode = 'intro' | 'revisit';

export interface BootSceneProps {
  readonly content: BootContent;
  readonly mode: BootSceneMode;
  readonly nextHref: string;
  readonly onOpen: () => void;
  readonly onSkip: () => void;
  readonly onReplay: () => void;
}

const actionClasses =
  'inline-flex min-h-[48px] min-w-[44px] items-center justify-center rounded-md px-5 py-3 text-center font-ui text-sm font-semibold no-underline transition-[transform,background-color,border-color,color,box-shadow] duration-fast ease-clinical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base active:scale-[0.98]';

export function BootScene({ content, mode, nextHref, onOpen, onSkip, onReplay }: BootSceneProps) {
  const isIntro = mode === 'intro';

  return (
    <div className="w-full max-w-3xl space-y-8" data-boot-scene="true" data-boot-state={mode}>
      <header className="max-w-2xl space-y-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent-secondary">
          {content.eyebrow}
        </p>
        <h1
          id="inicio-heading"
          className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-6xl"
        >
          {content.heading}
        </h1>
        <p className="max-w-xl font-ui text-base leading-relaxed text-text-secondary sm:text-lg">
          {content.intro}
        </p>
      </header>

      <div
        className="boot-scan max-w-xl space-y-2 border-y border-border-default py-3"
        data-testid="boot-scan"
        aria-hidden="true"
      >
        <div
          className="boot-scan__row flex min-h-[44px] items-center gap-3 border-l-2 px-3 font-mono text-xs text-text-secondary sm:text-sm"
          data-boot-stage="search"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent-secondary" />
          <span>{content.scan.search}</span>
        </div>
        <div
          className="boot-scan__row flex min-h-[44px] items-center gap-3 border-l-2 px-3 font-mono text-xs text-text-secondary sm:text-sm"
          data-boot-stage="match"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent-primary" />
          <span>{content.scan.match}</span>
        </div>
        <div
          className="boot-scan__row flex min-h-[44px] items-center gap-3 border-l-2 px-3 font-mono text-xs text-text-secondary sm:text-sm"
          data-boot-stage="ready"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-status-success" />
          <span>{content.scan.ready}</span>
        </div>
      </div>

      <div className="max-w-xl border border-border-default bg-surface-subtle p-4 sm:p-6">
        <dl className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="space-y-1">
            <dt className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
              {content.identity.label}
            </dt>
            <dd className="font-ui text-base font-semibold text-text-primary">
              {content.identity.value}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
              {content.status.label}
            </dt>
            <dd className="font-ui text-base font-semibold text-accent-primary">
              {content.status.value}
            </dd>
          </div>
        </dl>
        <p className="mt-5 border-t border-border-subtle pt-4 font-ui text-xs leading-relaxed text-text-muted">
          {content.demoNotice}
        </p>
      </div>

      {mode === 'revisit' && (
        <p
          className="max-w-xl font-ui text-sm leading-relaxed text-text-secondary"
          data-boot-revisit
        >
          {content.revisitMessage}
        </p>
      )}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <a
          className={`${actionClasses} bg-accent-primary text-accent-primary-fg shadow-subtle hover:bg-accent-primary-hover active:bg-accent-primary-active`}
          href={nextHref}
          onClick={onOpen}
          data-boot-action="open"
        >
          {content.primaryAction}
        </a>
        {isIntro ? (
          <a
            className={`${actionClasses} border border-border-strong bg-transparent text-text-primary hover:bg-surface-subtle active:bg-surface-raised`}
            href={nextHref}
            onClick={onSkip}
            data-boot-action="skip"
          >
            {content.skipAction}
          </a>
        ) : (
          <Button variant="ghost" size="md" onClick={onReplay} data-boot-action="replay">
            {content.replayAction}
          </Button>
        )}
      </div>
    </div>
  );
}
