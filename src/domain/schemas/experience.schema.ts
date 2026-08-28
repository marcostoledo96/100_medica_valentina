import { z } from 'zod';
import { ProfileSchema } from './profile.schema';
import { AnamnesisContentSchema } from './anamnesis.schema';
import { TimelineCollectionSchema } from './timeline.schema';
import { StatCollectionSchema } from './stats.schema';
import { GalleryContentSchema } from './gallery.schema';
import { TeamContentSchema } from './team.schema';
import { MemoryCollectionSchema } from './memories.schema';
import { QuizCollectionSchema } from './quiz.schema';
import { AchievementCollectionSchema } from './achievements.schema';
import { AudioCollectionSchema } from './audio.schema';
import { FinaleSchema } from './finale.schema';

export const ExperienceContentSchema = z.object({
  profile: ProfileSchema,
  anamnesis: AnamnesisContentSchema,
  timeline: TimelineCollectionSchema,
  stats: StatCollectionSchema,
  gallery: GalleryContentSchema,
  team: TeamContentSchema,
  memories: MemoryCollectionSchema,
  quiz: QuizCollectionSchema,
  achievements: AchievementCollectionSchema,
  audio: AudioCollectionSchema,
  finale: FinaleSchema,
});

export type ExperienceContent = z.infer<typeof ExperienceContentSchema>;
