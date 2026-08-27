import { describe, expect, it } from 'vitest';
import { TimelineCollectionSchema, TimelineEntrySchema } from './timeline.schema';

describe('Timeline Schemas', () => {
  const validEntry = {
    id: 'demo-stage-01',
    date: '2020-03',
    title: 'Hito Académico Demo 1',
    description: 'Contenido demo pendiente de reemplazo',
    category: 'academic' as const,
    image: '/images/demo/timeline-01.webp',
    quote: 'Frase demo de inicio de cursada',
  };

  describe('TimelineEntrySchema', () => {
    it('accepts a valid entry with optional fields', () => {
      const result = TimelineEntrySchema.parse(validEntry);
      expect(result.id).toBe('demo-stage-01');
      expect(result.category).toBe('academic');
    });

    it('accepts entry without optional image and quote', () => {
      const minimalEntry = {
        id: 'demo-stage-02',
        date: '2021-06',
        title: 'Hito sin imagen',
        description: 'Descripción mínima requerida',
        category: 'milestone' as const,
      };
      const result = TimelineEntrySchema.parse(minimalEntry);
      expect(result.image).toBeUndefined();
      expect(result.quote).toBeUndefined();
    });

    it('rejects invalid category', () => {
      expect(() =>
        TimelineEntrySchema.parse({
          ...validEntry,
          category: 'invalid_category',
        })
      ).toThrow();
    });

    it('rejects empty or whitespace required strings', () => {
      expect(() => TimelineEntrySchema.parse({ ...validEntry, title: '  ' })).toThrow();
      expect(() => TimelineEntrySchema.parse({ ...validEntry, description: '' })).toThrow();
      expect(() => TimelineEntrySchema.parse({ ...validEntry, date: '   ' })).toThrow();
    });

    it('rejects invalid image path when provided', () => {
      expect(() =>
        TimelineEntrySchema.parse({
          ...validEntry,
          image: '/wrong/path.webp',
        })
      ).toThrow();
    });
  });

  describe('TimelineCollectionSchema', () => {
    it('accepts a valid collection of timeline entries', () => {
      const collection = [
        validEntry,
        {
          id: 'demo-stage-02',
          date: '2023-08',
          title: 'Hito 2',
          description: 'Descripción 2',
          category: 'hospital' as const,
        },
      ];
      const result = TimelineCollectionSchema.parse(collection);
      expect(result).toHaveLength(2);
    });

    it('rejects empty collection array', () => {
      expect(() => TimelineCollectionSchema.parse([])).toThrow(/at least one entry/);
    });

    it('rejects duplicate entry IDs within collection', () => {
      const duplicateCollection = [
        validEntry,
        {
          ...validEntry,
          title: 'Hito con ID duplicado',
        },
      ];
      expect(() => TimelineCollectionSchema.parse(duplicateCollection)).toThrow(
        /Duplicate timeline entry IDs are not allowed/
      );
    });
  });
});
