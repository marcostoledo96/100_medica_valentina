import { z } from 'zod';
import {
  hasUniqueIds,
  IdSchema,
  LocalImagePathSchema,
  NonEmptyStringSchema,
} from './shared.schema';

export const GalleryItemSchema = z.object({
  id: IdSchema,
  image: LocalImagePathSchema,
  date: NonEmptyStringSchema.optional(),
  title: NonEmptyStringSchema,
  finding: NonEmptyStringSchema.optional(),
  caption: NonEmptyStringSchema.optional(),
  alt: NonEmptyStringSchema,
});

export const GalleryCollectionSchema = z
  .array(GalleryItemSchema)
  .min(1, 'Gallery collection must contain at least one item')
  .refine(hasUniqueIds, {
    message: 'Duplicate gallery item IDs are not allowed',
  });

export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type GalleryCollection = z.infer<typeof GalleryCollectionSchema>;
