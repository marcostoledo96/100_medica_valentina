import { AudioCollection, AudioCollectionSchema } from '../domain/schemas/audio.schema';

export const rawAudioContent = [
  {
    id: 'demo-audio-01',
    author: 'Amigo de la Carrera Demo',
    title: 'Mensaje de felicitaciones y anécdotas de guardia',
    src: '/audio/demo/audio-01.mp3',
    duration: 25,
  },
  {
    id: 'demo-audio-02',
    author: 'Familia Demo',
    title: 'Saludo emotivo de egreso',
    src: '/audio/demo/audio-02.m4a',
    duration: 40,
  },
];

export const audioContent: AudioCollection = AudioCollectionSchema.parse(rawAudioContent);
