import { GalleryCollection, GalleryCollectionSchema } from '../domain/schemas/gallery.schema';

export const rawGalleryContent = [
  {
    id: 'demo-gallery-01',
    image: '/images/demo/gallery-01.webp',
    date: '2024-05',
    title: 'Estudio Complementario Demo 1',
    finding: 'Hallazgo clínico de prueba para card de estudio.',
    caption: 'Nota al pie descriptiva demo.',
    alt: 'Fotografía de muestra de instrumental de laboratorio médico.',
  },
  {
    id: 'demo-gallery-02',
    image: '/images/demo/gallery-02.webp',
    date: '2025-02',
    title: 'Estudio Complementario Demo 2',
    finding: 'Hallazgo radiológico simulado.',
    alt: 'Muestra de placa radiográfica ilustrativa.',
  },
];

export const galleryContent: GalleryCollection = GalleryCollectionSchema.parse(rawGalleryContent);
