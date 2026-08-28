import { describe, expect, it } from 'vitest';
import { narrativeSections } from './sections';

describe('Narrative section configuration', () => {
  it('keeps stable, unique, valid fragment identifiers in narrative order', () => {
    const ids = narrativeSections.map((section) => section.id);
    const orders = narrativeSections.map((section) => section.order);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id))).toBe(true);
    expect(orders).toEqual([...orders].sort((left, right) => left - right));
    expect(ids).toEqual([
      'inicio',
      'expediente',
      'anamnesis',
      'signos-vitales',
      'linea-tiempo',
      'galeria',
      'equipo-tratante',
      'final',
    ]);
    expect(orders).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(narrativeSections.map((section) => section.phase)).toEqual([
      'clinical',
      'clinical',
      'clinical',
      'clinical',
      'human',
      'human',
      'human',
      'finale',
    ]);
  });

  it('contains only the static fields required by the shell contract', () => {
    for (const section of narrativeSections) {
      expect(Object.keys(section).sort()).toEqual(['id', 'label', 'order', 'phase']);
      expect(section.label.trim()).not.toBe('');
      expect(['clinical', 'human', 'finale']).toContain(section.phase);
      expect(`#${section.id}`).toMatch(/^#[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
    }
  });

  it('does not embed personal or narrative facts in the static shell configuration', () => {
    const serializedConfig = JSON.stringify(narrativeSections).toLowerCase();

    expect(serializedConfig).not.toMatch(/valentina|apellido|hospital|foto|biograf/);
  });
});
