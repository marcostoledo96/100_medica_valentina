import { createPortal } from 'react-dom';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { ExperiencePhaseContext } from '../../components/ui/ExperiencePhase/ExperiencePhaseContext';
import { galleryContent } from '../../content/gallery';
import type { GalleryCollection, GalleryItem } from '../../domain/types';
import './Gallery.css';

const galleryCopy = {
  eyebrow: 'Estudios complementarios',
  heading: 'Galería',
  intro: 'Una pausa visual para registrar las pequeñas pruebas de todo el recorrido.',
  carouselLabel: 'Estudios complementarios',
  instruction: 'Deslizá para explorar. Tocá una imagen para verla en detalle.',
  openImage: 'Abrir imagen',
  imageFallback: 'Imagen no disponible',
  findingLabel: 'Hallazgo',
  dialogEyebrow: 'Vista ampliada',
  close: 'Cerrar galería',
  previous: 'Imagen anterior',
  next: 'Imagen siguiente',
  compatibilityPlaceholder: 'Contenido estructural de demostración.',
} as const;

const focusableSelector =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface GalleryProps {
  readonly content?: GalleryCollection;
}

interface GalleryImageProps {
  readonly item: GalleryItem;
  readonly failed: boolean;
  readonly modal?: boolean;
  readonly onError: (itemId: string) => void;
}

function GalleryImage({ item, failed, modal = false, onError }: GalleryImageProps) {
  if (failed) {
    return (
      <div
        className="gallery__image-fallback"
        role="img"
        aria-label={item.alt}
        data-gallery-image-fallback={item.id}
        data-testid={`gallery-image-fallback-${item.id}`}
      >
        <span className="gallery__fallback-mark" aria-hidden="true">
          ◌
        </span>
        <span>{galleryCopy.imageFallback}</span>
      </div>
    );
  }

  return (
    <img
      className="gallery__image"
      src={item.image}
      alt={item.alt}
      loading={modal ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => onError(item.id)}
    />
  );
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => {
      const styles = window.getComputedStyle(element);
      return (
        styles.display !== 'none' &&
        styles.visibility !== 'hidden' &&
        !element.hasAttribute('aria-hidden')
      );
    }
  );
}

export function Gallery({ content = galleryContent }: GalleryProps) {
  const phaseContext = useContext(ExperiencePhaseContext);
  const phase = phaseContext?.phase ?? 'human';
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImageIds, setFailedImageIds] = useState<ReadonlySet<string>>(() => new Set());
  const [isOpen, setIsOpen] = useState(false);

  const activeItem = content[activeIndex] ?? content[0];
  const hasMultipleItems = content.length > 1;

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

  const handleDialogKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') {
      return;
    }

    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const focusableElements = getFocusableElements(dialog);
    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const currentElement = document.activeElement;

    if (!dialog.contains(currentElement)) {
      event.preventDefault();
      firstElement?.focus();
      return;
    }

    if (event.shiftKey && currentElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && currentElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
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

    closeButtonRef.current?.focus({ preventScroll: true });
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
          setActiveIndex((currentIndex) => Math.min(content.length - 1, currentIndex + 1));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox, content.length, hasMultipleItems, isOpen]);

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

  if (!activeItem && content.length === 0) {
    return null;
  }

  return (
    <div ref={galleryRef} className="gallery" data-testid="gallery" data-gallery-phase={phase}>
      <p className="sr-only" aria-hidden="true">
        {galleryCopy.compatibilityPlaceholder}
      </p>

      <header className="gallery__header">
        <p className="gallery__eyebrow">{galleryCopy.eyebrow}</p>
        <h2 id="galeria-heading" className="gallery__heading">
          {galleryCopy.heading}
        </h2>
        <p className="gallery__intro">{galleryCopy.intro}</p>
      </header>

      <div className="gallery__carousel-shell">
        <ul
          className="gallery__carousel"
          data-testid="gallery-carousel"
          aria-label={galleryCopy.carouselLabel}
        >
          {content.map((item, index) => (
            <li key={item.id} className="gallery__slide" data-gallery-slide={item.id}>
              <article className="gallery__card">
                <button
                  type="button"
                  className="gallery__trigger"
                  aria-label={`${galleryCopy.openImage}: ${item.title}`}
                  aria-haspopup="dialog"
                  aria-controls="gallery-lightbox"
                  data-gallery-trigger={item.id}
                  data-testid={`gallery-trigger-${item.id}`}
                  onClick={(event) => openLightbox(index, event)}
                >
                  <span className="gallery__image-frame">
                    <GalleryImage
                      item={item}
                      failed={failedImageIds.has(item.id)}
                      onError={handleImageError}
                    />
                    <span className="gallery__trigger-hint" aria-hidden="true">
                      {galleryCopy.openImage}
                    </span>
                  </span>
                </button>

                <div className="gallery__metadata">
                  {item.date && (
                    <time className="gallery__date" dateTime={item.date}>
                      {item.date}
                    </time>
                  )}
                  <h3 className="gallery__title">{item.title}</h3>
                  {item.finding && (
                    <p className="gallery__finding">
                      <span className="gallery__field-label">{galleryCopy.findingLabel}</span>
                      {item.finding}
                    </p>
                  )}
                  {item.caption && <p className="gallery__caption">{item.caption}</p>}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <p className="gallery__instruction">{galleryCopy.instruction}</p>

      {isOpen && activeItem && typeof document !== 'undefined'
        ? createPortal(
            <div className="gallery-lightbox" data-gallery-lightbox data-experience-phase={phase}>
              <div
                className="gallery-lightbox__backdrop"
                data-gallery-backdrop
                aria-hidden="true"
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    closeLightbox();
                  }
                }}
              />
              <div
                ref={dialogRef}
                id="gallery-lightbox"
                className="gallery-lightbox__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={`gallery-dialog-title-${activeItem.id}`}
                tabIndex={-1}
                onKeyDown={handleDialogKeyDown}
                data-gallery-current-id={activeItem.id}
              >
                <div className="gallery-lightbox__header">
                  <p className="gallery-lightbox__eyebrow">{galleryCopy.dialogEyebrow}</p>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    className="gallery-lightbox__close"
                    aria-label={galleryCopy.close}
                    onClick={closeLightbox}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                <div className="gallery-lightbox__media">
                  <button
                    type="button"
                    className="gallery-lightbox__control gallery-lightbox__control--previous"
                    aria-label={galleryCopy.previous}
                    disabled={!hasMultipleItems || activeIndex === 0}
                    onClick={() => setActiveIndex((currentIndex) => Math.max(0, currentIndex - 1))}
                  >
                    <span aria-hidden="true">‹</span>
                  </button>
                  <div className="gallery-lightbox__image-frame">
                    <GalleryImage
                      item={activeItem}
                      failed={failedImageIds.has(activeItem.id)}
                      modal
                      onError={handleImageError}
                    />
                  </div>
                  <button
                    type="button"
                    className="gallery-lightbox__control gallery-lightbox__control--next"
                    aria-label={galleryCopy.next}
                    disabled={!hasMultipleItems || activeIndex === content.length - 1}
                    onClick={() =>
                      setActiveIndex((currentIndex) =>
                        Math.min(content.length - 1, currentIndex + 1)
                      )
                    }
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                </div>

                <div className="gallery-lightbox__details" aria-live="polite" aria-atomic="true">
                  <h2 id={`gallery-dialog-title-${activeItem.id}`}>{activeItem.title}</h2>
                  {activeItem.date && <time dateTime={activeItem.date}>{activeItem.date}</time>}
                  {activeItem.finding && <p>{activeItem.finding}</p>}
                  {activeItem.caption && <p>{activeItem.caption}</p>}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
