import { createPortal } from 'react-dom';
import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ExperiencePhase, GalleryCopy, GalleryItem } from '../../../domain/types';
import { GalleryImage } from './GalleryImage';

type GalleryLightboxCopy = Pick<
  GalleryCopy,
  'imageFallback' | 'dialogEyebrow' | 'close' | 'previous' | 'next'
>;

export interface GalleryLightboxProps {
  readonly item: GalleryItem;
  readonly activeIndex: number;
  readonly itemCount: number;
  readonly phase: ExperiencePhase;
  readonly copy: GalleryLightboxCopy;
  readonly failed: boolean;
  readonly onClose: () => void;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onImageError: (itemId: string) => void;
}

const focusableSelector =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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

export function GalleryLightbox({
  item,
  activeIndex,
  itemCount,
  phase,
  copy,
  failed,
  onClose,
  onPrevious,
  onNext,
  onImageError,
}: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const hasMultipleItems = itemCount > 1;

  useEffect(() => {
    closeButtonRef.current?.focus({ preventScroll: true });
  }, []);

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
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
  };

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="gallery-lightbox" data-gallery-lightbox data-experience-phase={phase}>
      <div
        className="gallery-lightbox__backdrop"
        data-gallery-backdrop
        aria-hidden="true"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      />
      <div
        ref={dialogRef}
        id="gallery-lightbox"
        className="gallery-lightbox__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`gallery-dialog-title-${item.id}`}
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
        data-gallery-current-id={item.id}
      >
        <div className="gallery-lightbox__header">
          <p className="gallery-lightbox__eyebrow">{copy.dialogEyebrow}</p>
          <button
            ref={closeButtonRef}
            type="button"
            className="gallery-lightbox__close"
            aria-label={copy.close}
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="gallery-lightbox__media">
          <button
            type="button"
            className="gallery-lightbox__control gallery-lightbox__control--previous"
            aria-label={copy.previous}
            disabled={!hasMultipleItems || activeIndex === 0}
            onClick={onPrevious}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <div className="gallery-lightbox__image-frame">
            <GalleryImage
              item={item}
              failed={failed}
              modal
              fallbackLabel={copy.imageFallback}
              onError={onImageError}
            />
          </div>
          <button
            type="button"
            className="gallery-lightbox__control gallery-lightbox__control--next"
            aria-label={copy.next}
            disabled={!hasMultipleItems || activeIndex === itemCount - 1}
            onClick={onNext}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className="gallery-lightbox__details" aria-live="polite" aria-atomic="true">
          <h2 id={`gallery-dialog-title-${item.id}`}>{item.title}</h2>
          {item.date && <time dateTime={item.date}>{item.date}</time>}
          {item.finding && <p>{item.finding}</p>}
          {item.caption && <p>{item.caption}</p>}
        </div>
      </div>
    </div>,
    document.body
  );
}
