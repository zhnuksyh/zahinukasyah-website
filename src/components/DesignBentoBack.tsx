import type { MouseEvent } from 'react';
import { designData } from '../data/content';
import { hexToRgba } from '../lib/colors';
import { useDragScroll } from '../lib/useDragScroll';
import ImagePlaceholder from './ImagePlaceholder';

interface DesignBentoBackProps {
  label: string;
  title: string;
  onOpenTile: (index: number) => void;
}

/**
 * Back face for the Design / Animation cards: a horizontally drag-scrolled
 * bento wall of work tiles.
 */
export default function DesignBentoBack({ label, title, onOpenTile }: DesignBentoBackProps) {
  const dragScroll = useDragScroll();

  const openTile = (e: MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenTile(i);
  };

  return (
    <>
      <div style={{ flex: '0 0 auto', padding: '46px 54px 4px' }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8 }}>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: '#fefefe' }}>
            {title}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.34)', letterSpacing: '0.02em' }}>
            scroll right &rarr;
          </div>
        </div>
      </div>
      <div
        ref={dragScroll}
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '22px 54px 54px',
          cursor: 'grab',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column dense',
            gridTemplateRows: 'repeat(3, 172px)',
            gridAutoColumns: '222px',
            gap: 16,
            height: '100%',
            width: 'max-content',
          }}
        >
          {designData.map((d, i) => (
            <div
              key={i}
              onClick={(e) => openTile(e, i)}
              className="lift-8 shadow-[0_16px_34px_-18px_rgba(0,0,0,0.55)] hover:shadow-[0_34px_60px_-22px_rgba(0,0,0,0.85)]"
              style={{
                position: 'relative',
                gridRow: 'span 1',
                gridColumn: d.wide ? 'span 2' : 'span 1',
                borderRadius: 20,
                overflow: 'hidden',
                cursor: 'pointer',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                background: d.c,
                color: '#fff',
                transition: 'transform .3s cubic-bezier(.34,1.4,.64,1), box-shadow .3s ease',
              }}
            >
              <ImagePlaceholder />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(120% 90% at 12% 0%, ${hexToRgba(d.c, 0.32)}, transparent 62%)`,
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.34) 0%, transparent 26%, transparent 48%, rgba(0,0,0,0.68) 100%)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', pointerEvents: 'none' }}>
                <span
                  style={{
                    alignSelf: 'flex-start',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: 999,
                    background: hexToRgba(d.c, 0.9),
                    color: '#fff',
                    letterSpacing: '0.02em',
                    border: '1px solid rgba(255,255,255,0.28)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                  }}
                >
                  {d.cat}
                </span>
              </div>
              <div style={{ position: 'relative', flex: '1 1 auto' }} />
              <div style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    lineHeight: 1.28,
                    color: '#fff',
                    letterSpacing: '-0.01em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.55)',
                  }}
                >
                  {d.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 3,
                    color: 'rgba(255,255,255,0.82)',
                    textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                  }}
                >
                  {d.meta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
