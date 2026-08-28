import { z } from 'zod';
import {
  hasUniqueIds,
  IdSchema,
  LocalImagePathSchema,
  NonEmptyStringSchema,
} from './shared.schema';

/**
 * Anamnesis is a brief narrative bridge from Expediente to the chronological
 * story. The domain schema only guarantees structure (non-empty text, bounded
 * block count, paired photos); the demo/provisional editorial rule for the
 * still-unconfirmed fixture copy lives in the content layer (Issue #8).
 */
export const AnamnesisBlockSchema = z.object({
  id: IdSchema,
  title: NonEmptyStringSchema,
  body: NonEmptyStringSchema,
});

export const AnamnesisPhotoSchema = z.object({
  src: LocalImagePathSchema,
  alt: NonEmptyStringSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const AnamnesisQuoteSchema = z.object({
  text: NonEmptyStringSchema,
  attribution: NonEmptyStringSchema.optional(),
});

export const AnamnesisContentSchema = z.object({
  eyebrow: NonEmptyStringSchema,
  heading: NonEmptyStringSchema,
  intro: NonEmptyStringSchema,
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
