import { z } from 'zod';
import {
  hasUniqueIds,
  IdSchema,
  LocalImagePathSchema,
  NonEmptyStringSchema,
} from './shared.schema';

export const PhotoRotationSchema = z
  .number()
  .min(-4, 'Photo rotation cannot be less than -4 degrees')
  .max(4, 'Photo rotation cannot be more than 4 degrees')
  .optional();

export const ScreenshotRotationSchema = z
  .number()
  .min(-4, 'Screenshot rotation cannot be less than -4 degrees')
  .max(4, 'Screenshot rotation cannot be more than 4 degrees')
  .optional();

export const NoteRotationSchema = z
  .number()
  .min(-6, 'Note rotation cannot be less than -6 degrees')
  .max(6, 'Note rotation cannot be more than 6 degrees')
  .optional();

export const TextRotationSchema = z
  .number()
  .min(-4, 'Text rotation cannot be less than -4 degrees')
  .max(4, 'Text rotation cannot be more than 4 degrees')
  .optional();

export const StickerRotationSchema = z
  .number()
  .min(-8, 'Sticker rotation cannot be less than -8 degrees')
  .max(8, 'Sticker rotation cannot be more than 8 degrees')
  .optional();

export const PhotoMemorySchema = z
  .object({
    id: IdSchema,
    type: z.literal('photo'),
    src: LocalImagePathSchema,
    alt: NonEmptyStringSchema,
    date: NonEmptyStringSchema.optional(),
    rotation: PhotoRotationSchema,
  })
  .strict();

export const ScreenshotMemorySchema = z
  .object({
    id: IdSchema,
    type: z.literal('screenshot'),
    src: LocalImagePathSchema,
    alt: NonEmptyStringSchema,
    date: NonEmptyStringSchema.optional(),
    rotation: ScreenshotRotationSchema,
  })
  .strict();

export const NoteMemorySchema = z
  .object({
    id: IdSchema,
    type: z.literal('note'),
    text: NonEmptyStringSchema,
    date: NonEmptyStringSchema.optional(),
    rotation: NoteRotationSchema,
  })
  .strict();

export const TextMemorySchema = z
  .object({
    id: IdSchema,
    type: z.literal('text'),
    text: NonEmptyStringSchema,
    date: NonEmptyStringSchema.optional(),
    rotation: TextRotationSchema,
  })
  .strict();

export const StickerMemorySchema = z
  .object({
    id: IdSchema,
    type: z.literal('sticker'),
    src: LocalImagePathSchema,
    alt: NonEmptyStringSchema.optional(),
    rotation: StickerRotationSchema,
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
