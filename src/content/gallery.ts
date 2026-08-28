import {
  GalleryCollection,
  GalleryContent,
  GalleryContentSchema,
  GalleryCopy,
} from '../domain/schemas/gallery.schema';

export const rawGalleryCopy = {
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

// Demo fixture: replace these items with authored gallery content when available.
export const rawGalleryItems = [
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

export const rawGalleryContent = {
  copy: rawGalleryCopy,
  items: rawGalleryItems,
};

export const galleryContent: GalleryContent = GalleryContentSchema.parse(rawGalleryContent);
export const galleryCopy: GalleryCopy = galleryContent.copy;
export const galleryItems: GalleryCollection = galleryContent.items;
