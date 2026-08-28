import {
  TeamCollection,
  TeamContent,
  TeamContentSchema,
  TeamCopy,
} from '../domain/schemas/team.schema';

export const rawTeamCopy = {
  eyebrow: 'Red de apoyo · archivo humano',
  heading: 'Equipo tratante',
  intro:
    'Una ficha provisional para reunir, cuando estén confirmados, los nombres, roles y mensajes de quienes acompañaron este recorrido.',
  listLabel: 'Personas del equipo tratante',
  roleLabel: 'Rol',
  messageLabel: 'Mensaje',
  photoAltPrefix: 'Foto de',
  imageFallback: 'Imagen no disponible',
};

// Demo fixtures: replace these members with authored, confirmed content when available.
// The pair deliberately exercises both photo states of the card: a member who naturally
// has no photo, and a member whose placeholder reuses an existing demo asset so the
// rendered app exercises the real-photo path without referencing a missing file.
export const rawTeamMembers = [
  {
    id: 'demo-team-01',
    name: 'Colega de Estudio Demo',
    role: 'Soporte Académico y Guardias',
    // Photo-less on purpose: the demo must exercise the natural no-photo member path.
    message: 'Mensaje de apoyo y felicitaciones por este gran logro profesional.',
  },
  {
    id: 'demo-team-02',
    name: 'Familiar Demo',
    role: 'Apoyo Incondicional',
    photo: '/images/demo/portrait.webp',
    message:
      'Orgullo inmenso por todo el esfuerzo y la dedicación durante estos años: las noches de estudio, los guardias interminables y los exámenes que parecían imposibles. Cada sacrificio encontró su sentido hoy, cuando te recibiste de médica como siempre soñaste. Gracias por recordarnos que la constancia, la paciencia y el cariño de la familia sostienen cualquier meta. Que este título sea apenas el comienzo de una carrera llena de pacientes agradecidos, aprendizajes nuevos y momentos para celebrar en familia.',
  },
];

export const rawTeamContent = {
  copy: rawTeamCopy,
  members: rawTeamMembers,
};

export const teamContent: TeamContent = TeamContentSchema.parse(rawTeamContent);
export const teamCopy: TeamCopy = teamContent.copy;
export const teamMembers: TeamCollection = teamContent.members;
