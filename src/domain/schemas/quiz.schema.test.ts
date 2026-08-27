import { describe, expect, it } from 'vitest';
import { QuizCollectionSchema, QuizOptionSchema, QuizQuestionSchema } from './quiz.schema';

describe('Quiz Schemas', () => {
  const validOption1 = {
    id: 'opt-cafe',
    label: 'Café de filtro frío',
    reaction: 'Diagnóstico acertado: taquicardia inmediata.',
  };

  const validOption2 = {
    id: 'opt-mate',
    label: 'Mate lavado',
    reaction: 'Compañero de guardia.',
  };

  const validQuestion = {
    id: 'demo-quiz-01',
    prompt: '¿Cuál fue la bebida de supervivencia?',
    options: [validOption1, validOption2],
  };

  describe('QuizOptionSchema', () => {
    it('accepts valid quiz option', () => {
      const result = QuizOptionSchema.parse(validOption1);
      expect(result.id).toBe('opt-cafe');
    });

    it('rejects empty or whitespace label or reaction', () => {
      expect(() => QuizOptionSchema.parse({ ...validOption1, label: '' })).toThrow();
      expect(() => QuizOptionSchema.parse({ ...validOption1, reaction: '   ' })).toThrow();
    });
  });

  describe('QuizQuestionSchema', () => {
    it('accepts valid question with 2 or more options', () => {
      const result = QuizQuestionSchema.parse(validQuestion);
      expect(result.options).toHaveLength(2);
    });

    it('rejects question with fewer than 2 options', () => {
      expect(() =>
        QuizQuestionSchema.parse({
          ...validQuestion,
          options: [validOption1],
        })
      ).toThrow(/at least 2 options/);
    });

    it('rejects duplicate option IDs within the same question', () => {
      expect(() =>
        QuizQuestionSchema.parse({
          ...validQuestion,
          options: [validOption1, { ...validOption2, id: validOption1.id }],
        })
      ).toThrow(/Duplicate option IDs are not allowed within a question/);
    });
  });

  describe('QuizCollectionSchema', () => {
    it('accepts valid collection of quiz questions', () => {
      const collection = [
        validQuestion,
        {
          id: 'demo-quiz-02',
          prompt: 'Segunda pregunta?',
          options: [validOption1, validOption2],
        },
      ];
      const result = QuizCollectionSchema.parse(collection);
      expect(result).toHaveLength(2);
    });

    it('rejects empty quiz collection', () => {
      expect(() => QuizCollectionSchema.parse([])).toThrow(/at least one question/);
    });

    it('rejects duplicate question IDs in collection', () => {
      const duplicate = [
        validQuestion,
        {
          ...validQuestion,
          prompt: 'Pregunta con ID repetido',
        },
      ];
      expect(() => QuizCollectionSchema.parse(duplicate)).toThrow(
        /Duplicate quiz question IDs are not allowed/
      );
    });
  });
});
