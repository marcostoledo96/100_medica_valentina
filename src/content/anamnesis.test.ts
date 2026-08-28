import { describe, expect, it } from 'vitest';
import { anamnesisContent } from './anamnesis';

describe('Anamnesis content fixture', () => {
  it('parses against the schema as a brief bridge of at most three blocks', () => {
    expect(anamnesisContent.heading).toBe('Anamnesis');
    expect(anamnesisContent.blocks.length).toBeGreaterThanOrEqual(1);
    expect(anamnesisContent.blocks.length).toBeLessThanOrEqual(3);
    expect(new Set(anamnesisContent.blocks.map((block) => block.id)).size).toBe(
      anamnesisContent.blocks.length
    );
  });

  it('keeps the photo optional state real: valid local asset with paired contextual alt', () => {
    expect(anamnesisContent.photo).toBeDefined();
    expect(anamnesisContent.photo?.src).toMatch(/^\/images\/.+\.(webp|png|jpg|jpeg|svg|avif)$/);
    expect(anamnesisContent.photo?.alt.toLowerCase()).toContain('provisional');
  });

  it('marks the quote as clearly provisional', () => {
    expect(anamnesisContent.quote?.text.toLowerCase()).toMatch(/provisional|demo/);
  });

  it('keeps every narrative statement explicitly provisional in the fixture layer', () => {
    // Editorial rule enforced here (fixture layer), not in the domain schema:
    // unconfirmed copy must stay unmistakably demo/provisional (Issue #8).
    expect(anamnesisContent.intro.toLowerCase()).toMatch(/provisional|demo|borrador|reemplaz/);
    for (const block of anamnesisContent.blocks) {
      expect(block.body.toLowerCase()).toMatch(/provisional|demo|borrador|reemplaz/);
    }
  });
});
