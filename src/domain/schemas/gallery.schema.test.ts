import { describe, expect, it } from 'vitest';
import { GalleryCollectionSchema, GalleryItemSchema } from './gallery.schema';

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
  });
});
