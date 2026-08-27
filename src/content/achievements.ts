import {
  AchievementCollection,
  AchievementCollectionSchema,
} from '../domain/schemas/achievements.schema';

export const rawAchievementsContent = [
  {
    id: 'demo-achievement-01',
    title: 'Sobreviviente de Anatomía',
    description: 'Aprobó el primer gran filtro de la carrera con determinación inquebrantable.',
    icon: 'award',
    secret: false,
    trigger: 'view_timeline_stage_1',
  },
  {
    id: 'demo-achievement-02',
    title: 'Descifradora de Caligrafías',
    description: 'Logró leer indicaciones médicas complejas en menos de 5 segundos.',
    icon: 'eye',
    secret: false,
    trigger: 'complete_quiz',
  },
  {
    id: 'demo-achievement-03',
    title: 'Guardia Legendaria',
    description: 'Descubrió el easter egg del turno nocturno en el dashboard de signos vitales.',
    icon: 'moon',
    secret: true,
    trigger: 'tap_vitals_ecg_secret',
  },
];

export const achievementsContent: AchievementCollection =
  AchievementCollectionSchema.parse(rawAchievementsContent);
