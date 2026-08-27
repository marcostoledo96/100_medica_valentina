import { z } from 'zod';
import {
  hasUniqueIds,
  IdSchema,
  LocalImagePathSchema,
  NonEmptyStringSchema,
} from './shared.schema';

const RotationSchema = z
  .number()
  .min(-45, 'Rotation cannot be less than -45 degrees')
  .max(45, 'Rotation cannot be more than 45 degrees')
  .optional();

export const PhotoMemorySchema = z
  .object({
    id: IdSchema,
    type: z.literal('photo'),
    src: LocalImagePathSchema,
    alt: NonEmptyStringSchema,
    date: NonEmptyStringSchema.optional(),
    rotation: RotationSchema,
  })
  .strict();

export const ScreenshotMemorySchema = z
  .object({
    id: IdSchema,
    type: z.literal('screenshot'),
    src: LocalImagePathSchema,
    alt: NonEmptyStringSchema,
    date: NonEmptyStringSchema.optional(),
    rotation: RotationSchema,
  })
  .strict();

export const NoteMemorySchema = z
  .object({
    id: IdSchema,
    type: z.literal('note'),
    text: NonEmptyStringSchema,
    date: NonEmptyStringSchema.optional(),
    rotation: RotationSchema,
  })
  .strict();

export const TextMemorySchema = z
  .object({
    id: IdSchema,
    type: z.literal('text'),
    text: NonEmptyStringSchema,
    date: NonEmptyStringSchema.optional(),
    rotation: RotationSchema,
  })
  .strict();

export const StickerMemorySchema = z
  .object({
    id: IdSchema,
    type: z.literal('sticker'),
    src: LocalImagePathSchema,
    alt: NonEmptyStringSchema.optional(),
    rotation: RotationSchema,
  })
  .strict();

export const MemorySchema = z.discriminatedUnion('type', [
  PhotoMemorySchema,
  ScreenshotMemorySchema,
  NoteMemorySchema,
  TextMemorySchema,
  StickerMemorySchema,
]);

export const MemoryCollectionSchema = z
  .array(MemorySchema)
  .min(1, 'Memory collection must contain at least one item')
  .refine(hasUniqueIds, {
    message: 'Duplicate memory IDs are not allowed',
  });

export type PhotoMemory = z.infer<typeof PhotoMemorySchema>;
export type ScreenshotMemory = z.infer<typeof ScreenshotMemorySchema>;
export type NoteMemory = z.infer<typeof NoteMemorySchema>;
export type TextMemory = z.infer<typeof TextMemorySchema>;
export type StickerMemory = z.infer<typeof StickerMemorySchema>;
export type Memory = z.infer<typeof MemorySchema>;
export type MemoryType = Memory['type'];
export type MemoryCollection = z.infer<typeof MemoryCollectionSchema>;
