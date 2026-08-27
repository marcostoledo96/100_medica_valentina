import { MemoryCollection, MemoryCollectionSchema } from '../domain/schemas/memories.schema';

export const rawMemoriesContent = [
  {
    id: 'demo-memory-photo-01',
    type: 'photo' as const,
    src: '/images/demo/memory-photo-01.webp',
    alt: 'Fotografía de recuerdo de cursada en aula universitaria.',
    date: '2021-11',
    rotation: -2,
  },
  {
    id: 'demo-memory-note-01',
    type: 'note' as const,
    text: 'Nota adhesiva demo: Repasar farmacología y semio antes del viernes.',
    date: '2022-04',
    rotation: 1,
  },
  {
    id: 'demo-memory-screenshot-01',
    type: 'screenshot' as const,
    src: '/images/demo/memory-screen-01.webp',
    alt: 'Captura de pantalla de chat demo coordinando grupo de estudio.',
    date: '2023-09',
    rotation: -1,
  },
  {
    id: 'demo-memory-text-01',
    type: 'text' as const,
    text: 'Recuerdo textual demo sobre anécdotas de guardia y guardapolvos olvidados.',
    date: '2024-02',
  },
  {
    id: 'demo-memory-sticker-01',
    type: 'sticker' as const,
    src: '/images/demo/sticker-01.webp',
    alt: 'Sticker ilustrativo con forma de estetoscopio.',
    rotation: 3,
  },
];

export const memoriesContent: MemoryCollection = MemoryCollectionSchema.parse(rawMemoriesContent);
