import type { Stat, StatFormat } from '../../domain/schemas/stats.schema';
export interface StatFormatPresentation {
  label: string;
  badgeClassName: string;
  valueClassName: string;
}
export const statPresentation = {
  defaultHeading: 'Signos vitales',
  humorDisclosure: 'Dato en modo parodia',
  formats: {
    number: {
      label: 'Número',
      badgeClassName: 'border-status-info bg-status-info text-status-info-fg',
      valueClassName: 'text-accent-primary',
    },
    percentage: {
      label: 'Porcentaje',
      badgeClassName: 'border-accent-secondary bg-accent-secondary text-accent-secondary-fg',
      valueClassName: 'text-accent-secondary',
    },
    text: {
      label: 'Texto',
      badgeClassName: 'border-accent-primary bg-accent-primary text-accent-primary-fg',
      valueClassName: 'text-text-primary',
    },
    progress: {
      label: 'Progreso',
      badgeClassName: 'border-status-success bg-status-success text-status-success-fg',
      valueClassName: 'text-accent-primary',
    },
  },
} as const satisfies {
  defaultHeading: string;
  humorDisclosure: string;
  formats: Record<StatFormat, StatFormatPresentation>;
};
const numberFormatter = new Intl.NumberFormat('es-AR');
export interface NumericProgress {
  value: number;
  width: `${number}%`;
}
export function formatStatValue(stat: Stat): string {
  return typeof stat.value === 'number' ? numberFormatter.format(stat.value) : stat.value;
}
export function composeValueWithUnit(value: string, unit?: string): string {
  const normalizedUnit = unit?.trim();
  if (!normalizedUnit) {
    return value;
  }
  const valueWithoutTrailingWhitespace = value.replace(/\s+$/, '');
  return valueWithoutTrailingWhitespace.endsWith(normalizedUnit)
    ? valueWithoutTrailingWhitespace
    : `${valueWithoutTrailingWhitespace} ${normalizedUnit}`;
}
export function resolveNumericProgress(stat: Stat): NumericProgress | null {
  if (stat.format !== 'progress' || typeof stat.value !== 'number') {
    return null;
  }
  const value = Math.min(100, Math.max(0, stat.value));
  return { value, width: `${value}%` };
}
export function getVisibleStatValue(stat: Stat): string {
  const progress = resolveNumericProgress(stat);
  const value = progress ? numberFormatter.format(progress.value) : formatStatValue(stat);
  return composeValueWithUnit(value, stat.unit);
}
