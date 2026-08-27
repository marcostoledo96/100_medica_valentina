import { z } from 'zod';
import { LocalImagePathSchema, NonEmptyStringSchema } from './shared.schema';

export const FinaleSchema = z.object({
  headline: NonEmptyStringSchema,
  message: z
    .array(NonEmptyStringSchema)
    .min(1, 'Finale message must contain at least one paragraph'),
  image: LocalImagePathSchema,
  date: NonEmptyStringSchema,
});

export type Finale = z.infer<typeof FinaleSchema>;
