/**
 * WCAG 2.2 Relative Luminance and Contrast Ratio calculations
 * Implements W3C WCAG 2.2 specifications without external dependencies.
 */

function parseHex(hex: string): [number, number, number] {
  const cleaned = hex.replace(/^#/, '').trim();
  if (cleaned.length === 3) {
    const c0 = cleaned.charAt(0);
    const c1 = cleaned.charAt(1);
    const c2 = cleaned.charAt(2);
    const r = parseInt(c0 + c0, 16);
    const g = parseInt(c1 + c1, 16);
    const b = parseInt(c2 + c2, 16);
    return [r, g, b];
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return [r, g, b];
  }
  throw new Error(`Invalid hex color string: "${hex}"`);
}

function sRgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/**
 * Calculates the relative luminance of an sRGB color per WCAG 2.2.
 * Output is in the range [0, 1].
 */
export function getRelativeLuminance(hexColor: string): number {
  const [r, g, b] = parseHex(hexColor);
  const rLin = sRgbToLinear(r);
  const gLin = sRgbToLinear(g);
  const bLin = sRgbToLinear(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Calculates the WCAG 2.2 contrast ratio between two hex colors.
 * Returns a number from 1 to 21 (e.g. 4.5 for 4.5:1).
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  const ratio = (brightest + 0.05) / (darkest + 0.05);
  // Round to 2 decimal places
  return Math.round(ratio * 100) / 100;
}
