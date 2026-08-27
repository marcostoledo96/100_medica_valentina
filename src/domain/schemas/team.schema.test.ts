import { describe, expect, it } from 'vitest';
import { TeamCollectionSchema, TeamMemberSchema } from './team.schema';

describe('Team Member Schemas', () => {
  const validMember = {
    id: 'demo-team-01',
    name: 'Colega de Estudio',
    role: 'Soporte Académico',
    photo: '/images/demo/team-01.webp',
    message: 'Felicitaciones por recibirte de médica.',
  };

  describe('TeamMemberSchema', () => {
    it('accepts valid team member with optional photo', () => {
      const result = TeamMemberSchema.parse(validMember);
      expect(result.name).toBe('Colega de Estudio');
      expect(result.photo).toBe('/images/demo/team-01.webp');
    });

    it('accepts valid member without photo', () => {
      const memberWithoutPhoto = {
        id: 'demo-team-02',
        name: 'Familiar',
        role: 'Apoyo',
        message: 'Orgullo inmenso.',
      };
      const result = TeamMemberSchema.parse(memberWithoutPhoto);
      expect(result.photo).toBeUndefined();
    });

    it('rejects whitespace in name, role, or message', () => {
      expect(() => TeamMemberSchema.parse({ ...validMember, name: '  ' })).toThrow();
      expect(() => TeamMemberSchema.parse({ ...validMember, role: '' })).toThrow();
      expect(() => TeamMemberSchema.parse({ ...validMember, message: '   ' })).toThrow();
    });

    it('rejects invalid photo path when present', () => {
      expect(() =>
        TeamMemberSchema.parse({
          ...validMember,
          photo: 'https://example.com/avatar.jpg',
        })
      ).toThrow();
    });
  });

  describe('TeamCollectionSchema', () => {
    it('accepts valid collection of team members', () => {
      const collection = [
        validMember,
        {
          id: 'demo-team-02',
          name: 'Colega 2',
          role: 'Hospital',
          message: 'Excelente profesional.',
        },
      ];
      const result = TeamCollectionSchema.parse(collection);
      expect(result).toHaveLength(2);
    });

    it('rejects empty collection', () => {
      expect(() => TeamCollectionSchema.parse([])).toThrow(/at least one member/);
    });

    it('rejects duplicate member IDs', () => {
      const duplicate = [
        validMember,
        {
          ...validMember,
          name: 'Otro nombre con mismo ID',
        },
      ];
      expect(() => TeamCollectionSchema.parse(duplicate)).toThrow(
        /Duplicate team member IDs are not allowed/
      );
    });
  });
});
