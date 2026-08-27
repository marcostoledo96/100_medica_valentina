import { useContext } from 'react';
import {
  ExperiencePhaseContext,
  type ExperiencePhaseContextValue,
} from '../components/ui/ExperiencePhase/ExperiencePhaseContext';

export function useExperiencePhase(): ExperiencePhaseContextValue {
  const context = useContext(ExperiencePhaseContext);

  if (!context) {
    throw new Error('useExperiencePhase must be used within an ExperiencePhaseProvider');
  }

  return context;
}
