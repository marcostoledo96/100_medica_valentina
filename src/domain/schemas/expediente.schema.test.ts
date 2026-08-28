import { describe, expect, it } from 'vitest';
import { expedienteContent, rawExpedienteContent } from '../../content/expediente';
import type { ExpedienteContent } from './expediente.schema';
import { ExpedienteContentSchema } from './expediente.schema';

const expedienteContentKeys = [
  'eyebrow',
  'heading',
  'intro',
  'completionLabel',
  'completionAriaLabelPrefix',
  'portraitAltPrefix',
  'portraitFallbackAriaLabelPrefix',
  'portraitUnavailableLabel',
  'portraitCaptionPrefix',
  'identityLabel',
  'identityDescription',
  'firstNameLabel',
  'fullNameLabel',
  'startYearLabel',
  'graduationYearLabel',
  'statusLabel',
  'diagnosisLabel',
  'prognosisLabel',
  'footer',
  'ctaLabel',
] as const;

const validExpedienteContent: ExpedienteContent = {
  eyebrow: 'Fixture dossier eyebrow',
  heading: 'Fixture expediente heading',
  intro: 'Fixture narrative introduction.',
  completionLabel: 'Fixture completion',
  completionAriaLabelPrefix: 'Fixture dossier completion',
  portraitAltPrefix: 'Fixture illustrated portrait of',
  portraitFallbackAriaLabelPrefix: 'Fixture initials of',
  portraitUnavailableLabel: 'Fixture portrait unavailable',
  portraitCaptionPrefix: 'Fixture portrait caption for',
  identityLabel: 'Fixture celebrated identity',
  identityDescription: 'Fixture identity narrative.',
  firstNameLabel: 'Fixture first name',
  fullNameLabel: 'Fixture full name',
  startYearLabel: 'Fixture start year',
  graduationYearLabel: 'Fixture graduation year',
  statusLabel: 'Fixture status',
  diagnosisLabel: 'Fixture diagnosis',
  prognosisLabel: 'Fixture prognosis',
  footer: 'Fixture footer narrative.',
  ctaLabel: 'Fixture next step',
};

describe('ExpedienteContentSchema', () => {
  it('accepts a complete valid expediente content object', () => {
    expect(ExpedienteContentSchema.parse(validExpedienteContent)).toEqual(validExpedienteContent);
  });

  it.each(expedienteContentKeys)('rejects empty or whitespace-only %s', (field) => {
    expect(() =>
      ExpedienteContentSchema.parse({ ...validExpedienteContent, [field]: '' })
    ).toThrow();
    expect(() =>
      ExpedienteContentSchema.parse({ ...validExpedienteContent, [field]: ' \t\n ' })
    ).toThrow();
  });

  it('rejects an object missing a required field', () => {
    const missingRequiredField = { ...validExpedienteContent } as Partial<ExpedienteContent>;
    delete missingRequiredField.heading;

    expect(() => ExpedienteContentSchema.parse(missingRequiredField)).toThrow();
  });

  it('declares exactly the required expediente content keys', () => {
    expect(Object.keys(ExpedienteContentSchema.shape)).toEqual(expedienteContentKeys);
  });

  it('exports production content parsed through the runtime schema', () => {
    expect(expedienteContent).toEqual(ExpedienteContentSchema.parse(rawExpedienteContent));
  });
});
