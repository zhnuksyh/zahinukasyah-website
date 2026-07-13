import type { CSSProperties } from 'react';

/**
 * Placeholder for artwork that hasn't been added yet — a faint frame with an
 * image glyph, meant to sit underneath a tile's own overlays.
 */
export default function ImagePlaceholder({
  label,
  style,
}: {
  label?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        color: 'rgba(0,0,0,0.55)',
        font: '13px/1.3 system-ui, -apple-system, sans-serif',
        userSelect: 'none',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.45 }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      {label ? (
        <div style={{ maxWidth: '90%', fontWeight: 500, letterSpacing: '0.01em' }}>{label}</div>
      ) : null}
    </div>
  );
}
