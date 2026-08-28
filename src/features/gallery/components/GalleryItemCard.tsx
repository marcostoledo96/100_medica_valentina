import type { MouseEvent as ReactMouseEvent } from 'react';
import type { GalleryCopy, GalleryItem } from '../../../domain/types';
import { GalleryImage } from './GalleryImage';

type GalleryItemCardCopy = Pick<GalleryCopy, 'openImage' | 'imageFallback' | 'findingLabel'>;

export interface GalleryItemCardProps {
  readonly item: GalleryItem;
  readonly index: number;
  readonly copy: GalleryItemCardCopy;
  readonly failed: boolean;
  readonly onOpen: (index: number, event: ReactMouseEvent<HTMLButtonElement>) => void;
  readonly onImageError: (itemId: string) => void;
}

export function GalleryItemCard({
  item,
  index,
  copy,
  failed,
  onOpen,
  onImageError,
}: GalleryItemCardProps) {
  return (
    <li className="gallery__slide" data-gallery-slide={item.id}>
      <article className="gallery__card">
        <button
          type="button"
          className="gallery__trigger"
          aria-label={`${copy.openImage}: ${item.title}`}
          aria-haspopup="dialog"
          aria-controls="gallery-lightbox"
          data-gallery-trigger={item.id}
          data-testid={`gallery-trigger-${item.id}`}
          onClick={(event) => onOpen(index, event)}
        >
          <span className="gallery__image-frame">
            <GalleryImage
              item={item}
              failed={failed}
              fallbackLabel={copy.imageFallback}
              onError={onImageError}
            />
            <span className="gallery__trigger-hint" aria-hidden="true">
              {copy.openImage}
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
              <span className="gallery__field-label">{copy.findingLabel}</span>
              {item.finding}
            </p>
          )}
          {item.caption && <p className="gallery__caption">{item.caption}</p>}
        </div>
      </article>
    </li>
  );
}
