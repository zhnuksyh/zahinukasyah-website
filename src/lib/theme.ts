import { hexToRgba } from './colors';

export const ACCENT = '#c9f24d';
export const GLOW = '#5b4bd6';

export const accentGlow = hexToRgba(ACCENT, 0.09);

/** Soft ambient glow as a pure multi-stop gradient — replaces the old
 *  blur(80-90px) layers, whose rasterization cost scales with radius x area. */
export const glowGradient = `radial-gradient(ellipse at center, ${hexToRgba(GLOW, 0.3)}, ${hexToRgba(GLOW, 0.12)} 45%, transparent 72%)`;
