import type { Stat, StatFormat } from '../../domain/schemas/stats.schema';

export interface StatFormatPresentation {
  valueClassName: string;
}

export const statPresentation = {
  defaultHeading: 'Signos vitales',
  humorDisclosure: 'Dato en modo parodia',
  formats: {
    number: {
      valueClassName: 'text-accent-primary',
    },
    percentage: {
      valueClassName: 'text-accent-secondary',
    },
    text: {
      valueClassName: 'text-text-primary',
    },
    progress: {
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
  if (stat.format !== 'progress') {
    return null;
  }
  return { value: stat.value, width: `${stat.value}%` };
}

export function getVisibleStatValue(stat: Stat): string {
  return composeValueWithUnit(formatStatValue(stat), stat.unit);
}
