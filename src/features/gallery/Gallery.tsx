import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { ExperiencePhaseContext } from '../../components/ui/ExperiencePhase/ExperiencePhaseContext';
import { galleryContent } from '../../content/gallery';
import type { GalleryCollection, GalleryContent, GalleryCopy } from '../../domain/types';
import { GalleryCarousel } from './components/GalleryCarousel';
import { GalleryLightbox } from './components/GalleryLightbox';
import './Gallery.css';

export interface GalleryProps {
  readonly content?: GalleryContent;
  readonly items?: GalleryCollection;
  readonly copy?: GalleryCopy;
}

export function Gallery({
  content = galleryContent,
  items = content.items,
  copy = content.copy,
}: GalleryProps) {
  const phaseContext = useContext(ExperiencePhaseContext);
  const phase = phaseContext?.phase ?? 'human';
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImageIds, setFailedImageIds] = useState<ReadonlySet<string>>(() => new Set());
  const [isOpen, setIsOpen] = useState(false);

  const activeItem = items[activeIndex] ?? items[0];
  const hasMultipleItems = items.length > 1;

  const handleImageError = useCallback((itemId: string) => {
    setFailedImageIds((currentIds) => {
      if (currentIds.has(itemId)) {
        return currentIds;
      }

      return new Set(currentIds).add(itemId);
    });
  }, []);

  const openLightbox = useCallback((index: number, event: ReactMouseEvent<HTMLButtonElement>) => {
    restoreFocusRef.current = event.currentTarget;
    shouldRestoreFocusRef.current = true;
    setActiveIndex(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (shouldRestoreFocusRef.current) {
        const elementToRestore = restoreFocusRef.current;
        shouldRestoreFocusRef.current = false;

        if (elementToRestore?.isConnected) {
          elementToRestore.focus({ preventScroll: true });
        } else {
          galleryRef.current?.querySelector<HTMLButtonElement>('[data-gallery-trigger]')?.focus({
            preventScroll: true,
          });
        }
      }

      return undefined;
    }

    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (hasMultipleItems) {
          setActiveIndex((currentIndex) => Math.max(0, currentIndex - 1));
        }
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (hasMultipleItems) {
          setActiveIndex((currentIndex) => Math.min(items.length - 1, currentIndex + 1));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox, items.length, hasMultipleItems, isOpen]);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') {
      return undefined;
    }

    const galleryElement = galleryRef.current;
    const phaseRoot =
      galleryElement?.parentElement?.closest<HTMLElement>('[data-experience-phase]');
    const candidate = phaseRoot ?? galleryElement?.parentElement ?? galleryElement;
    const background =
      candidate === document.body || candidate === document.documentElement
        ? galleryElement
        : candidate;
    const previousAriaHidden = background?.getAttribute('aria-hidden') ?? null;
    const previousInert = background?.getAttribute('inert') ?? null;
    const previousOverflow = document.body.style.overflow;

    background?.setAttribute('aria-hidden', 'true');
    background?.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';

    return () => {
      if (background) {
        if (previousAriaHidden === null) {
          background.removeAttribute('aria-hidden');
        } else {
          background.setAttribute('aria-hidden', previousAriaHidden);
        }

        if (previousInert === null) {
          background.removeAttribute('inert');
        } else {
          background.setAttribute('inert', previousInert);
        }
      }

      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!activeItem && items.length === 0) {
    return null;
  }

  return (
    <div ref={galleryRef} className="gallery" data-testid="gallery" data-gallery-phase={phase}>
      <header className="gallery__header">
        <p className="gallery__eyebrow">{copy.eyebrow}</p>
        <h2 id="galeria-heading" className="gallery__heading">
          {copy.heading}
        </h2>
        <p className="gallery__intro">{copy.intro}</p>
      </header>

      <GalleryCarousel
        items={items}
        copy={copy}
        failedImageIds={failedImageIds}
        onOpen={openLightbox}
        onImageError={handleImageError}
      />

      <p className="gallery__instruction">{copy.instruction}</p>

      {isOpen && activeItem ? (
        <GalleryLightbox
          item={activeItem}
          activeIndex={activeIndex}
          itemCount={items.length}
          phase={phase}
          copy={copy}
          failed={failedImageIds.has(activeItem.id)}
          onClose={closeLightbox}
          onPrevious={() => setActiveIndex((currentIndex) => Math.max(0, currentIndex - 1))}
          onNext={() =>
            setActiveIndex((currentIndex) => Math.min(items.length - 1, currentIndex + 1))
          }
          onImageError={handleImageError}
        />
      ) : null}
    </div>
  );
}
