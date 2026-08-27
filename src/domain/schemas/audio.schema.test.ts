import { describe, expect, it } from 'vitest';
import { AudioCollectionSchema, AudioMessageSchema } from './audio.schema';

describe('Audio Schemas', () => {
  const validAudio = {
    id: 'demo-audio-01',
    author: 'Amigo de la Carrera',
    title: 'Felicitaciones',
    src: '/audio/demo/audio-01.mp3',
    duration: 25,
  };

  describe('AudioMessageSchema', () => {
    it('accepts valid audio message with optional title and duration', () => {
      const result = AudioMessageSchema.parse(validAudio);
      expect(result.id).toBe('demo-audio-01');
      expect(result.duration).toBe(25);
    });

    it('accepts audio message without title or duration', () => {
      const minimalAudio = {
        id: 'demo-audio-02',
        author: 'Familia',
        src: '/audio/demo/audio-02.m4a',
      };
      const result = AudioMessageSchema.parse(minimalAudio);
      expect(result.title).toBeUndefined();
      expect(result.duration).toBeUndefined();
    });

    it('rejects invalid audio src path or external URL', () => {
      expect(() =>
        AudioMessageSchema.parse({
          ...validAudio,
          src: 'https://example.com/audio.mp3',
        })
      ).toThrow();

      expect(() =>
        AudioMessageSchema.parse({
          ...validAudio,
          src: '/audio/track.exe',
        })
      ).toThrow();
    });

    it('rejects non-positive duration or duration > 3600 seconds', () => {
      expect(() =>
        AudioMessageSchema.parse({
          ...validAudio,
          duration: -5,
        })
      ).toThrow(/positive/);

      expect(() =>
        AudioMessageSchema.parse({
          ...validAudio,
          duration: 0,
        })
      ).toThrow(/positive/);

      expect(() =>
        AudioMessageSchema.parse({
          ...validAudio,
          duration: 4000,
        })
      ).toThrow(/cannot exceed 1 hour/);
    });
  });

  describe('AudioCollectionSchema', () => {
    it('accepts valid collection of audio messages', () => {
      const collection = [
        validAudio,
        {
          id: 'demo-audio-02',
          author: 'Docente',
          src: '/audio/demo/audio-02.wav',
        },
      ];
      const result = AudioCollectionSchema.parse(collection);
      expect(result).toHaveLength(2);
    });

    it('rejects empty audio collection', () => {
      expect(() => AudioCollectionSchema.parse([])).toThrow(/at least one message/);
    });

    it('rejects duplicate audio IDs', () => {
      const duplicate = [
        validAudio,
        {
          ...validAudio,
          author: 'Otro autor con mismo ID',
        },
      ];
      expect(() => AudioCollectionSchema.parse(duplicate)).toThrow(
        /Duplicate audio message IDs are not allowed/
      );
    });
  });
});
