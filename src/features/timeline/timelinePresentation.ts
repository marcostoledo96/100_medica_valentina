import type { TimelineCategory } from '../../domain/schemas/timeline.schema';

export const timelinePresentation = {
  categories: {
    academic: {
      label: 'Académico',
      badgeClassName: 'border-status-info bg-status-info text-status-info-fg',
    },
    personal: {
      label: 'Personal',
      badgeClassName: 'border-accent-secondary bg-accent-secondary text-accent-secondary-fg',
    },
    hospital: {
      label: 'Hospital',
      badgeClassName: 'border-status-success bg-status-success text-status-success-fg',
    },
    funny: {
      label: 'Anécdota',
      badgeClassName: 'border-status-warning bg-status-warning text-status-warning-fg',
    },
    milestone: {
      label: 'Hito',
      badgeClassName: 'border-accent-primary bg-accent-primary text-accent-primary-fg',
    },
  },
  months: {
    '01': 'enero',
    '02': 'febrero',
    '03': 'marzo',
    '04': 'abril',
    '05': 'mayo',
    '06': 'junio',
    '07': 'julio',
    '08': 'agosto',
    '09': 'septiembre',
    '10': 'octubre',
    '11': 'noviembre',
    '12': 'diciembre',
  },
} as const satisfies {
  categories: Record<TimelineCategory, { label: string; badgeClassName: string }>;
  months: Record<string, string>;
};

export function formatTimelineDate(date: string): string {
  const [year, month] = date.split('-');
  const monthLabel = month
    ? timelinePresentation.months[month as keyof typeof timelinePresentation.months]
    : undefined;

  if (!year || !monthLabel) {
    return date;
  }

  return `${monthLabel} de ${year}`;
}
