import { useId } from 'react';
import type { Stat } from '../../domain/schemas/stats.schema';
import { getVisibleStatValue, resolveNumericProgress, statPresentation } from './statPresentation';
export interface StatCardProps {
  stat: Stat;
}
export function StatCard({ stat }: StatCardProps) {
  const labelId = useId();
  const format = statPresentation.formats[stat.format];
  const progress = resolveNumericProgress(stat);
  return (
    <article
      aria-labelledby={labelId}
      className="w-full min-w-0 overflow-hidden rounded-lg border border-border-default bg-surface-raised p-5 shadow-raised sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
        <span className={`rounded-full border px-2 py-1 ${format.badgeClassName}`}>
          {format.label}
        </span>
        {stat.humorous ? (
          <span className="rounded-full border border-status-warning bg-status-warning px-2 py-1 text-status-warning-fg">
            {statPresentation.humorDisclosure}
          </span>
        ) : null}
      </div>
      <h3
        id={labelId}
        className="mt-5 break-words font-display text-2xl font-bold leading-tight text-text-primary"
      >
        {stat.label}
      </h3>
      <p
        className={`mt-4 min-w-0 break-words font-mono text-3xl font-bold tabular-nums ${format.valueClassName}`}
      >
        {getVisibleStatValue(stat)}
      </p>
      {progress ? (
        <div className="mt-4 w-full min-w-0 overflow-hidden rounded-full bg-surface-sunken">
          <div
            role="progressbar"
            aria-labelledby={labelId}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress.value}
            className="h-2 max-w-full rounded-full bg-accent-primary"
            style={{ width: progress.width }}
          />
        </div>
      ) : null}
      {stat.note ? (
        <p className="mt-4 break-words font-ui text-sm leading-relaxed text-text-secondary">
          {stat.note}
        </p>
      ) : null}
    </article>
  );
}
