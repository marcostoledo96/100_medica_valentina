import { describe, expect, it } from 'vitest';
import {
  AnamnesisBlockSchema,
  AnamnesisContentSchema,
  AnamnesisPhotoSchema,
  AnamnesisQuoteSchema,
} from './anamnesis.schema';

const validBlock = {
  id: 'origen',
  title: 'Origen',
  body: 'La historia comienza con una niña que quería entender por qué el cuerpo hacía lo que hacía.',
};

const validPhoto = {
  src: '/images/profile/portrait.webp',
  alt: 'Retrato de la protagonista',
  width: 320,
  height: 400,
};

const validQuote = {
  text: 'Cuando el expediente se cierra, la historia de verdad empieza a contarse.',
  attribution: 'Sobre la anamnesis',
};

const validContent = {
  eyebrow: 'Anamnesis narrativa',
  heading: 'Anamnesis',
  intro: 'Un puente narrativo entre el expediente y la historia completa.',
  blocks: [validBlock],
  photoFallbackLabel: 'Foto no disponible',
  transitionLabel: 'La historia continúa en la línea de tiempo.',
  ctaLabel: 'Continuar la historia',
};

describe('Anamnesis schemas', () => {
  it('accepts realistic confirmed content that contains none of the demo or provisional markers', () => {
    const result = AnamnesisContentSchema.parse({
      ...validContent,
      photo: validPhoto,
      quote: validQuote,
    });
    expect(result.intro).toBe(validContent.intro);
    expect(result.blocks[0]?.body).toBe(validBlock.body);
    expect(result.quote?.text).toBe(validQuote.text);
    expect(result.photo?.src).toBe('/images/profile/portrait.webp');
  });

  it('accepts content without photo and quote (both optional)', () => {
    const result = AnamnesisContentSchema.parse(validContent);
    expect(result.photo).toBeUndefined();
    expect(result.quote).toBeUndefined();
  });

  it('enforces at most three narrative blocks', () => {
    const fourBlocks = Array.from({ length: 4 }, (_, index) => ({
      ...validBlock,
      id: `bloque-${index + 1}`,
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
    expect(() => AnamnesisContentSchema.parse({ ...validContent, intro: '   ' })).toThrow();
    expect(() => AnamnesisBlockSchema.parse({ ...validBlock, body: '' })).toThrow();
    expect(() =>
      AnamnesisQuoteSchema.parse({ text: 'Una cita cualquiera.', attribution: '   ' })
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

  it('keeps the quote shape strict: required text, optional attribution', () => {
    expect(() => AnamnesisQuoteSchema.parse({ attribution: 'Solo atribución' })).toThrow();
    expect(
      AnamnesisQuoteSchema.parse({ text: 'Una cita cualquiera.' }).attribution
    ).toBeUndefined();
  });
});
