import { describe, expect, it } from 'vitest';
import {
  MemoryCollectionSchema,
  MemorySchema,
  NoteMemorySchema,
  PhotoMemorySchema,
  ScreenshotMemorySchema,
  StickerMemorySchema,
  TextMemorySchema,
} from './memories.schema';

describe('Memory Schemas (Discriminated Union)', () => {
  const validPhoto = {
    id: 'demo-mem-photo',
    type: 'photo' as const,
    src: '/images/demo/photo.webp',
    alt: 'Foto de recuerdo en el aula',
    date: '2021-11',
    rotation: -3,
  };

  const validScreenshot = {
    id: 'demo-mem-screen',
    type: 'screenshot' as const,
    src: '/images/demo/screen.png',
    alt: 'Captura de chat grupal',
    date: '2022-05',
    rotation: 2,
  };

  const validNote = {
    id: 'demo-mem-note',
    type: 'note' as const,
    text: 'Repasar farmacología y semio antes del viernes',
    date: '2023-01',
    rotation: 4,
  };

  const validText = {
    id: 'demo-mem-text',
    type: 'text' as const,
    text: 'Anécdota de guardia inolvidable',
    date: '2024-03',
  };

  const validSticker = {
    id: 'demo-mem-sticker',
    type: 'sticker' as const,
    src: '/images/demo/sticker.svg',
    alt: 'Sticker de estetoscopio',
    rotation: 5,
  };

  describe('Discriminated Union Variants', () => {
    it('accepts valid photo memory', () => {
      const result = MemorySchema.parse(validPhoto);
      expect(result.type).toBe('photo');
      expect(PhotoMemorySchema.safeParse(validPhoto).success).toBe(true);
    });

    it('accepts valid screenshot memory', () => {
      const result = MemorySchema.parse(validScreenshot);
      expect(result.type).toBe('screenshot');
      expect(ScreenshotMemorySchema.safeParse(validScreenshot).success).toBe(true);
    });

    it('accepts valid note memory', () => {
      const result = MemorySchema.parse(validNote);
      expect(result.type).toBe('note');
      expect(NoteMemorySchema.safeParse(validNote).success).toBe(true);
    });

    it('accepts valid text memory', () => {
      const result = MemorySchema.parse(validText);
      expect(result.type).toBe('text');
      expect(TextMemorySchema.safeParse(validText).success).toBe(true);
    });

    it('accepts valid sticker memory', () => {
      const result = MemorySchema.parse(validSticker);
      expect(result.type).toBe('sticker');
      expect(StickerMemorySchema.safeParse(validSticker).success).toBe(true);
    });
  });

  describe('Strict impossible combinations & cross-variant validation', () => {
    it('rejects photo memory with text field', () => {
      expect(() =>
        MemorySchema.parse({
          ...validPhoto,
          text: 'Texto no permitido en photo',
        })
      ).toThrow();
    });

    it('rejects photo memory without alt text', () => {
      expect(() =>
        MemorySchema.parse({
          ...validPhoto,
          alt: '',
        })
      ).toThrow();
    });

    it('rejects note memory with src or alt field', () => {
      expect(() =>
        MemorySchema.parse({
          ...validNote,
          src: '/images/demo/note.webp',
        })
      ).toThrow();
    });

    it('rejects text memory without text or with whitespace only', () => {
      expect(() =>
        MemorySchema.parse({
          ...validText,
          text: '   ',
        })
      ).toThrow();
    });

    it('rejects sticker memory with text field', () => {
      expect(() =>
        MemorySchema.parse({
          ...validSticker,
          text: 'Texto prohibido en sticker',
        })
      ).toThrow();
    });

    it('rejects unknown memory type', () => {
      expect(() =>
        MemorySchema.parse({
          id: 'demo-invalid',
          type: 'video_clip',
          src: '/images/demo/video.webp',
        })
      ).toThrow();
    });
  });

  describe('Rotation constraints', () => {
    it('accepts rotation within [-45, 45]', () => {
      expect(MemorySchema.parse({ ...validNote, rotation: -45 }).rotation).toBe(-45);
      expect(MemorySchema.parse({ ...validNote, rotation: 45 }).rotation).toBe(45);
      expect(MemorySchema.parse({ ...validNote, rotation: 0 }).rotation).toBe(0);
    });

    it('rejects rotation outside [-45, 45]', () => {
      expect(() => MemorySchema.parse({ ...validNote, rotation: -50 })).toThrow();
      expect(() => MemorySchema.parse({ ...validNote, rotation: 60 })).toThrow();
    });
  });

  describe('MemoryCollectionSchema', () => {
    it('accepts heterogeneous valid collection', () => {
      const result = MemoryCollectionSchema.parse([
        validPhoto,
        validScreenshot,
        validNote,
        validText,
        validSticker,
      ]);
      expect(result).toHaveLength(5);
    });

    it('rejects empty memory collection', () => {
      expect(() => MemoryCollectionSchema.parse([])).toThrow(/at least one item/);
    });

    it('rejects collection with duplicate IDs across different memory types', () => {
      const duplicate = [
        validPhoto,
        {
          ...validNote,
          id: validPhoto.id, // same ID on different type
        },
      ];
      expect(() => MemoryCollectionSchema.parse(duplicate)).toThrow(
        /Duplicate memory IDs are not allowed/
      );
    });
  });
});
