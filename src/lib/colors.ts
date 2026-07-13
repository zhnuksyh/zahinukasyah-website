function parseHex(hex: string): [number, number, number] {
  let h = (hex || '#000000').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function hexToRgba(hex: string, a: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Darken a hex color by t (0..1). */
export function shade(hex: string, t: number): string {
  const [r, g, b] = parseHex(hex).map((v) => Math.round(v * (1 - t)));
  return `rgb(${r}, ${g}, ${b})`;
}

/** Lighten a hex color toward white by t (0..1). */
export function tint(hex: string, t: number): string {
  const [r, g, b] = parseHex(hex).map((v) => Math.round(v + (255 - v) * t));
  return `rgb(${r}, ${g}, ${b})`;
}
