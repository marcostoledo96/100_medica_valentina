import { useCallback, useState } from 'react';
import { bootContent } from '../../content/boot';
import type { BootContent } from '../../domain/schemas/boot.schema';
import { BootScene, type BootSceneMode } from './components/BootScene';
import { persistIntroSeen, readIntroSeen, type BootStorage } from './bootPersistence';

export interface BootExperienceProps {
  readonly content?: BootContent;
  readonly nextHref?: string;
  readonly storage?: BootStorage;
}

export function BootExperience({ content = bootContent, nextHref, storage }: BootExperienceProps) {
  const [introSeen, setIntroSeen] = useState(() => readIntroSeen(storage));
  const [isReplaying, setIsReplaying] = useState(false);
  const mode: BootSceneMode = introSeen && !isReplaying ? 'revisit' : 'intro';
  const resolvedNextHref = nextHref ?? content.nextHref;

  const handleOpen = useCallback(() => {
    persistIntroSeen(storage);
    setIntroSeen(true);
    setIsReplaying(false);
  }, [storage]);

  const handleSkip = useCallback(() => {
    persistIntroSeen(storage);
    setIntroSeen(true);
    setIsReplaying(false);
  }, [storage]);

  const handleReplay = useCallback(() => {
    setIsReplaying(true);
  }, []);

  return (
    <BootScene
      content={content}
      mode={mode}
      nextHref={resolvedNextHref}
      onOpen={handleOpen}
      onSkip={handleSkip}
      onReplay={handleReplay}
    />
  );
}
