import * as fs from 'fs';
import * as path from 'path';
import type { ExperiencePhase } from '../domain/types/phase';

export interface PhaseTokens {
  [key: string]: string;
}

export type ExperienceTokensMap = Record<ExperiencePhase, PhaseTokens>;

/**
 * Deterministic CSS token extractor for %100 médica design system.
 * Reads src/styles/tokens.css as the single source of truth and parses custom properties per phase.
 */
export function readExperienceTokens(): ExperienceTokensMap {
  const tokensPath = path.resolve(__dirname, '../styles/tokens.css');
  const cssContent = fs.readFileSync(tokensPath, 'utf-8');

  const tokens: ExperienceTokensMap = {
    clinical: {},
    human: {},
    finale: {},
  };

  // Match CSS rule blocks: selector { body }
  const ruleRegex = /([^{]+)\{([^}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = ruleRegex.exec(cssContent)) !== null) {
    const rawSelector = match[1]?.trim() || '';
    const body = match[2]?.trim() || '';

    // Extract all --custom-prop: value; pairs
    const propRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let propMatch: RegExpExecArray | null;
    const extractedProps: Record<string, string> = {};

    while ((propMatch = propRegex.exec(body)) !== null) {
      const propName = propMatch[1]?.trim();
      const propValue = propMatch[2]?.trim();
      if (propName && propValue) {
        // Strip inline comments if any
        extractedProps[propName] = propValue.replace(/\/\*.*?\*\//g, '').trim();
      }
    }

    // Determine target phase(s)
    if (
      rawSelector.includes('clinical') ||
      (rawSelector.includes(':root') &&
        !rawSelector.includes('human') &&
        !rawSelector.includes('finale'))
    ) {
      Object.assign(tokens.clinical, extractedProps);
    }
    if (rawSelector.includes('human')) {
      Object.assign(tokens.human, extractedProps);
    }
    if (rawSelector.includes('finale')) {
      Object.assign(tokens.finale, extractedProps);
    }
  }

  return tokens;
}
