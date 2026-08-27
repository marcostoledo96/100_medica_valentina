import { describe, expect, it } from 'vitest';
import { FinaleSchema } from './finale.schema';

describe('FinaleSchema', () => {
  const validFinale = {
    headline: '¡Felicitaciones Médica!',
    message: ['Párrafo de felicitaciones 1.', 'Párrafo de felicitaciones 2.'],
    image: '/images/demo/finale.webp',
    imageAlt: 'Fotografía emotiva de celebración',
    date: '2026-12-15',
  };

  it('accepts valid finale data', () => {
    const result = FinaleSchema.parse(validFinale);
    expect(result.headline).toBe('¡Felicitaciones Médica!');
    expect(result.message).toHaveLength(2);
    expect(result.imageAlt).toBe('Fotografía emotiva de celebración');
  });

  it('rejects missing or whitespace-only imageAlt', () => {
    expect(() =>
      FinaleSchema.parse({
        ...validFinale,
        imageAlt: '',
      })
    ).toThrow();

    expect(() =>
      FinaleSchema.parse({
        ...validFinale,
        imageAlt: '   ',
      })
    ).toThrow();
  });

  it('rejects empty message array', () => {
    expect(() =>
      FinaleSchema.parse({
        ...validFinale,
        message: [],
      })
    ).toThrow(/at least one paragraph/);
  });

  it('rejects message paragraphs with empty or whitespace-only strings', () => {
    expect(() =>
      FinaleSchema.parse({
        ...validFinale,
        message: ['Párrafo 1', '   '],
      })
    ).toThrow();
  });

  it('rejects invalid image path', () => {
    expect(() =>
      FinaleSchema.parse({
        ...validFinale,
        image: '/assets/finale.png',
      })
    ).toThrow();
  });

  it('rejects empty headline or date', () => {
    expect(() => FinaleSchema.parse({ ...validFinale, headline: '  ' })).toThrow();
    expect(() => FinaleSchema.parse({ ...validFinale, date: '' })).toThrow();
  });
});
