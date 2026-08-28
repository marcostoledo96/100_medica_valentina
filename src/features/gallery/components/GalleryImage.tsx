import type { GalleryItem } from '../../../domain/types';

export interface GalleryImageProps {
  readonly item: GalleryItem;
  readonly failed: boolean;
  readonly modal?: boolean;
  readonly fallbackLabel: string;
  readonly onError: (itemId: string) => void;
}

export function GalleryImage({
  item,
  failed,
  modal = false,
  fallbackLabel,
  onError,
}: GalleryImageProps) {
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
        <span>{fallbackLabel}</span>
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
