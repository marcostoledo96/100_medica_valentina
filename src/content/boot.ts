import { BootContent, BootContentSchema } from '../domain/schemas/boot.schema';
import { profileContent } from './profile';

export const rawBootContent = {
  isDemo: true as const,
  eyebrow: 'PROTOCOLO DE INGRESO · DEMO',
  heading: 'Inicio',
  intro: 'Una revisión breve prepara el acceso al expediente.',
  scan: {
    search: 'Buscando expediente',
    match: 'Coincidencia encontrada',
    ready: 'Expediente listo',
  },
  identity: {
    label: 'Identidad',
    value: profileContent.fullName,
  },
  status: {
    label: 'Estado del expediente',
    value: profileContent.status,
  },
  primaryAction: 'Abrir expediente',
  skipAction: 'Saltar intro',
  replayAction: 'Reproducir introducción',
  revisitMessage: 'Este acceso ya fue revisado. El expediente está disponible.',
  demoNotice: 'Contenido de demostración; identidad y estado son ficticios.',
  nextHref: '#expediente',
};

export const bootContent: BootContent = BootContentSchema.parse(rawBootContent);
