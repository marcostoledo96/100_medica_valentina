import { useEffect, useMemo, useState } from 'react';
import {
  narrativeSections,
  type NarrativeSectionConfig,
  type NarrativeSectionId,
} from '../content/sections';

export const ACTIVE_SECTION_ROOT_MARGIN = '0px 0px -55% 0px';
export const ACTIVE_SECTION_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1] as const;

type OrderedSection = {
  readonly section: NarrativeSectionConfig;
  readonly index: number;
};

function sortSections(sections: readonly NarrativeSectionConfig[]): OrderedSection[] {
  return sections
    .map((section, index) => ({ section, index }))
    .sort((left, right) => left.section.order - right.section.order || left.index - right.index);
}

function readCurrentHash(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const hash = window.location.hash.slice(1);
  if (!hash) {
    return null;
  }

  try {
    return decodeURIComponent(hash);
  } catch {
    return hash;
  }
}

export function getInitialSectionId(sections: readonly NarrativeSectionConfig[]): string | null {
  const orderedSections = sortSections(sections);
  const currentHash = readCurrentHash();

  if (currentHash && orderedSections.some(({ section }) => section.id === currentHash)) {
    return currentHash;
  }

  return orderedSections[0]?.section.id ?? null;
}

export function useActiveSection(): NarrativeSectionId | null;
export function useActiveSection<Section extends NarrativeSectionConfig>(
  sections: readonly Section[]
): Section['id'] | null;
export function useActiveSection(
  sections: readonly NarrativeSectionConfig[] = narrativeSections
): string | null {
  const orderedSections = useMemo(() => sortSections(sections), [sections]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(() =>
    getInitialSectionId(sections)
  );

  useEffect(() => {
    if (orderedSections.length === 0 || typeof document === 'undefined') {
      return undefined;
    }

    const orderById = new Map(
      orderedSections.map(({ section }, index) => [section.id, index] as const)
    );
    const visibilityById = new Map<string, { isIntersecting: boolean; ratio: number }>();
    const initialHash = readCurrentHash();
    let pendingHashSectionId = initialHash && orderById.has(initialHash) ? initialHash : null;
    const handleHashChange = () => {
      const currentHash = readCurrentHash();
      if (!currentHash || !orderById.has(currentHash)) {
        return;
      }

      pendingHashSectionId = currentHash;
      visibilityById.clear();
      setActiveSectionId((currentActiveSection) =>
        currentActiveSection === currentHash ? currentActiveSection : currentHash
      );
    };

    window.addEventListener('hashchange', handleHashChange);

    if (typeof IntersectionObserver === 'undefined') {
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sectionId = (entry.target as HTMLElement).id;
          if (!orderById.has(sectionId)) {
            continue;
          }

          visibilityById.set(sectionId, {
            isIntersecting: entry.isIntersecting || entry.intersectionRatio > 0,
            ratio: Number.isFinite(entry.intersectionRatio) ? entry.intersectionRatio : 0,
          });
        }

        if (pendingHashSectionId) {
          const pendingVisibility = visibilityById.get(pendingHashSectionId);
          if (pendingVisibility?.isIntersecting) {
            const resolvedHashSectionId = pendingHashSectionId;
            pendingHashSectionId = null;
            setActiveSectionId((currentActiveSection) =>
              currentActiveSection === resolvedHashSectionId
                ? currentActiveSection
                : resolvedHashSectionId
            );
          }
          return;
        }

        const nextActiveSection = orderedSections
          .map(({ section }, index) => ({
            section,
            order: orderById.get(section.id) ?? index,
            visibility: visibilityById.get(section.id),
          }))
          .filter(({ visibility }) => visibility?.isIntersecting)
          .sort(
            (left, right) =>
              (right.visibility?.ratio ?? 0) - (left.visibility?.ratio ?? 0) ||
              left.order - right.order
          )[0]?.section.id;

        if (nextActiveSection) {
          setActiveSectionId((currentActiveSection) =>
            currentActiveSection === nextActiveSection ? currentActiveSection : nextActiveSection
          );
        }
      },
      {
        root: null,
        rootMargin: ACTIVE_SECTION_ROOT_MARGIN,
        threshold: [...ACTIVE_SECTION_THRESHOLDS],
      }
    );

    for (const { section } of orderedSections) {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [orderedSections]);

  return activeSectionId;
}
