import { describe, expect, it } from 'vitest';
import {
  achievementsContent,
  audioContent,
  bootContent,
  ContentValidationError,
  experienceContent,
  finaleContent,
  galleryContent,
  memoriesContent,
  profileContent,
  quizContent,
  rawExperienceContent,
  safeValidateExperienceContent,
  statsContent,
  teamContent,
  timelineContent,
  validateExperienceContent,
} from './index';

describe('Content Layer Central Validation & Modules', () => {
  it('loads and validates default experienceContent successfully', () => {
    expect(experienceContent).toBeDefined();
    expect(experienceContent.profile.firstName).toBe(profileContent.firstName);
    expect(experienceContent.timeline.length).toBe(timelineContent.length);
    expect(experienceContent.stats.length).toBe(statsContent.length);
    expect(experienceContent.gallery.items.length).toBe(galleryContent.items.length);
    expect(experienceContent.gallery.copy.heading).toBe(galleryContent.copy.heading);
    expect(experienceContent.team.length).toBe(teamContent.length);
    expect(experienceContent.memories.length).toBe(memoriesContent.length);
    expect(experienceContent.quiz.length).toBe(quizContent.length);
    expect(experienceContent.achievements.length).toBe(achievementsContent.length);
    expect(experienceContent.audio.length).toBe(audioContent.length);
    expect(experienceContent.finale.headline).toBe(finaleContent.headline);
  });

  it('validates all individual domain content fixtures', () => {
    expect(bootContent.heading).toBe('Inicio');
    expect(bootContent.isDemo).toBe(true);
    expect(profileContent.fullName).toBeDefined();
    expect(timelineContent.length).toBeGreaterThan(0);
    expect(statsContent.length).toBeGreaterThan(0);
    expect(galleryContent.items.length).toBeGreaterThan(0);
    expect(galleryContent.copy.heading).toBe('Galería');
    expect(teamContent.length).toBeGreaterThan(0);
    expect(memoriesContent.length).toBeGreaterThan(0);
    expect(quizContent.length).toBeGreaterThan(0);
    expect(achievementsContent.length).toBeGreaterThan(0);
    expect(audioContent.length).toBeGreaterThan(0);
    expect(finaleContent.headline).toBeDefined();
  });

  it('validateExperienceContent passes for valid raw input', () => {
    const validated = validateExperienceContent(rawExperienceContent);
    expect(validated.profile.startYear).toBe(2020);
  });

  it('validateExperienceContent passes when audio collection is empty', () => {
    const contentWithoutAudio = {
      ...rawExperienceContent,
      audio: [],
    };
    const validated = validateExperienceContent(contentWithoutAudio);
    expect(validated.audio).toEqual([]);
  });

  it('validateExperienceContent throws ContentValidationError on invalid input with descriptive errors', () => {
    const invalidInput = {
      ...rawExperienceContent,
      profile: {
        ...rawExperienceContent.profile,
        firstName: '', // invalid empty
      },
    };

    expect(() => validateExperienceContent(invalidInput)).toThrow(ContentValidationError);

    try {
      validateExperienceContent(invalidInput);
    } catch (err) {
      const customErr = err as ContentValidationError;
      expect(customErr.name).toBe('ContentValidationError');
      expect(customErr.message).toContain('Experience content validation failed');
      expect(customErr.message).toContain('profile.firstName');
      expect(customErr.issues.length).toBeGreaterThan(0);
    }
  });

  it('safeValidateExperienceContent returns success false on invalid data', () => {
    const invalidInput = {
      ...rawExperienceContent,
      stats: [], // invalid empty collection
    };

    const result = safeValidateExperienceContent(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('stats'))).toBe(true);
    }
  });

  it('safeValidateExperienceContent returns success true on valid data', () => {
    const result = safeValidateExperienceContent(rawExperienceContent);
    expect(result.success).toBe(true);
  });
});
