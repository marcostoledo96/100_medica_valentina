import { AnamnesisContent, AnamnesisContentSchema } from '../domain/schemas/anamnesis.schema';

// Demo fixture (Issue #8): real anamnesis content is not confirmed yet. Every
// narrative statement below is an unmistakably provisional, editable draft that
// must be replaced with authored copy before the gift ships.
export const rawAnamnesisContent = {
  eyebrow: 'Anamnesis narrativa · puente provisional',
  heading: 'Anamnesis',
  intro:
    'Un puente narrativo provisional entre el expediente y la historia completa: estos borradores editables se reemplazarán con el relato confirmado.',
  blocks: [
    {
      id: 'demo-origen',
      title: 'Origen',
      body: 'Párrafo demo y editable sobre el origen de esta historia: todavía no hay hechos confirmados, así que este texto provisional espera el relato real.',
    },
    {
      id: 'demo-vocacion',
      title: 'Vocación',
      body: 'Borrador provisional sobre la vocación por la medicina: un texto demo y editable que se reemplazará cuando lleguen las palabras confirmadas.',
    },
  ],
  // Placeholder photo: reuses an existing demo asset so the rendered app
  // exercises the real photo path without referencing a missing file.
  photo: {
    src: '/images/demo/portrait.webp',
    alt: 'Retrato demo provisional de la protagonista, pendiente de reemplazo por la foto confirmada',
    width: 320,
    height: 400,
  },
  quote: {
    text: 'Frase provisional de demostración: este espacio guarda una cita confirmada cuando esté disponible.',
    attribution: 'Atribución provisional por confirmar',
  },
  photoFallbackLabel: 'Foto provisional no disponible',
  transitionLabel:
    'La historia sigue en orden cronológico: la línea de tiempo recoge la evolución.',
  ctaLabel: 'Continuar la historia',
};

export const anamnesisContent: AnamnesisContent = AnamnesisContentSchema.parse(rawAnamnesisContent);
