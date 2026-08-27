import { describe, expect, it } from 'vitest';
import { AchievementCollectionSchema, AchievementSchema } from './achievements.schema';

describe('Achievements Schemas', () => {
  const validAchievement = {
    id: 'demo-achievement-01',
    title: 'Sobreviviente de Anatomía',
    description: 'Aprobó el primer gran filtro de la carrera.',
    icon: 'award',
    secret: false,
    trigger: 'view_timeline_stage_1',
  };

  describe('AchievementSchema', () => {
    it('accepts valid achievement', () => {
      const result = AchievementSchema.parse(validAchievement);
      expect(result.id).toBe('demo-achievement-01');
      expect(result.secret).toBe(false);
    });

    it('rejects non-boolean secret flag or empty strings', () => {
      expect(() =>
        AchievementSchema.parse({
          ...validAchievement,
          secret: 'false',
        })
      ).toThrow();

      expect(() =>
        AchievementSchema.parse({
          ...validAchievement,
          title: '   ',
        })
      ).toThrow();
    });
  });

  describe('AchievementCollectionSchema', () => {
    it('accepts valid collection of achievements', () => {
      const collection = [
        validAchievement,
        {
          id: 'demo-achievement-02',
          title: 'Logro 2',
          description: 'Desc 2',
          icon: 'moon',
          secret: true,
          trigger: 'trigger_2',
        },
      ];
      const result = AchievementCollectionSchema.parse(collection);
      expect(result).toHaveLength(2);
    });

    it('rejects empty achievement collection', () => {
      expect(() => AchievementCollectionSchema.parse([])).toThrow(/at least one achievement/);
    });

    it('rejects duplicate achievement IDs', () => {
      const duplicate = [
        validAchievement,
        {
          ...validAchievement,
          title: 'Otro título con mismo ID',
        },
      ];
      expect(() => AchievementCollectionSchema.parse(duplicate)).toThrow(
        /Duplicate achievement IDs are not allowed/
      );
    });
  });
});
