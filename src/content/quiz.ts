import { QuizCollection, QuizCollectionSchema } from '../domain/schemas/quiz.schema';

export const rawQuizContent = [
  {
    id: 'demo-quiz-01',
    prompt: '¿Cuál fue la bebida de supervivencia principal durante las guardias nocturnas?',
    options: [
      {
        id: 'opt-cafe-frio',
        label: 'Café de filtro recalentado',
        reaction: 'Diagnóstico acertado: combustible clásico del internado.',
      },
      {
        id: 'opt-mate-lavado',
        label: 'Mate lavado a las 4 AM',
        reaction: 'Compañero fiel de noches de estudio interminables.',
      },
      {
        id: 'opt-agua-mineral',
        label: 'Agua mineral con optimismo',
        reaction: 'Respetable pero insuficiente para 24 horas continuas.',
      },
    ],
  },
  {
    id: 'demo-quiz-02',
    prompt: '¿Qué elemento nunca podía faltar en el bolsillo del guardapolvo?',
    options: [
      {
        id: 'opt-lapiceras',
        label: 'Tres lapiceras de repuesto que terminan desapareciendo',
        reaction: 'Ley universal hospitalaria confirmada.',
      },
      {
        id: 'opt-estetoscopio',
        label: 'Estetoscopio siempre listo',
        reaction: 'Sello distintivo de la flamante profesional.',
      },
    ],
  },
];

export const quizContent: QuizCollection = QuizCollectionSchema.parse(rawQuizContent);
