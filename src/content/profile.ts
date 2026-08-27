import { Profile, ProfileSchema } from '../domain/schemas/profile.schema';

export const rawProfileContent = {
  firstName: 'Persona Demo',
  fullName: 'Persona Demo de Prueba',
  startYear: 2020,
  graduationYear: 2026,
  portrait: '/images/demo/portrait.webp',
  status: 'ALTA DEFINITIVA DEMO',
  diagnosis: 'MÉDICA DEMO',
  prognosis: 'FUTURO BRILLANTE DEMO',
};

export const profileContent: Profile = ProfileSchema.parse(rawProfileContent);
