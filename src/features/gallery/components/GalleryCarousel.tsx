import type { MouseEvent as ReactMouseEvent } from 'react';
import type { GalleryCollection, GalleryCopy } from '../../../domain/types';
import { GalleryItemCard } from './GalleryItemCard';

type GalleryCarouselCopy = Pick<
  GalleryCopy,
  'carouselLabel' | 'openImage' | 'imageFallback' | 'findingLabel'
>;

export interface GalleryCarouselProps {
  readonly items: GalleryCollection;
  readonly copy: GalleryCarouselCopy;
  readonly failedImageIds: ReadonlySet<string>;
  readonly onOpen: (index: number, event: ReactMouseEvent<HTMLButtonElement>) => void;
  readonly onImageError: (itemId: string) => void;
}

export function GalleryCarousel({
  items,
  copy,
  failedImageIds,
  onOpen,
  onImageError,
}: GalleryCarouselProps) {
  return (
    <div className="gallery__carousel-shell">
      <ul
        className="gallery__carousel"
        data-testid="gallery-carousel"
        aria-label={copy.carouselLabel}
      >
        {items.map((item, index) => (
          <GalleryItemCard
            key={item.id}
            item={item}
            index={index}
            copy={copy}
            failed={failedImageIds.has(item.id)}
            onOpen={onOpen}
            onImageError={onImageError}
          />
        ))}
      </ul>
    </div>
  );
}
