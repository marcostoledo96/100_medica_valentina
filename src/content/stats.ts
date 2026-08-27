import { StatCollection, StatCollectionSchema } from '../domain/schemas/stats.schema';

export const rawStatsContent = [
  {
    id: 'demo-stat-01',
    label: 'Horas de Guardia Simuladas',
    value: 1200,
    unit: 'hs',
    format: 'number' as const,
    note: 'Métrica de prueba para visualización de estadísticas.',
    humorous: false,
  },
  {
    id: 'demo-stat-02',
    label: 'Nivel de Cafeína Estimado',
    value: '99.9%',
    format: 'percentage' as const,
    note: 'Dato cómico demostrativo.',
    humorous: true,
  },
  {
    id: 'demo-stat-03',
    label: 'Materias Aprobadas',
    value: 100,
    unit: '%',
    format: 'progress' as const,
    humorous: false,
  },
];

export const statsContent: StatCollection = StatCollectionSchema.parse(rawStatsContent);
