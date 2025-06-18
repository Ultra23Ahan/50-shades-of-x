import { converter as culoriConvert, hsl as culoriHSL, parse } from 'culori';
import { getRGBFromColor } from '@/lib/get-rgb-from-color';

// Convert to rgb() string
export function convertToRGB(hsl: string): string {
  const [r, g, b] = getRGBFromColor(hsl) || [0, 0, 0]; // handles errors with rgb stuff
  return `rgb(${r}, ${g}, ${b})`;
}

// Convert to HEX
export function convertToHEX(hsl: string): string {
  const rgb = getRGBFromColor(hsl);
  if (!rgb) {
    console.warn('[convertToHEX] getRGBFromColor failed for:', hsl);
    return '#000000';
  }

  return '#' + rgb.map((x) => x.toString(16).padStart(2, '0')).join('');
}

// Convert to accurate OKLCH using culori
export function convertToOKLCH(hsl: string): string {
  const parsed = parse(hsl); // Parses hsl(...) string to { mode, h, s, l }
  if (!parsed || parsed.mode !== 'hsl') {
    throw new Error('Invalid HSL string');
  }

  const hslColor = culoriHSL({
    h: parsed.h!,
    s: parsed.s!,
    l: parsed.l!,
  });

  const oklch = culoriConvert('oklch')(hslColor);
  if (!oklch) throw new Error('Could not convert to OKLCH');

  const { l, c, h } = oklch;
  return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${h?.toFixed(2) ?? 0})`;
}
