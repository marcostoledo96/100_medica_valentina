import { describe, it, expect } from 'vitest';
import { getContrastRatio, formatContrastRatio } from './contrast';
import { readExperienceTokens, type PhaseTokens } from '../test/readExperienceTokens';

function requireToken(phaseTokens: PhaseTokens, key: string): string {
  const val = phaseTokens[key];
  if (!val) {
    throw new Error(`Required CSS token "${key}" was not found in tokens.css`);
  }
  return val;
}

describe('WCAG 2.2 Contrast Ratio Verification for Experience Tokens', () => {
  const tokens = readExperienceTokens();

  const surfaceKeys = [
    '--surface-base',
    '--surface-raised',
    '--surface-overlay',
    '--surface-subtle',
    '--surface-sunken',
  ] as const;

  const phases = ['clinical', 'human', 'finale'] as const;

  phases.forEach((phase) => {
    describe(`${phase.toUpperCase()} Phase Tokens (Source: tokens.css)`, () => {
      const phaseTokens = tokens[phase];

      it(`extracts valid CSS custom properties for ${phase} phase`, () => {
        expect(phaseTokens['--text-primary'], '--text-primary').toBeDefined();
        expect(phaseTokens['--text-secondary'], '--text-secondary').toBeDefined();
        expect(phaseTokens['--text-muted'], '--text-muted').toBeDefined();
        expect(phaseTokens['--accent-primary'], '--accent-primary').toBeDefined();
        expect(phaseTokens['--accent-primary-hover'], '--accent-primary-hover').toBeDefined();
        expect(phaseTokens['--accent-primary-active'], '--accent-primary-active').toBeDefined();
        expect(phaseTokens['--accent-primary-fg'], '--accent-primary-fg').toBeDefined();
      });

      it(`ensures text-primary achieves >= 4.5:1 (AA) across all ${phase} surfaces`, () => {
        const textPrimary = requireToken(phaseTokens, '--text-primary');
        surfaceKeys.forEach((surfKey) => {
          const surfaceHex = phaseTokens[surfKey];
          if (!surfaceHex || !surfaceHex.startsWith('#')) return;
          const ratio = getContrastRatio(textPrimary, surfaceHex);
          expect(
            ratio,
            `${phase} text-primary (${textPrimary}) on ${surfKey} (${surfaceHex}) [${formatContrastRatio(ratio)}]`
          ).toBeGreaterThanOrEqual(4.5);
        });
      });

      it(`ensures text-secondary achieves >= 4.5:1 (AA) across all ${phase} surfaces`, () => {
        const textSecondary = requireToken(phaseTokens, '--text-secondary');
        surfaceKeys.forEach((surfKey) => {
          const surfaceHex = phaseTokens[surfKey];
          if (!surfaceHex || !surfaceHex.startsWith('#')) return;
          const ratio = getContrastRatio(textSecondary, surfaceHex);
          expect(
            ratio,
            `${phase} text-secondary (${textSecondary}) on ${surfKey} (${surfaceHex}) [${formatContrastRatio(ratio)}]`
          ).toBeGreaterThanOrEqual(4.5);
        });
      });

      it(`ensures text-muted achieves >= 4.5:1 (AA) across all ${phase} surfaces`, () => {
        const textMuted = requireToken(phaseTokens, '--text-muted');
        surfaceKeys.forEach((surfKey) => {
          const surfaceHex = phaseTokens[surfKey];
          if (!surfaceHex || !surfaceHex.startsWith('#')) return;
          const ratio = getContrastRatio(textMuted, surfaceHex);
          expect(
            ratio,
            `${phase} text-muted (${textMuted}) on ${surfKey} (${surfaceHex}) [${formatContrastRatio(ratio)}]`
          ).toBeGreaterThanOrEqual(4.5);
        });
      });

      describe(`Interactive Accent States (${phase})`, () => {
        it(`ensures accent-primary resting state achieves >= 4.5:1 (AA)`, () => {
          const fg = requireToken(phaseTokens, '--accent-primary-fg');
          const normalBg = requireToken(phaseTokens, '--accent-primary');
          const ratio = getContrastRatio(fg, normalBg);
          expect(
            ratio,
            `${phase} accent resting: ${fg} on ${normalBg} [${formatContrastRatio(ratio)}]`
          ).toBeGreaterThanOrEqual(4.5);
        });

        it(`ensures accent-primary-hover state achieves >= 4.5:1 (AA)`, () => {
          const fg = requireToken(phaseTokens, '--accent-primary-fg');
          const hoverBg = requireToken(phaseTokens, '--accent-primary-hover');
          const ratio = getContrastRatio(fg, hoverBg);
          expect(
            ratio,
            `${phase} accent hover: ${fg} on ${hoverBg} [${formatContrastRatio(ratio)}]`
          ).toBeGreaterThanOrEqual(4.5);
        });

        it(`ensures accent-primary-active state achieves >= 4.5:1 (AA)`, () => {
          const fg = requireToken(phaseTokens, '--accent-primary-fg');
          const activeBg = requireToken(phaseTokens, '--accent-primary-active');
          const ratio = getContrastRatio(fg, activeBg);
          expect(
            ratio,
            `${phase} accent active: ${fg} on ${activeBg} [${formatContrastRatio(ratio)}]`
          ).toBeGreaterThanOrEqual(4.5);
        });
      });

      it(`ensures all semantic status fg/bg pairs achieve >= 4.5:1 (AA)`, () => {
        const successFg = requireToken(phaseTokens, '--status-success-fg');
        const successBg = requireToken(phaseTokens, '--status-success');
        const warningFg = requireToken(phaseTokens, '--status-warning-fg');
        const warningBg = requireToken(phaseTokens, '--status-warning');
        const dangerFg = requireToken(phaseTokens, '--status-danger-fg');
        const dangerBg = requireToken(phaseTokens, '--status-danger');
        const infoFg = requireToken(phaseTokens, '--status-info-fg');
        const infoBg = requireToken(phaseTokens, '--status-info');

        const successRatio = getContrastRatio(successFg, successBg);
        const warningRatio = getContrastRatio(warningFg, warningBg);
        const dangerRatio = getContrastRatio(dangerFg, dangerBg);
        const infoRatio = getContrastRatio(infoFg, infoBg);

        expect(
          successRatio,
          `${phase} status-success: ${successFg} on ${successBg} [${formatContrastRatio(successRatio)}]`
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          warningRatio,
          `${phase} status-warning: ${warningFg} on ${warningBg} [${formatContrastRatio(warningRatio)}]`
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          dangerRatio,
          `${phase} status-danger: ${dangerFg} on ${dangerBg} [${formatContrastRatio(dangerRatio)}]`
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          infoRatio,
          `${phase} status-info: ${infoFg} on ${infoBg} [${formatContrastRatio(infoRatio)}]`
        ).toBeGreaterThanOrEqual(4.5);
      });
    });
  });

  describe('Boundary Precision & No Premature Rounding', () => {
    it('returns exact unrounded float ratio preventing false-positive compliance from rounding', () => {
      // #747474 on #000000 produces exact contrast ratio ~ 4.4984...
      // Rounding with Math.round(ratio * 100) / 100 would produce 4.50 (a false positive PASS).
      // Unrounded exact ratio MUST be strictly < 4.5.
      const exactRatio = getContrastRatio('#747474', '#000000');
      expect(exactRatio).toBeLessThan(4.5);
      expect(exactRatio).toBeGreaterThan(4.49);
      expect(typeof exactRatio).toBe('number');
      // Assert exact floating precision (more than 2 decimal digits)
      expect(exactRatio.toString().split('.')[1]?.length).toBeGreaterThan(2);
    });

    it('formats contrast ratio string properly with formatContrastRatio', () => {
      expect(formatContrastRatio(4.51234)).toBe('4.51:1');
      expect(formatContrastRatio(18.7391)).toBe('18.74:1');
    });
  });
});
