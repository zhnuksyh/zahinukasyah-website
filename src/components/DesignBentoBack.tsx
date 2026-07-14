import type { MouseEvent } from 'react';
import { designData } from '../data/content';
import { useDragScroll } from '../lib/useDragScroll';
import { useViewport } from '../lib/useViewport';

const TXT_DARK = '#17171c';
const TXT_LIGHT = '#f4f4f6';

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
  const mobile = useViewport() === 'mobile';

  const openTile = (e: MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenTile(i);
  };

  return (
    <>
      <div style={{ flex: '0 0 auto', padding: mobile ? '0 26px 6px' : '46px 54px 4px' }}>
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
          <div style={{ fontSize: mobile ? 30 : 40, fontWeight: 700, letterSpacing: '-0.02em', color: '#fefefe' }}>
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
          flex: mobile ? '0 0 auto' : '1 1 auto',
          minHeight: 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: mobile ? '12px 20px 0' : '22px 54px 54px',
          cursor: 'grab',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column dense',
            gridTemplateRows: mobile ? 'repeat(3, minmax(0, 128px))' : 'repeat(3, 172px)',
            gridAutoColumns: mobile ? '168px' : '222px',
            gap: mobile ? 12 : 16,
            height: mobile ? 'auto' : '100%',
            width: 'max-content',
          }}
        >
          {designData.map((d, i) => {
            const t = d.dark ? TXT_LIGHT : TXT_DARK;
            return (
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
                  color: t,
                  transition: 'transform .3s cubic-bezier(.34,1.4,.64,1), box-shadow .3s ease',
                }}
              >
                <span
                  style={{
                    alignSelf: 'flex-start',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: 999,
                    background: d.dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)',
                    color: t,
                  }}
                >
                  {d.cat}
                </span>
                <div style={{ flex: '1 1 auto' }} />
                <div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: 1.28,
                      color: t,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {d.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
