import { ExperienceContent, ExperienceContentSchema } from '../domain/schemas/experience.schema';
import { ZodError } from 'zod';
import { rawProfileContent } from './profile';
import { rawTimelineContent } from './timeline';
import { rawStatsContent } from './stats';
import { rawGalleryContent } from './gallery';
import { rawTeamContent } from './team';
import { rawMemoriesContent } from './memories';
import { rawQuizContent } from './quiz';
import { rawAchievementsContent } from './achievements';
import { rawAudioContent } from './audio';
import { rawFinaleContent } from './finale';

export const rawExperienceContent = {
  profile: rawProfileContent,
  timeline: rawTimelineContent,
  stats: rawStatsContent,
  gallery: rawGalleryContent,
  team: rawTeamContent,
  memories: rawMemoriesContent,
  quiz: rawQuizContent,
  achievements: rawAchievementsContent,
  audio: rawAudioContent,
  finale: rawFinaleContent,
};

export class ContentValidationError extends Error {
  public readonly issues: ZodError['issues'];

  constructor(zodError: ZodError) {
    const formattedIssues = zodError.issues
      .map((issue) => `[${issue.path.join('.') || 'root'}]: ${issue.message}`)
      .join('\n  - ');

    super(`Experience content validation failed:\n  - ${formattedIssues}`);
    this.name = 'ContentValidationError';
    this.issues = zodError.issues;
  }
}

export function validateExperienceContent(data: unknown = rawExperienceContent): ExperienceContent {
  const result = ExperienceContentSchema.safeParse(data);
  if (!result.success) {
    throw new ContentValidationError(result.error);
  }
  return result.data;
}

export function safeValidateExperienceContent(data: unknown = rawExperienceContent) {
  return ExperienceContentSchema.safeParse(data);
}

export const experienceContent: ExperienceContent = validateExperienceContent(rawExperienceContent);

export { bootContent, rawBootContent } from './boot';
export { profileContent } from './profile';
export { timelineContent } from './timeline';
export { statsContent } from './stats';
export { galleryContent } from './gallery';
export { teamContent } from './team';
export { memoriesContent } from './memories';
export { quizContent } from './quiz';
export { achievementsContent } from './achievements';
export { audioContent } from './audio';
export { finaleContent } from './finale';
export {
  narrativeSections,
  type NarrativeSectionConfig,
  type NarrativeSectionId,
} from './sections';
