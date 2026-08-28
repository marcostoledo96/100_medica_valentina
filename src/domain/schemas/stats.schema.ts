import { z } from 'zod';
import { hasUniqueIds, IdSchema, NonEmptyStringSchema } from './shared.schema';

export const StatFormatSchema = z.enum(['number', 'percentage', 'text', 'progress']);

const statMetadata = {
  id: IdSchema,
  label: NonEmptyStringSchema,
  unit: NonEmptyStringSchema.optional(),
  note: NonEmptyStringSchema.optional(),
  humorous: z.boolean().optional(),
};

const generalStatValue = z.union([z.number(), NonEmptyStringSchema]);

export const StatSchema = z.discriminatedUnion('format', [
  z.object({
    ...statMetadata,
    value: generalStatValue,
    format: z.literal('number'),
  }),
  z.object({
    ...statMetadata,
    value: generalStatValue,
    format: z.literal('percentage'),
  }),
  z.object({
    ...statMetadata,
    value: generalStatValue,
    format: z.literal('text'),
  }),
  z.object({
    ...statMetadata,
    value: z.number().min(0).max(100),
    format: z.literal('progress'),
  }),
]);

export const StatCollectionSchema = z
  .array(StatSchema)
  .min(1, 'Stat collection must contain at least one stat')
  .refine(hasUniqueIds, {
    message: 'Duplicate stat IDs are not allowed',
  });

export type StatFormat = z.infer<typeof StatFormatSchema>;
export type Stat = z.infer<typeof StatSchema>;
export type StatCollection = z.infer<typeof StatCollectionSchema>;
