import { useEffect, useRef, useState } from 'react';
import { researchData } from '../data/content';
import { hexToRgba, shade, tint } from '../lib/colors';
import { ACCENT } from '../lib/theme';
import { useDragScroll } from '../lib/useDragScroll';

/** Back face for the Research card: reading list on the left, paper detail on the right. */
export default function ResearchBack({ open }: { open: boolean }) {
  const [sel, setSel] = useState(0);
  const [anim, setAnim] = useState(false);
  const timers = useRef<number[]>([]);
  const dragScroll = useDragScroll();

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    if (open) {
      // let the card's open animation land before the detail rises in
      timers.current.push(window.setTimeout(() => setAnim(true), 1050));
    } else {
      setAnim(false);
    }
    return clearTimers;
  }, [open]);

  const select = (i: number) => {
    if (i === sel) return;
    clearTimers();
    setAnim(false);
    timers.current.push(
      window.setTimeout(() => {
        setSel(i);
        timers.current.push(window.setTimeout(() => setAnim(true), 30));
      }, 200),
    );
  };

  const rd = researchData[sel] ?? researchData[0];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '44px 44px 40px',
        background: 'linear-gradient(180deg,#0c0c0e,#08080a)',
      }}
    >
      <div style={{ flex: '0 0 auto', width: '100%', maxWidth: 1320, padding: '0 4px 26px' }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.42)',
          }}
        >
          Field notes &amp; papers
        </div>
        <div
          style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', color: '#f4f4f6', marginTop: 6 }}
        >
          Research
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1320,
          flex: '1 1 auto',
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '404px 1fr',
          gap: 44,
        }}
      >
        {/* LEFT: reading list */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <div
            ref={dragScroll}
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '0 28px 14px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              marginTop: -8,
            }}
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                padding: '2px 2px 10px',
                background: 'linear-gradient(180deg,#0c0c0e 72%,rgba(12,12,14,0))',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.36)',
              }}
            >
              2026
            </div>
            {researchData.map((it, idx) => {
              const selected = idx === sel;
              return (
                <div
                  key={idx}
                  onClick={() => select(idx)}
                  className={selected ? undefined : 'hover:bg-white/5'}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '12px 14px',
                    borderRadius: 18,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    border: '1px solid ' + (selected ? 'rgba(255,255,255,0.16)' : 'transparent'),
                    ...(selected ? { background: 'rgba(255,255,255,0.06)' } : {}),
                    boxShadow: selected ? '0 18px 40px -24px rgba(0,0,0,0.7)' : 'none',
                    transition: 'background .25s ease, border-color .25s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3,
                      width: 34,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        color: selected ? ACCENT : 'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {it.mon}
                    </div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 700,
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        color: selected ? '#fefefe' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {it.date}
                    </div>
                  </div>
                  <div
                    style={{
                      position: 'relative',
                      width: 58,
                      height: 58,
                      borderRadius: 13,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'monospace',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: 'rgba(255,255,255,0.82)',
                      background: `linear-gradient(150deg, ${tint(it.c, 0.1)}, ${shade(it.c, 0.28)})`,
                      boxShadow: '0 8px 18px -10px ' + hexToRgba(it.c, 0.7),
                    }}
                  >
                    {it.cat.slice(0, 3).toUpperCase()}
                  </div>
                  <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: selected ? ACCENT : 'rgba(255,255,255,0.34)',
                      }}
                    >
                      {it.status}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: 1.35,
                        color: selected ? '#fefefe' : 'rgba(255,255,255,0.82)',
                        marginTop: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {it.title}
                    </div>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      right: -23,
                      top: '50%',
                      width: 12,
                      height: 12,
                      transform: `translateY(-50%) rotate(45deg) scale(${selected ? 1 : 0})`,
                      background: 'rgba(255,255,255,0.06)',
                      borderRight: '1px solid rgba(255,255,255,0.16)',
                      borderTop: '1px solid rgba(255,255,255,0.16)',
                      borderRadius: 2,
                      transition: 'transform .3s cubic-bezier(.34,1.4,.64,1)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: paper detail */}
        <div
          ref={dragScroll}
          style={{ height: '100%', minHeight: 0, overflowY: 'auto', paddingRight: 4 }}
        >
          <div
            style={{
              opacity: anim ? 1 : 0,
              transform: anim ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity .4s ease, transform .45s cubic-bezier(.34,1.15,.64,1)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: 22,
                overflow: 'hidden',
                background: `linear-gradient(150deg, ${tint(rd.c, 0.12)}, ${shade(rd.c, 0.28)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 40px 80px -30px ' + hexToRgba(rd.c, 0.6),
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  color: 'rgba(255,255,255,0.55)',
                  background: 'rgba(0,0,0,0.18)',
                  padding: '6px 12px',
                  borderRadius: 999,
                }}
              >
                [ FIGURE / COVER ]
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 26,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{rd.cat}</span>
              <span>·</span>
              <span>{rd.venue}</span>
              <span>·</span>
              <span>{rd.status}</span>
            </div>

            <h2
              style={{
                marginTop: 14,
                fontSize: 'clamp(28px,3vw,40px)',
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
                color: '#fefefe',
                maxWidth: 640,
                textWrap: 'pretty',
              }}
            >
              {rd.title}
            </h2>

            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>
              {rd.authors} &middot; logged {rd.mon} {rd.date}, 2026
            </div>

            <div
              style={{
                marginTop: 22,
                maxWidth: 640,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}
            >
              {rd.paras.map((p, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
