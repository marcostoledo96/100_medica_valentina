import { z } from 'zod';
import { NonEmptyStringSchema } from './shared.schema';

export const ExpedienteContentSchema = z.object({
  eyebrow: NonEmptyStringSchema,
  heading: NonEmptyStringSchema,
  intro: NonEmptyStringSchema,
  completionLabel: NonEmptyStringSchema,
  completionAriaLabelPrefix: NonEmptyStringSchema,
  portraitAltPrefix: NonEmptyStringSchema,
  portraitFallbackAriaLabelPrefix: NonEmptyStringSchema,
  portraitUnavailableLabel: NonEmptyStringSchema,
  portraitCaptionPrefix: NonEmptyStringSchema,
  identityLabel: NonEmptyStringSchema,
  identityDescription: NonEmptyStringSchema,
  firstNameLabel: NonEmptyStringSchema,
  fullNameLabel: NonEmptyStringSchema,
  startYearLabel: NonEmptyStringSchema,
  graduationYearLabel: NonEmptyStringSchema,
  statusLabel: NonEmptyStringSchema,
  diagnosisLabel: NonEmptyStringSchema,
  prognosisLabel: NonEmptyStringSchema,
  footer: NonEmptyStringSchema,
  ctaLabel: NonEmptyStringSchema,
});

export type ExpedienteContent = z.infer<typeof ExpedienteContentSchema>;
