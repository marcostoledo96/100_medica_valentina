import type { TimelineEntry } from '../../domain/schemas/timeline.schema';
import { formatTimelineDate, timelinePresentation } from './timelinePresentation';

export interface TimelineEntryCardProps {
  entry: TimelineEntry;
}

export function TimelineEntryCard({ entry }: TimelineEntryCardProps) {
  const titleId = `timeline-entry-${entry.id}-title`;
  const category = timelinePresentation.categories[entry.category];

  return (
    <article
      id={`timeline-entry-${entry.id}`}
      aria-labelledby={titleId}
      data-timeline-entry={entry.id}
      className="overflow-hidden rounded-lg border border-border-default bg-surface-raised shadow-raised transition-colors duration-normal"
    >
      {entry.image ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-surface-subtle sm:aspect-[16/9]">
          <img
            className="h-full w-full object-cover"
            src={entry.image}
            alt={entry.imageAlt ?? `Imagen de ${entry.title}`}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
          <time dateTime={entry.date}>{formatTimelineDate(entry.date)}</time>
          <span aria-hidden="true" className="text-text-muted">
            /
          </span>
          <span className={`rounded-full border px-2 py-1 ${category.badgeClassName}`}>
            {category.label}
          </span>
        </div>

        <div className="space-y-2">
          <h3
            id={titleId}
            className="font-display text-2xl font-bold leading-tight text-text-primary"
          >
            {entry.title}
          </h3>
          <p className="font-ui text-base leading-relaxed text-text-secondary">
            {entry.description}
          </p>
        </div>

        {entry.quote ? (
          <blockquote className="border-s-2 border-border-accent bg-surface-overlay px-4 py-3 text-text-primary">
            <p className="font-display text-lg italic leading-relaxed">“{entry.quote}”</p>
          </blockquote>
        ) : null}
      </div>
    </article>
  );
}
