import { describe, expect, it } from 'vitest';
import { StatCollectionSchema, StatSchema } from './stats.schema';

describe('Stats Schemas', () => {
  const validNumericStat = {
    id: 'demo-stat-01',
    label: 'Horas de guardia',
    value: 1200,
    unit: 'hs',
    format: 'number' as const,
    note: 'Nota estadística',
    humorous: false,
  };

  const validStringStat = {
    id: 'demo-stat-02',
    label: 'Nivel de Cafeína',
    value: '99.9%',
    format: 'percentage' as const,
    humorous: true,
  };

  const validProgressStat = {
    id: 'demo-stat-03',
    label: 'Materias aprobadas',
    value: 0,
    format: 'progress' as const,
  };

  describe('StatSchema', () => {
    it('accepts numeric and string stat values for non-progress formats', () => {
      expect(StatSchema.parse(validNumericStat).value).toBe(1200);
      expect(StatSchema.parse({ ...validNumericStat, value: '1200' }).value).toBe('1200');
      expect(StatSchema.parse(validStringStat).value).toBe('99.9%');
      expect(StatSchema.parse({ ...validStringStat, value: 99.9 }).value).toBe(99.9);
      expect(
        StatSchema.parse({
          ...validNumericStat,
          id: 'demo-stat-text',
          value: 'Aprobada',
          format: 'text',
        }).value
      ).toBe('Aprobada');
    });

    it.each([0, 100])('accepts progress value %s', (value) => {
      expect(StatSchema.parse({ ...validProgressStat, value }).value).toBe(value);
    });

    it.each([-1, 101])('rejects progress value %s outside the supported range', (value) => {
      expect(() => StatSchema.parse({ ...validProgressStat, value })).toThrow();
    });

    it('rejects string progress values', () => {
      expect(() => StatSchema.parse({ ...validProgressStat, value: '75' })).toThrow();
    });

    it('rejects invalid format types', () => {
      expect(() =>
        StatSchema.parse({
          ...validNumericStat,
          format: 'invalid-format',
        })
      ).toThrow();
    });

    it('rejects empty string value when value is string', () => {
      expect(() =>
        StatSchema.parse({
          ...validStringStat,
          value: '   ',
        })
      ).toThrow();
    });

    it('rejects whitespace label or note', () => {
      expect(() => StatSchema.parse({ ...validNumericStat, label: '  ' })).toThrow();
      expect(() => StatSchema.parse({ ...validNumericStat, note: '  ' })).toThrow();
    });
  });

  describe('StatCollectionSchema', () => {
    it('accepts valid collection of stats', () => {
      const result = StatCollectionSchema.parse([validNumericStat, validStringStat]);
      expect(result).toHaveLength(2);
    });

    it('rejects empty collection', () => {
      expect(() => StatCollectionSchema.parse([])).toThrow(/at least one stat/);
    });

    it('rejects collection with duplicate stat IDs', () => {
      const duplicate = [validNumericStat, { ...validStringStat, id: 'demo-stat-01' }];
      expect(() => StatCollectionSchema.parse(duplicate)).toThrow(
        /Duplicate stat IDs are not allowed/
      );
    });
  });
});
