import type { ExperiencePhase } from '../domain/types/phase';

export interface NarrativeSectionConfig {
  readonly id: string;
  readonly label: string;
  readonly phase: ExperiencePhase;
  readonly order: number;
}

type StaticNarrativeSectionConfig = NarrativeSectionConfig & {
  readonly id:
    | 'inicio'
    | 'expediente'
    | 'signos-vitales'
    | 'linea-tiempo'
    | 'galeria'
    | 'equipo-tratante'
    | 'final';
  readonly order: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

export const narrativeSections = [
  { id: 'inicio', label: 'Inicio', phase: 'clinical', order: 0 },
  { id: 'expediente', label: 'Expediente', phase: 'clinical', order: 1 },
  { id: 'signos-vitales', label: 'Signos vitales', phase: 'clinical', order: 2 },
  { id: 'linea-tiempo', label: 'Línea de tiempo', phase: 'human', order: 3 },
  { id: 'galeria', label: 'Galería', phase: 'human', order: 4 },
  { id: 'equipo-tratante', label: 'Equipo tratante', phase: 'human', order: 5 },
  { id: 'final', label: 'Final', phase: 'finale', order: 6 },
] as const satisfies readonly StaticNarrativeSectionConfig[];

export type NarrativeSectionId = (typeof narrativeSections)[number]['id'];
