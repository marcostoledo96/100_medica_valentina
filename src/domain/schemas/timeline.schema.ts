import { z } from 'zod';
import {
  hasUniqueIds,
  IdSchema,
  LocalImagePathSchema,
  NonEmptyStringSchema,
} from './shared.schema';

export const TimelineCategorySchema = z.enum([
  'academic',
  'personal',
  'hospital',
  'funny',
  'milestone',
]);

export const TimelineEntrySchema = z.object({
  id: IdSchema,
  date: NonEmptyStringSchema,
  title: NonEmptyStringSchema,
  description: NonEmptyStringSchema,
  category: TimelineCategorySchema,
  image: LocalImagePathSchema.optional(),
  imageAlt: NonEmptyStringSchema.optional(),
  quote: NonEmptyStringSchema.optional(),
});

export const TimelineCollectionSchema = z
  .array(TimelineEntrySchema)
  .min(1, 'Timeline collection must contain at least one entry')
  .refine(hasUniqueIds, {
    message: 'Duplicate timeline entry IDs are not allowed',
  });

export type TimelineCategory = z.infer<typeof TimelineCategorySchema>;
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type TimelineCollection = z.infer<typeof TimelineCollectionSchema>;
