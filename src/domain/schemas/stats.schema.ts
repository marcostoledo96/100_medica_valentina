import { z } from 'zod';
import { hasUniqueIds, IdSchema, NonEmptyStringSchema } from './shared.schema';

export const StatFormatSchema = z.enum(['number', 'percentage', 'text', 'progress']);

export const StatSchema = z.object({
  id: IdSchema,
  label: NonEmptyStringSchema,
  value: z.union([z.number(), NonEmptyStringSchema]),
  unit: NonEmptyStringSchema.optional(),
  format: StatFormatSchema,
  note: NonEmptyStringSchema.optional(),
  humorous: z.boolean().optional(),
});

export const StatCollectionSchema = z
  .array(StatSchema)
  .min(1, 'Stat collection must contain at least one stat')
  .refine(hasUniqueIds, {
    message: 'Duplicate stat IDs are not allowed',
  });

export type StatFormat = z.infer<typeof StatFormatSchema>;
export type Stat = z.infer<typeof StatSchema>;
export type StatCollection = z.infer<typeof StatCollectionSchema>;
