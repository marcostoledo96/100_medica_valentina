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

export const TimelineDateSchema = NonEmptyStringSchema.regex(
  /^\d{4}-(0[1-9]|1[0-2])$/,
  'Date must use YYYY-MM format with a valid month from 01 to 12'
);

export const TimelineEntrySchema = z.object({
  id: IdSchema,
  date: TimelineDateSchema,
  title: NonEmptyStringSchema,
  description: NonEmptyStringSchema,
  category: TimelineCategorySchema,
  image: LocalImagePathSchema.optional(),
  imageAlt: NonEmptyStringSchema.optional(),
  quote: NonEmptyStringSchema.optional(),
});

function hasChronologicalDates(entries: readonly { date: string }[]): boolean {
  for (let index = 1; index < entries.length; index += 1) {
    const previousEntry = entries[index - 1];
    const currentEntry = entries[index];

    if (!previousEntry || !currentEntry || previousEntry.date > currentEntry.date) {
      return false;
    }
  }

  return true;
}

export const TimelineCollectionSchema = z
  .array(TimelineEntrySchema)
  .min(1, 'Timeline collection must contain at least one entry')
  .refine(hasUniqueIds, {
    message: 'Duplicate timeline entry IDs are not allowed',
  })
  .refine(hasChronologicalDates, {
    message: 'Timeline entries must be in chronological order',
  });

export type TimelineCategory = z.infer<typeof TimelineCategorySchema>;
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type TimelineCollection = z.infer<typeof TimelineCollectionSchema>;
