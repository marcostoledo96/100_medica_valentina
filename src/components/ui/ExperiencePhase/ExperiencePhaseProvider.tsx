import React, { useState } from 'react';
import type { ExperiencePhase } from '../../../domain/types/phase';
import { ExperiencePhaseContext } from './ExperiencePhaseContext';

export interface ExperiencePhaseProviderProps {
  initialPhase?: ExperiencePhase;
  phase?: ExperiencePhase;
  onPhaseChange?: (phase: ExperiencePhase) => void;
  as?: 'div' | 'main' | 'section';
  className?: string;
  children: React.ReactNode;
}

export const ExperiencePhaseProvider: React.FC<ExperiencePhaseProviderProps> = ({
  initialPhase = 'clinical',
  phase: controlledPhase,
  onPhaseChange,
  as: Component = 'div',
  className = '',
  children,
}) => {
  const [internalPhase, setInternalPhase] = useState<ExperiencePhase>(initialPhase);

  const currentPhase = controlledPhase ?? internalPhase;

  const handleSetPhase = (newPhase: ExperiencePhase) => {
    if (controlledPhase === undefined) {
      setInternalPhase(newPhase);
    }
    onPhaseChange?.(newPhase);
  };

  const contextValue = {
    phase: currentPhase,
    setPhase: handleSetPhase,
  };

  return (
    <ExperiencePhaseContext.Provider value={contextValue}>
      <Component data-experience-phase={currentPhase} className={className}>
        {children}
      </Component>
    </ExperiencePhaseContext.Provider>
  );
};
