import { describe, expect, it } from 'vitest';
import { galleryContent } from '../../content/gallery';
import {
  GalleryCollectionSchema,
  GalleryContentSchema,
  GalleryCopySchema,
  GalleryItemSchema,
} from './gallery.schema';

describe('Gallery Schemas', () => {
  const validGalleryItem = {
    id: 'demo-gallery-01',
    image: '/images/demo/gallery-01.webp',
    date: '2024-05',
    title: 'Estudio de Imagen 1',
    finding: 'Hallazgo clínico descriptivo',
    caption: 'Epígrafe de la imagen',
    alt: 'Fotografía descriptiva de instrumental médico',
  };

  const validGalleryCopy = {
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
  };

  const requiredCopyKeys = Object.keys(validGalleryCopy) as Array<keyof typeof validGalleryCopy>;

  describe('GalleryItemSchema', () => {
    it('accepts a complete valid gallery item', () => {
      const result = GalleryItemSchema.parse(validGalleryItem);
      expect(result.id).toBe('demo-gallery-01');
      expect(result.alt).toBe('Fotografía descriptiva de instrumental médico');
    });

    it('requires non-empty alt text for accessibility', () => {
      expect(() =>
        GalleryItemSchema.parse({
          ...validGalleryItem,
          alt: '',
        })
      ).toThrow();

      expect(() =>
        GalleryItemSchema.parse({
          ...validGalleryItem,
          alt: '   ',
        })
      ).toThrow();
    });

    it('rejects invalid image path', () => {
      expect(() =>
        GalleryItemSchema.parse({
          ...validGalleryItem,
          image: '/wrong/path.png',
        })
      ).toThrow();
    });
  });

  describe('GalleryCollectionSchema', () => {
    it('accepts valid collection of gallery items', () => {
      const result = GalleryCollectionSchema.parse([
        validGalleryItem,
        {
          id: 'demo-gallery-02',
          image: '/images/demo/gallery-02.webp',
          title: 'Estudio 2',
          alt: 'Placa radiográfica de prueba',
        },
      ]);
      expect(result).toHaveLength(2);
    });

    it('rejects empty collection', () => {
      expect(() => GalleryCollectionSchema.parse([])).toThrow(/at least one item/);
    });

    it('rejects duplicate gallery item IDs', () => {
      const duplicate = [
        validGalleryItem,
        {
          ...validGalleryItem,
          title: 'Otro título con mismo ID',
        },
      ];
      expect(() => GalleryCollectionSchema.parse(duplicate)).toThrow(
        /Duplicate gallery item IDs are not allowed/
      );
    });

    describe('GalleryCopySchema and GalleryContentSchema', () => {
      it('accepts valid copy and a collection in the composite contract', () => {
        const result = GalleryContentSchema.parse({
          copy: validGalleryCopy,
          items: [validGalleryItem],
        });

        expect(result.copy).toEqual(validGalleryCopy);
        expect(result.items).toEqual([validGalleryItem]);
        expect(GalleryCopySchema.parse(validGalleryCopy)).toEqual(validGalleryCopy);
      });

      it.each(requiredCopyKeys)('rejects missing or empty "%s" copy', (key) => {
        const missingCopy: Record<string, unknown> = { ...validGalleryCopy };
        delete missingCopy[key];

        expect(() =>
          GalleryContentSchema.parse({ copy: missingCopy, items: [validGalleryItem] })
        ).toThrow();
        expect(() =>
          GalleryContentSchema.parse({
            copy: { ...validGalleryCopy, [key]: '   ' },
            items: [validGalleryItem],
          })
        ).toThrow();
      });

      it('keeps item validation delegated to GalleryCollectionSchema', () => {
        expect(() => GalleryContentSchema.parse({ copy: validGalleryCopy, items: [] })).toThrow(
          /at least one item/
        );

        expect(() =>
          GalleryContentSchema.parse({
            copy: validGalleryCopy,
            items: [validGalleryItem, validGalleryItem],
          })
        ).toThrow(/Duplicate gallery item IDs are not allowed/);
      });

      it('keeps the default fixture explicitly marked as demo content', () => {
        expect(galleryContent.items.length).toBeGreaterThan(0);
        expect(galleryContent.items.every((item) => item.id.startsWith('demo-gallery-'))).toBe(
          true
        );
        expect(galleryContent.items.every((item) => item.image.startsWith('/images/demo/'))).toBe(
          true
        );
      });
    });
  });
});
