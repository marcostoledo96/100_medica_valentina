import { TeamCollection, TeamCollectionSchema } from '../domain/schemas/team.schema';

export const rawTeamContent = [
  {
    id: 'demo-team-01',
    name: 'Colega de Estudio Demo',
    role: 'Soporte Académico y Guardias',
    photo: '/images/demo/team-01.webp',
    message: 'Mensaje de apoyo y felicitaciones por este gran logro profesional.',
  },
  {
    id: 'demo-team-02',
    name: 'Familiar Demo',
    role: 'Apoyo Incondicional',
    photo: '/images/demo/team-02.webp',
    message: 'Orgullo inmenso por todo el esfuerzo y la dedicación durante estos años.',
  },
];

export const teamContent: TeamCollection = TeamCollectionSchema.parse(rawTeamContent);
