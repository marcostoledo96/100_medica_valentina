import { describe, expect, it } from 'vitest';
import {
  AnamnesisBlockSchema,
  AnamnesisContentSchema,
  AnamnesisPhotoSchema,
  AnamnesisQuoteSchema,
  ProvisionalStatementSchema,
} from './anamnesis.schema';

const validBlock = {
  id: 'demo-origen',
  title: 'Origen',
  body: 'Texto provisional y editable: este párrafo demo se reemplazará con contenido confirmado.',
};

const validPhoto = {
  src: '/images/demo/portrait.webp',
  alt: 'Retrato demo provisional',
  width: 320,
  height: 400,
};

const validContent = {
  eyebrow: 'Anamnesis narrativa · puente provisional',
  heading: 'Anamnesis',
  intro: 'Un puente narrativo provisional y editable entre el expediente y la historia completa.',
  blocks: [validBlock],
  photoFallbackLabel: 'Foto provisional no disponible',
  transitionLabel: 'La historia continúa en la línea de tiempo.',
  ctaLabel: 'Continuar la historia',
};

describe('Anamnesis schemas', () => {
  it('accepts valid content with optional photo and quote', () => {
    const result = AnamnesisContentSchema.parse({
      ...validContent,
      photo: validPhoto,
      quote: { text: 'Frase provisional de demo.', attribution: 'Atribución provisional' },
    });
    expect(result.blocks).toHaveLength(1);
    expect(result.photo?.src).toBe('/images/demo/portrait.webp');
    expect(result.quote?.attribution).toBe('Atribución provisional');
  });

  it('accepts content without photo and quote (both optional)', () => {
    const result = AnamnesisContentSchema.parse(validContent);
    expect(result.photo).toBeUndefined();
    expect(result.quote).toBeUndefined();
  });

  it('enforces at most three narrative blocks', () => {
    const fourBlocks = Array.from({ length: 4 }, (_, index) => ({
      ...validBlock,
      id: `demo-bloque-${index + 1}`,
    }));
    expect(() => AnamnesisContentSchema.parse({ ...validContent, blocks: fourBlocks })).toThrow(
      /at most three/
    );
  });

  it('rejects an empty blocks array', () => {
    expect(() => AnamnesisContentSchema.parse({ ...validContent, blocks: [] })).toThrow(
      /at least one/
    );
  });

  it('rejects duplicate block IDs', () => {
    expect(() =>
      AnamnesisContentSchema.parse({ ...validContent, blocks: [validBlock, validBlock] })
    ).toThrow(/Duplicate/);
  });

  it('rejects empty or whitespace-only text fields', () => {
    expect(() => AnamnesisContentSchema.parse({ ...validContent, heading: '  ' })).toThrow();
    expect(() => AnamnesisBlockSchema.parse({ ...validBlock, body: '' })).toThrow();
    expect(() =>
      AnamnesisQuoteSchema.parse({ text: 'Frase provisional', attribution: '   ' })
    ).toThrow();
  });

  it('rejects invalid local image paths and unpaired photo fields', () => {
    expect(() =>
      AnamnesisPhotoSchema.parse({ ...validPhoto, src: 'https://example.com/photo.webp' })
    ).toThrow();
    expect(() => AnamnesisPhotoSchema.parse({ src: validPhoto.src })).toThrow();
    expect(() => AnamnesisPhotoSchema.parse({ alt: validPhoto.alt })).toThrow();
    expect(() => AnamnesisPhotoSchema.parse({ ...validPhoto, width: 0 })).toThrow();
  });

  it('enforces the provisional/demo guard on narrative statements', () => {
    expect(ProvisionalStatementSchema.safeParse('Texto provisional editable').success).toBe(true);
    expect(
      ProvisionalStatementSchema.safeParse('Historia confirmada sin marcadores.').success
    ).toBe(false);
    expect(() =>
      AnamnesisBlockSchema.parse({ ...validBlock, body: 'Relato definitivo confirmado.' })
    ).toThrow(/demo|provisional/i);
    expect(() => AnamnesisQuoteSchema.parse({ text: 'Una cita real confirmada.' })).toThrow(
      /demo|provisional/i
    );
  });

  it('keeps the quote shape strict: required text, optional attribution', () => {
    expect(() => AnamnesisQuoteSchema.parse({ attribution: 'Solo atribución' })).toThrow();
    expect(AnamnesisQuoteSchema.parse({ text: 'Frase provisional' }).attribution).toBeUndefined();
  });
});
