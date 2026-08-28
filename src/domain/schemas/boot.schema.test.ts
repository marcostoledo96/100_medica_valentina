import { describe, expect, it } from 'vitest';
import { bootContent, rawBootContent } from '../../content/boot';
import { BootContentSchema } from './boot.schema';

describe('BootContentSchema', () => {
  it('accepts the complete demo fixture with every required field', () => {
    const parsed = BootContentSchema.parse(rawBootContent);

    expect(parsed).toEqual(bootContent);
    expect(parsed.scan).toEqual({
      search: expect.any(String),
      match: expect.any(String),
      ready: expect.any(String),
    });
    expect(parsed.identity.value).toBe('Persona Demo de Prueba');
    expect(parsed.status.value).toBe('ALTA DEFINITIVA DEMO');
    expect(parsed.nextHref).toBe('#expediente');
  });

  it('requires the fixture to declare its demo status and rejects missing copy', () => {
    expect(rawBootContent.isDemo).toBe(true);
    expect(rawBootContent).not.toHaveProperty('biography');
    expect(() => BootContentSchema.parse({ ...rawBootContent, isDemo: false })).toThrow();
    expect(() =>
      BootContentSchema.parse({
        ...rawBootContent,
        scan: { ...rawBootContent.scan, ready: '' },
      })
    ).toThrow();
  });

  it('rejects an empty next-section anchor', () => {
    expect(() => BootContentSchema.parse({ ...rawBootContent, nextHref: ' ' })).toThrow();
  });
});
