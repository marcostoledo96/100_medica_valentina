import type { TimelineEntry } from '../../domain/schemas/timeline.schema';
import { TimelineEntryCard } from './TimelineEntryCard';

export interface TimelineProps {
  entries: readonly TimelineEntry[];
  heading?: string;
  className?: string;
}

export function Timeline({ entries, heading = 'Línea de tiempo', className = '' }: TimelineProps) {
  return (
    <div data-testid="timeline" className={`w-full max-w-3xl ${className}`}>
      <h2
        id="timeline-heading"
        className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl"
      >
        {heading}
      </h2>

      <ol
        aria-label="Momentos en orden cronológico"
        className="relative mt-10 ms-2 space-y-8 border-s-2 border-border-accent ps-6 sm:ms-3 sm:space-y-10 sm:ps-8"
      >
        {entries.map((entry) => (
          <li key={entry.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute -start-2 top-6 h-4 w-4 rounded-full border-2 border-accent-primary bg-surface-base ring-4 ring-surface-base"
            />
            <TimelineEntryCard entry={entry} />
          </li>
        ))}
      </ol>
    </div>
  );
}
