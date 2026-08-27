import { describe, expect, it } from 'vitest';
import { ProfileSchema } from './profile.schema';

describe('ProfileSchema', () => {
  const validProfile = {
    firstName: 'Demo',
    fullName: 'Demo Persona',
    startYear: 2020,
    graduationYear: 2026,
    portrait: '/images/demo/portrait.webp',
    status: 'ALTA DEFINITIVA DEMO',
    diagnosis: 'MÉDICA DEMO',
    prognosis: 'FUTURO BRILLANTE DEMO',
  };

  it('accepts a valid profile object', () => {
    const result = ProfileSchema.parse(validProfile);
    expect(result.firstName).toBe('Demo');
    expect(result.graduationYear).toBe(2026);
  });

  it('rejects empty or whitespace-only string fields', () => {
    expect(() => ProfileSchema.parse({ ...validProfile, firstName: '  ' })).toThrow();
    expect(() => ProfileSchema.parse({ ...validProfile, fullName: '' })).toThrow();
    expect(() => ProfileSchema.parse({ ...validProfile, status: ' \t ' })).toThrow();
    expect(() => ProfileSchema.parse({ ...validProfile, diagnosis: '' })).toThrow();
    expect(() => ProfileSchema.parse({ ...validProfile, prognosis: '' })).toThrow();
  });

  it('rejects startYear and graduationYear outside reasonable bounds (1900-2100)', () => {
    expect(() => ProfileSchema.parse({ ...validProfile, startYear: 1850 })).toThrow();
    expect(() => ProfileSchema.parse({ ...validProfile, graduationYear: 2150 })).toThrow();
  });

  it('rejects graduationYear prior to startYear', () => {
    expect(() =>
      ProfileSchema.parse({
        ...validProfile,
        startYear: 2026,
        graduationYear: 2020,
      })
    ).toThrow(/graduationYear must be greater than or equal to startYear/);
  });

  it('rejects invalid portrait image paths', () => {
    expect(() =>
      ProfileSchema.parse({ ...validProfile, portrait: 'https://example.com/pic.jpg' })
    ).toThrow();
    expect(() => ProfileSchema.parse({ ...validProfile, portrait: '/images/pic.txt' })).toThrow();
  });
});
