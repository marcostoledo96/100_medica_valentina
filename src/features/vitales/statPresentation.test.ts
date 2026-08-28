import { describe, expect, it } from 'vitest';
import type { Stat } from '../../domain/schemas/stats.schema';
import {
  composeValueWithUnit,
  formatStatValue,
  getVisibleStatValue,
  resolveNumericProgress,
  statPresentation,
} from './index';
const numberStat: Stat = { id: 'number', label: 'Horas', value: 1200, format: 'number' };
const stringStat: Stat = {
  id: 'percentage',
  label: 'Cafeína',
  value: '99.9%',
  format: 'percentage',
};
const progressStat: Stat = { id: 'progress', label: 'Avance', value: 100, format: 'progress' };
describe('statPresentation', () => {
  it('exposes all four stat format presentations', () => {
    expect(Object.keys(statPresentation.formats)).toEqual([
      'number',
      'percentage',
      'text',
      'progress',
    ]);
  });
  it('formats localized values, composes units, and resolves progress', () => {
    expect(formatStatValue(numberStat)).toBe('1.200');
    expect(formatStatValue(stringStat)).toBe('99.9%');
    expect(composeValueWithUnit('1.200', 'hs')).toBe('1.200 hs');
    expect(resolveNumericProgress(progressStat)).toEqual({ value: 100, width: '100%' });
  });
  it('handles percentage units, progress boundaries, and string fallbacks', () => {
    const percentage = { ...numberStat, value: 99.9, format: 'percentage' as const, unit: '%' };
    const textProgress: Stat = { ...progressStat, value: 'En observación' };
    expect(getVisibleStatValue(percentage)).toBe('99,9 %');
    expect(resolveNumericProgress({ ...progressStat, value: 250 })).toEqual({
      value: 100,
      width: '100%',
    });
    expect(resolveNumericProgress({ ...progressStat, value: -5 })).toEqual({
      value: 0,
      width: '0%',
    });
    expect(resolveNumericProgress(textProgress)).toBeNull();
    expect(formatStatValue({ ...numberStat, value: 'texto sin cambios', format: 'text' })).toBe(
      'texto sin cambios'
    );
    expect(composeValueWithUnit('99.9%', '%')).toBe('99.9%');
  });
});
