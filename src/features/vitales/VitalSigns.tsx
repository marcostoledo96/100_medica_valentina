import { useId } from 'react';
import type { Stat } from '../../domain/schemas/stats.schema';
import { StatCard } from './StatCard';
import { statPresentation } from './statPresentation';
export interface VitalSignsProps {
  stats: readonly Stat[];
  heading?: string;
  className?: string;
}
export function VitalSigns({
  stats,
  heading = statPresentation.defaultHeading,
  className = '',
}: VitalSignsProps) {
  const headingId = useId();
  return (
    <div
      aria-labelledby={headingId}
      className={`w-full max-w-4xl ${className}`}
      data-testid="vital-signs"
    >
      <h2
        className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl"
        id={headingId}
      >
        {heading}
      </h2>
      <ul className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {stats.map((stat) => (
          <li key={stat.id} className="min-w-0">
            <StatCard stat={stat} />
          </li>
        ))}
      </ul>
    </div>
  );
}
