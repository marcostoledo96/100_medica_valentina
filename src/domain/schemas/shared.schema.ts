import { z } from 'zod';

export const IdSchema = z
  .string()
  .trim()
  .min(1, 'ID cannot be empty')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'ID must contain only alphanumeric characters, dashes, or underscores'
  );

export const NonEmptyStringSchema = z
  .string()
  .trim()
  .min(1, 'Text cannot be empty or contain only whitespace');

export const LocalImagePathSchema = z
  .string()
  .trim()
  .regex(
    /^\/images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(webp|png|jpg|jpeg|svg|gif|avif)$/,
    'Must be a valid local image path starting with /images/ (supported: .webp, .png, .jpg, .jpeg, .svg, .gif, .avif)'
  );

export const LocalAudioPathSchema = z
  .string()
  .trim()
  .regex(
    /^\/audio\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(mp3|m4a|wav|ogg|aac|webm)$/,
    'Must be a valid local audio path starting with /audio/ (supported: .mp3, .m4a, .wav, .ogg, .aac, .webm)'
  );

export function hasUniqueIds<T extends { id: string }>(items: T[]): boolean {
  const ids = items.map((item) => item.id);
  return new Set(ids).size === ids.length;
}
