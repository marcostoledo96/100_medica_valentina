import { z } from 'zod';
import { hasUniqueIds, IdSchema, NonEmptyStringSchema } from './shared.schema';

export const QuizOptionSchema = z.object({
  id: IdSchema,
  label: NonEmptyStringSchema,
  reaction: NonEmptyStringSchema,
});

export const QuizQuestionSchema = z.object({
  id: IdSchema,
  prompt: NonEmptyStringSchema,
  options: z
    .array(QuizOptionSchema)
    .min(2, 'A quiz question must have at least 2 options')
    .refine(hasUniqueIds, {
      message: 'Duplicate option IDs are not allowed within a question',
    }),
});

export const QuizCollectionSchema = z
  .array(QuizQuestionSchema)
  .min(1, 'Quiz collection must contain at least one question')
  .refine(hasUniqueIds, {
    message: 'Duplicate quiz question IDs are not allowed',
  });

export type QuizOption = z.infer<typeof QuizOptionSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type QuizCollection = z.infer<typeof QuizCollectionSchema>;
