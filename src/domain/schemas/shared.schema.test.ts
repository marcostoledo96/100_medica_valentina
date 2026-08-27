import { describe, expect, it } from 'vitest';
import {
  hasUniqueIds,
  IdSchema,
  LocalAudioPathSchema,
  LocalImagePathSchema,
  NonEmptyStringSchema,
} from './shared.schema';

describe('Shared Schemas & Validation Helpers', () => {
  describe('IdSchema', () => {
    it('accepts valid alphanumeric, dash, and underscore IDs', () => {
      expect(IdSchema.parse('profile-01')).toBe('profile-01');
      expect(IdSchema.parse('timeline_entry_2')).toBe('timeline_entry_2');
      expect(IdSchema.parse('simple123')).toBe('simple123');
    });

    it('rejects empty and whitespace-only strings', () => {
      expect(() => IdSchema.parse('')).toThrow();
      expect(() => IdSchema.parse('   ')).toThrow();
    });

    it('rejects special characters, spaces, and non-slug symbols', () => {
      expect(() => IdSchema.parse('id with spaces')).toThrow();
      expect(() => IdSchema.parse('id@special!')).toThrow();
      expect(() => IdSchema.parse('id#hash')).toThrow();
      expect(() => IdSchema.parse('id/slash')).toThrow();
    });
  });

  describe('NonEmptyStringSchema', () => {
    it('accepts valid non-empty strings and trims them', () => {
      expect(NonEmptyStringSchema.parse('Texto válido')).toBe('Texto válido');
      expect(NonEmptyStringSchema.parse('  Texto con espacios alrededor  ')).toBe(
        'Texto con espacios alrededor'
      );
    });

    it('rejects empty strings and whitespace-only strings', () => {
      expect(() => NonEmptyStringSchema.parse('')).toThrow();
      expect(() => NonEmptyStringSchema.parse('   ')).toThrow();
      expect(() => NonEmptyStringSchema.parse('\t\n  ')).toThrow();
    });
  });

  describe('LocalImagePathSchema', () => {
    it('accepts valid local image paths with supported extensions', () => {
      expect(LocalImagePathSchema.parse('/images/demo/portrait.webp')).toBe(
        '/images/demo/portrait.webp'
      );
      expect(LocalImagePathSchema.parse('/images/gallery/pic_01.png')).toBe(
        '/images/gallery/pic_01.png'
      );
      expect(LocalImagePathSchema.parse('/images/photo.jpg')).toBe('/images/photo.jpg');
      expect(LocalImagePathSchema.parse('/images/photo.jpeg')).toBe('/images/photo.jpeg');
      expect(LocalImagePathSchema.parse('/images/icons/badge.svg')).toBe('/images/icons/badge.svg');
      expect(LocalImagePathSchema.parse('/images/anim.gif')).toBe('/images/anim.gif');
      expect(LocalImagePathSchema.parse('/images/modern.avif')).toBe('/images/modern.avif');
    });

    it('rejects external URLs', () => {
      expect(() => LocalImagePathSchema.parse('https://example.com/image.webp')).toThrow();
      expect(() => LocalImagePathSchema.parse('http://example.com/image.png')).toThrow();
    });

    it('rejects wrong path prefixes or missing /images/', () => {
      expect(() => LocalImagePathSchema.parse('/assets/image.webp')).toThrow();
      expect(() => LocalImagePathSchema.parse('images/image.webp')).toThrow();
      expect(() => LocalImagePathSchema.parse('/static/img.png')).toThrow();
    });

    it('rejects path traversal (..) and relative dot segments (.)', () => {
      expect(() => LocalImagePathSchema.parse('/images/../avatar.webp')).toThrow();
      expect(() => LocalImagePathSchema.parse('/images/a/../../avatar.webp')).toThrow();
      expect(() => LocalImagePathSchema.parse('/images/./avatar.webp')).toThrow();
      expect(() => LocalImagePathSchema.parse('/images/sub/../pic.png')).toThrow();
    });

    it('rejects double slashes, trailing slashes, and uppercase prefixes', () => {
      expect(() => LocalImagePathSchema.parse('/images//avatar.webp')).toThrow();
      expect(() => LocalImagePathSchema.parse('/images/sub//pic.webp')).toThrow();
      expect(() => LocalImagePathSchema.parse('/images/')).toThrow();
      expect(() => LocalImagePathSchema.parse('/IMAGES/portrait.webp')).toThrow();
      expect(() => LocalImagePathSchema.parse('/Images/portrait.webp')).toThrow();
    });

    it('accepts valid deeply nested local paths', () => {
      expect(LocalImagePathSchema.parse('/images/sub/nested_folder/pic-01.png')).toBe(
        '/images/sub/nested_folder/pic-01.png'
      );
    });
  });

  describe('LocalAudioPathSchema', () => {
    it('accepts valid local audio paths with supported extensions', () => {
      expect(LocalAudioPathSchema.parse('/audio/demo/sample.mp3')).toBe('/audio/demo/sample.mp3');
      expect(LocalAudioPathSchema.parse('/audio/greetings/audio_01.m4a')).toBe(
        '/audio/greetings/audio_01.m4a'
      );
      expect(LocalAudioPathSchema.parse('/audio/voice.wav')).toBe('/audio/voice.wav');
      expect(LocalAudioPathSchema.parse('/audio/voice.ogg')).toBe('/audio/voice.ogg');
      expect(LocalAudioPathSchema.parse('/audio/voice.aac')).toBe('/audio/voice.aac');
      expect(LocalAudioPathSchema.parse('/audio/voice.webm')).toBe('/audio/voice.webm');
    });

    it('rejects path traversal (..) and relative dot segments (.) in audio paths', () => {
      expect(() => LocalAudioPathSchema.parse('/audio/../voice.mp3')).toThrow();
      expect(() => LocalAudioPathSchema.parse('/audio/a/../../voice.mp3')).toThrow();
      expect(() => LocalAudioPathSchema.parse('/audio/./voice.mp3')).toThrow();
    });

    it('rejects double slashes, trailing slashes, and uppercase prefixes in audio paths', () => {
      expect(() => LocalAudioPathSchema.parse('/audio//voice.mp3')).toThrow();
      expect(() => LocalAudioPathSchema.parse('/audio/')).toThrow();
      expect(() => LocalAudioPathSchema.parse('/AUDIO/voice.mp3')).toThrow();
      expect(() => LocalAudioPathSchema.parse('/Audio/voice.mp3')).toThrow();
    });

    it('rejects external audio URLs and wrong prefixes', () => {
      expect(() => LocalAudioPathSchema.parse('https://cdn.audio.com/track.mp3')).toThrow();
      expect(() => LocalAudioPathSchema.parse('/media/track.mp3')).toThrow();
      expect(() => LocalAudioPathSchema.parse('audio/track.mp3')).toThrow();
    });

    it('rejects invalid or missing audio extensions', () => {
      expect(() => LocalAudioPathSchema.parse('/audio/song.mp4')).toThrow();
      expect(() => LocalAudioPathSchema.parse('/audio/song.exe')).toThrow();
      expect(() => LocalAudioPathSchema.parse('/audio/song')).toThrow();
    });
  });

  describe('hasUniqueIds', () => {
    it('returns true when all items have distinct IDs', () => {
      const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      expect(hasUniqueIds(items)).toBe(true);
    });

    it('returns false when duplicate IDs are present', () => {
      const items = [{ id: 'a' }, { id: 'b' }, { id: 'a' }];
      expect(hasUniqueIds(items)).toBe(false);
    });

    it('returns true for empty or single item arrays', () => {
      expect(hasUniqueIds([])).toBe(true);
      expect(hasUniqueIds([{ id: 'single' }])).toBe(true);
    });
  });
});
