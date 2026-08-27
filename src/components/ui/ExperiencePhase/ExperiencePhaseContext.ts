import { createContext } from 'react';
import type { ExperiencePhase } from '../../../domain/types/phase';

export interface ExperiencePhaseContextValue {
  phase: ExperiencePhase;
  setPhase: (phase: ExperiencePhase) => void;
}

export const ExperiencePhaseContext = createContext<ExperiencePhaseContextValue | null>(null);
