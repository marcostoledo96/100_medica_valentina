import { z } from 'zod';
import {
  hasUniqueIds,
  IdSchema,
  LocalImagePathSchema,
  NonEmptyStringSchema,
} from './shared.schema';

/**
 * Anamnesis is a brief narrative bridge from Expediente to the chronological
 * story. Real content is not confirmed yet, so every visible narrative
 * statement must be unmistakably demo/provisional (Issue #8). The guard keeps
 * future authored content from accidentally shipping unconfirmed facts.
 */
const PROVISIONAL_STATEMENT_PATTERN = /demo|provisional|borrador|reemplazab|editab/i;

export const ProvisionalStatementSchema = NonEmptyStringSchema.refine(
  (value) => PROVISIONAL_STATEMENT_PATTERN.test(value),
  {
    message:
      'Unconfirmed narrative statements must explicitly be marked as demo, provisional, draft, replaceable, or editable',
  }
);

export const AnamnesisBlockSchema = z.object({
  id: IdSchema,
  title: NonEmptyStringSchema,
  body: ProvisionalStatementSchema,
});

export const AnamnesisPhotoSchema = z.object({
  src: LocalImagePathSchema,
  alt: NonEmptyStringSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const AnamnesisQuoteSchema = z.object({
  text: ProvisionalStatementSchema,
  attribution: NonEmptyStringSchema.optional(),
});

export const AnamnesisContentSchema = z.object({
  eyebrow: NonEmptyStringSchema,
  heading: NonEmptyStringSchema,
  intro: ProvisionalStatementSchema,
  blocks: z
    .array(AnamnesisBlockSchema)
    .min(1, 'Anamnesis needs at least one narrative block')
    .max(3, 'Anamnesis is a brief bridge: at most three narrative blocks')
    .refine(hasUniqueIds, { message: 'Duplicate anamnesis block IDs are not allowed' }),
  photo: AnamnesisPhotoSchema.optional(),
  quote: AnamnesisQuoteSchema.optional(),
  photoFallbackLabel: NonEmptyStringSchema,
  transitionLabel: NonEmptyStringSchema,
  ctaLabel: NonEmptyStringSchema,
});

export type AnamnesisBlock = z.infer<typeof AnamnesisBlockSchema>;
export type AnamnesisPhoto = z.infer<typeof AnamnesisPhotoSchema>;
export type AnamnesisQuote = z.infer<typeof AnamnesisQuoteSchema>;
export type AnamnesisContent = z.infer<typeof AnamnesisContentSchema>;
