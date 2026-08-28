import {
  ExpedienteContentSchema,
  type ExpedienteContent,
} from '../domain/schemas/expediente.schema';

export const rawExpedienteContent = {
  eyebrow: 'Registro de egreso · archivo de celebración',
  heading: 'Expediente',
  intro: 'Una ficha breve para celebrar el recorrido que ya está listo para seguir avanzando.',
  completionLabel: 'Completitud',
  completionAriaLabelPrefix: 'Completitud del expediente',
  portraitAltPrefix: 'Retrato ilustrado de',
  portraitFallbackAriaLabelPrefix: 'Iniciales de',
  portraitUnavailableLabel: 'Retrato no disponible',
  portraitCaptionPrefix: 'Retrato ilustrado · archivo de',
  identityLabel: 'Identificación celebrada',
  identityDescription:
    'La información esencial queda registrada como punto de partida para mirar la evolución.',
  firstNameLabel: 'Nombre de pila',
  fullNameLabel: 'Nombre completo',
  startYearLabel: 'Año de ingreso',
  graduationYearLabel: 'Año de egreso',
  statusLabel: 'Estado',
  diagnosisLabel: 'Diagnóstico',
  prognosisLabel: 'Pronóstico',
  footer: 'Expediente completo. La próxima página registra cómo fue cambiando esta historia.',
  ctaLabel: 'Ver evolución',
};

export const expedienteContent: ExpedienteContent =
  ExpedienteContentSchema.parse(rawExpedienteContent);
