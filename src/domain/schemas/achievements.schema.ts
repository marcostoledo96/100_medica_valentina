import { z } from 'zod';
import { hasUniqueIds, IdSchema, NonEmptyStringSchema } from './shared.schema';

export const AchievementSchema = z.object({
  id: IdSchema,
  title: NonEmptyStringSchema,
  description: NonEmptyStringSchema,
  icon: NonEmptyStringSchema,
  secret: z.boolean(),
  trigger: NonEmptyStringSchema,
});

export const AchievementCollectionSchema = z
  .array(AchievementSchema)
  .min(1, 'Achievement collection must contain at least one achievement')
  .refine(hasUniqueIds, {
    message: 'Duplicate achievement IDs are not allowed',
  });

export type Achievement = z.infer<typeof AchievementSchema>;
export type AchievementCollection = z.infer<typeof AchievementCollectionSchema>;
