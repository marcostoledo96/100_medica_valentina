import { TimelineCollection, TimelineCollectionSchema } from '../domain/schemas/timeline.schema';

export const rawTimelineContent = [
  {
    id: 'demo-stage-01',
    date: '2020-03',
    title: 'Hito Académico Demo 1',
    description: 'Contenido demo pendiente de reemplazo por información provista por el PO.',
    category: 'academic' as const,
    image: '/images/demo/timeline-01.webp',
    quote: 'Frase demo de inicio de cursada.',
  },
  {
    id: 'demo-stage-02',
    date: '2023-08',
    title: 'Hito Hospitalario Demo 2',
    description: 'Contenido demo pendiente de reemplazo por anécdota real.',
    category: 'hospital' as const,
    image: '/images/demo/timeline-02.webp',
  },
  {
    id: 'demo-stage-03',
    date: '2026-12',
    title: 'Hito Milestone Demo 3',
    description: 'Contenido demo pendiente de reemplazo para el hito final de graduación.',
    category: 'milestone' as const,
  },
];

export const timelineContent: TimelineCollection =
  TimelineCollectionSchema.parse(rawTimelineContent);
