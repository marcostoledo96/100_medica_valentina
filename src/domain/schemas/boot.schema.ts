import { z } from 'zod';
import { NonEmptyStringSchema } from './shared.schema';

const BootScanCopySchema = z.object({
  search: NonEmptyStringSchema,
  match: NonEmptyStringSchema,
  ready: NonEmptyStringSchema,
});

const BootDetailSchema = z.object({
  label: NonEmptyStringSchema,
  value: NonEmptyStringSchema,
});

export const BootContentSchema = z.object({
  isDemo: z.literal(true),
  eyebrow: NonEmptyStringSchema,
  heading: NonEmptyStringSchema,
  intro: NonEmptyStringSchema,
  scan: BootScanCopySchema,
  identity: BootDetailSchema,
  status: BootDetailSchema,
  primaryAction: NonEmptyStringSchema,
  skipAction: NonEmptyStringSchema,
  replayAction: NonEmptyStringSchema,
  revisitMessage: NonEmptyStringSchema,
  demoNotice: NonEmptyStringSchema,
  nextHref: NonEmptyStringSchema,
});

export type BootContent = z.infer<typeof BootContentSchema>;
