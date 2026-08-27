import { Finale, FinaleSchema } from '../domain/schemas/finale.schema';

export const rawFinaleContent = {
  headline: '¡Felicitaciones Médica!',
  message: [
    'Hoy culmina una etapa de enorme esfuerzo, dedicación y vocación.',
    'Todo el camino recorrido rinde sus frutos y comienza una vida profesional brillante.',
  ],
  image: '/images/demo/finale.webp',
  imageAlt: 'Fotografía emotiva de festejo y celebración de graduación médica.',
  date: '2026-12-15',
};

export const finaleContent: Finale = FinaleSchema.parse(rawFinaleContent);
