import { z } from 'zod';
import {
  hasUniqueIds,
  IdSchema,
  LocalImagePathSchema,
  NonEmptyStringSchema,
} from './shared.schema';

export const TeamMemberSchema = z.object({
  id: IdSchema,
  name: NonEmptyStringSchema,
  role: NonEmptyStringSchema,
  photo: LocalImagePathSchema.optional(),
  message: NonEmptyStringSchema,
});

export const TeamCollectionSchema = z
  .array(TeamMemberSchema)
  .min(1, 'Team collection must contain at least one member')
  .refine(hasUniqueIds, {
    message: 'Duplicate team member IDs are not allowed',
  });

export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type TeamCollection = z.infer<typeof TeamCollectionSchema>;
