import { z } from 'zod';
import { LocalImagePathSchema, NonEmptyStringSchema } from './shared.schema';

export const ProfileSchema = z
  .object({
    firstName: NonEmptyStringSchema,
    fullName: NonEmptyStringSchema,
    startYear: z
      .number()
      .int()
      .min(1900, 'Start year must be at least 1900')
      .max(2100, 'Start year must be at most 2100'),
    graduationYear: z
      .number()
      .int()
      .min(1900, 'Graduation year must be at least 1900')
      .max(2100, 'Graduation year must be at most 2100'),
    portrait: LocalImagePathSchema,
    status: NonEmptyStringSchema,
    diagnosis: NonEmptyStringSchema,
    prognosis: NonEmptyStringSchema,
  })
  .refine((data) => data.graduationYear >= data.startYear, {
    message: 'graduationYear must be greater than or equal to startYear',
    path: ['graduationYear'],
  });

export type Profile = z.infer<typeof ProfileSchema>;
