import { z } from 'zod';
import {
  hasUniqueIds,
  IdSchema,
  LocalAudioPathSchema,
  NonEmptyStringSchema,
} from './shared.schema';

export const AudioMessageSchema = z.object({
  id: IdSchema,
  author: NonEmptyStringSchema,
  title: NonEmptyStringSchema.optional(),
  src: LocalAudioPathSchema,
  duration: z
    .number()
    .positive('Duration must be positive in seconds')
    .max(3600, 'Duration cannot exceed 1 hour')
    .optional(),
});

export const AudioCollectionSchema = z
  .array(AudioMessageSchema)
  .min(1, 'Audio collection must contain at least one message')
  .refine(hasUniqueIds, {
    message: 'Duplicate audio message IDs are not allowed',
  });

export type AudioMessage = z.infer<typeof AudioMessageSchema>;
export type AudioCollection = z.infer<typeof AudioCollectionSchema>;
