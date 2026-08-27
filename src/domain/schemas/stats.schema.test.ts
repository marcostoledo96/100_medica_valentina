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

  describe('StatSchema', () => {
    it('accepts numeric and string stat values', () => {
      expect(StatSchema.parse(validNumericStat).value).toBe(1200);
      expect(StatSchema.parse(validStringStat).value).toBe('99.9%');
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
