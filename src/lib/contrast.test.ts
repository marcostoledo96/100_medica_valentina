import { describe, it, expect } from 'vitest';
import { getContrastRatio } from './contrast';

describe('WCAG 2.2 Contrast Ratio Verification for Experience Tokens', () => {
  describe('Clinical Phase Tokens', () => {
    const surfaces = {
      base: '#090d12',
      raised: '#121a24',
      overlay: '#1b2636',
      subtle: '#0e151f',
    };

    const textTokens = {
      primary: '#f0f6fc',
      secondary: '#94a3b8',
      muted: '#7d91aa',
    };

    it('ensures text-primary achieves >= 4.5:1 (AA) across all surfaces', () => {
      Object.entries(surfaces).forEach(([name, surfaceHex]) => {
        const ratio = getContrastRatio(textTokens.primary, surfaceHex);
        expect(ratio, `text-primary on ${name} (${surfaceHex})`).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('ensures text-secondary achieves >= 4.5:1 (AA) across all surfaces', () => {
      Object.entries(surfaces).forEach(([name, surfaceHex]) => {
        const ratio = getContrastRatio(textTokens.secondary, surfaceHex);
        expect(ratio, `text-secondary on ${name} (${surfaceHex})`).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('ensures text-muted achieves >= 4.5:1 (AA) across all surfaces', () => {
      Object.entries(surfaces).forEach(([name, surfaceHex]) => {
        const ratio = getContrastRatio(textTokens.muted, surfaceHex);
        expect(ratio, `text-muted on ${name} (${surfaceHex})`).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('ensures accent-primary-fg on accent-primary achieves >= 4.5:1 (AA)', () => {
      const ratio = getContrastRatio('#031f13', '#10b981');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('ensures all semantic status fg/bg pairs achieve >= 4.5:1 (AA)', () => {
      expect(getContrastRatio('#031f13', '#10b981'), 'status-success').toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio('#1b0e01', '#f59e0b'), 'status-warning').toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio('#ffffff', '#e11d48'), 'status-danger').toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio('#02222b', '#06b6d4'), 'status-info').toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Human Phase Tokens', () => {
    const surfaces = {
      base: '#faf7f2',
      raised: '#ffffff',
      overlay: '#f3ece1',
      subtle: '#f0e8dc',
    };

    const textTokens = {
      primary: '#201b17',
      secondary: '#4d453e',
      muted: '#5c544c',
    };

    it('ensures text-primary achieves >= 4.5:1 (AA) across all surfaces', () => {
      Object.entries(surfaces).forEach(([name, surfaceHex]) => {
        const ratio = getContrastRatio(textTokens.primary, surfaceHex);
        expect(ratio, `text-primary on ${name} (${surfaceHex})`).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('ensures text-secondary achieves >= 4.5:1 (AA) across all surfaces', () => {
      Object.entries(surfaces).forEach(([name, surfaceHex]) => {
        const ratio = getContrastRatio(textTokens.secondary, surfaceHex);
        expect(ratio, `text-secondary on ${name} (${surfaceHex})`).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('ensures text-muted achieves >= 4.5:1 (AA) across all surfaces', () => {
      Object.entries(surfaces).forEach(([name, surfaceHex]) => {
        const ratio = getContrastRatio(textTokens.muted, surfaceHex);
        expect(ratio, `text-muted on ${name} (${surfaceHex})`).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('ensures accent-primary-fg on accent-primary achieves >= 4.5:1 (AA)', () => {
      const ratio = getContrastRatio('#ffffff', '#ad4e29');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('ensures all semantic status fg/bg pairs achieve >= 4.5:1 (AA)', () => {
      expect(getContrastRatio('#ffffff', '#1e6b47'), 'status-success').toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio('#ffffff', '#a14e0b'), 'status-warning').toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio('#ffffff', '#b91c1c'), 'status-danger').toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio('#ffffff', '#1d4ed8'), 'status-info').toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Finale Phase Tokens', () => {
    const surfaces = {
      base: '#09090b',
      raised: '#141418',
      overlay: '#1e1e24',
      subtle: '#0f0f13',
    };

    const textTokens = {
      primary: '#fafafa',
      secondary: '#a8a8b3',
      muted: '#888894',
    };

    it('ensures text-primary achieves >= 4.5:1 (AA) across all surfaces', () => {
      Object.entries(surfaces).forEach(([name, surfaceHex]) => {
        const ratio = getContrastRatio(textTokens.primary, surfaceHex);
        expect(ratio, `text-primary on ${name} (${surfaceHex})`).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('ensures text-secondary achieves >= 4.5:1 (AA) across all surfaces', () => {
      Object.entries(surfaces).forEach(([name, surfaceHex]) => {
        const ratio = getContrastRatio(textTokens.secondary, surfaceHex);
        expect(ratio, `text-secondary on ${name} (${surfaceHex})`).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('ensures text-muted achieves >= 4.5:1 (AA) across all surfaces', () => {
      Object.entries(surfaces).forEach(([name, surfaceHex]) => {
        const ratio = getContrastRatio(textTokens.muted, surfaceHex);
        expect(ratio, `text-muted on ${name} (${surfaceHex})`).toBeGreaterThanOrEqual(4.5);
      });
    });

    it('ensures accent-primary-fg on accent-primary achieves >= 4.5:1 (AA)', () => {
      const ratio = getContrastRatio('#180e02', '#f59e0b');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('ensures all semantic status fg/bg pairs achieve >= 4.5:1 (AA)', () => {
      expect(getContrastRatio('#031f13', '#10b981'), 'status-success').toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio('#180e02', '#f59e0b'), 'status-warning').toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio('#ffffff', '#e11d48'), 'status-danger').toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio('#032030', '#38bdf8'), 'status-info').toBeGreaterThanOrEqual(4.5);
    });
  });
});
