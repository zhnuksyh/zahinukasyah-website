import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { booksData, gamesData, timelineData } from '../data/content';
import type { MediaItem } from '../data/content';
import { hexToRgba, shade, tint } from '../lib/colors';
import { ACCENT, accentGlow, glowSoft } from '../lib/theme';
import { useDragScroll } from '../lib/useDragScroll';
import FlipCard from './FlipCard';
import ImagePlaceholder from './ImagePlaceholder';

const CARD_SHADOW = '0 44px 90px -24px rgba(0,0,0,0.85), 0 10px 30px -12px rgba(0,0,0,0.5)';

const HOBBY_ICONS: ReactNode[] = [
  <svg key="camera" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="3" />
    <circle cx="12" cy="13" r="4" />
    <path d="M8 6l1.4-2.4a1 1 0 0 1 .9-.6h3.4a1 1 0 0 1 .9.6L16 6" />
  </svg>,
  <svg key="music" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6.5" cy="18" r="2.5" />
    <circle cx="18" cy="16" r="2.5" />
    <path d="M9 18V6l11.5-2v12" />
  </svg>,
  <svg key="book" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>,
  <svg key="globe" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
  </svg>,
  <svg key="coffee" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
    <path d="M17 9h2a2 2 0 0 1 0 4h-2" />
    <line x1="7" y1="2.5" x2="7" y2="4.5" />
    <line x1="11" y1="2.5" x2="11" y2="4.5" />
  </svg>,
  <svg key="barbell" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="12" x2="20" y2="12" />
    <rect x="2" y="8" width="3" height="8" rx="1" />
    <rect x="19" y="8" width="3" height="8" rx="1" />
  </svg>,
  <svg key="pencil" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20l3-1 11-11-2-2L5 17z" />
    <line x1="14" y1="6" x2="18" y2="10" />
  </svg>,
  <svg key="heart" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20s-7-4.5-7-9.5a3.5 3.5 0 0 1 7-1 3.5 3.5 0 0 1 7 1c0 5-7 9.5-7 9.5z" />
  </svg>,
];

function MediaGrid({ heading, items, prefix }: { heading: string; items: MediaItem[]; prefix: string }) {
  return (
    <>
      <div style={{ fontSize: 'clamp(20px,2.2vw,28px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fefefe' }}>
        {heading}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 20, marginTop: 28 }}>
        {items.map((g, idx) => (
          <FlipCard
            key={`${prefix}-${idx}`}
            className="lift-8"
            duration={0.55}
            wrapStyle={{
              position: 'relative',
              height: 260,
              perspective: 1000,
              cursor: 'pointer',
              transition: 'transform .3s cubic-bezier(.34,1.4,.64,1)',
            }}
            frontStyle={{
              position: 'absolute',
              inset: 0,
              borderRadius: 22,
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 18px 40px -24px rgba(0,0,0,0.7)',
            }}
            backStyle={{
              position: 'absolute',
              inset: 0,
              borderRadius: 22,
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: `linear-gradient(180deg, ${shade(g.c, 0.5)}, ${shade(g.c, 0.72)})`,
              border: '1px solid ' + hexToRgba(g.c, 0.42),
              boxShadow: '0 18px 40px -24px rgba(0,0,0,0.7)',
            }}
            front={
              <>
                <div style={{ position: 'relative', flex: '1 1 auto', minHeight: 0, borderRadius: 16, overflow: 'hidden' }}>
                  <ImagePlaceholder label="cover art" />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(120% 90% at 50% 0%, ${hexToRgba(g.c, 0.3)}, transparent 62%)`,
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginTop: 14 }}>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#f2f2f2',
                        letterSpacing: '-0.01em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {g.title}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', marginTop: 3 }}>{g.meta}</div>
                  </div>
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '4px 9px',
                      borderRadius: 999,
                      color: tint(g.c, 0.25),
                      background: hexToRgba(g.c, 0.14),
                      border: '1px solid ' + hexToRgba(g.c, 0.32),
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {g.tag}
                  </span>
                </div>
              </>
            }
            back={
              <>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: '#f6f6f8', marginBottom: 12 }}>
                  {g.title}
                </div>
                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'rgba(255,255,255,0.9)' }}>{g.desc}</div>
              </>
            }
          />
        ))}
      </div>
    </>
  );
}

export default function AboutPage({ active }: { active: boolean }) {
  const [up, setUp] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragScroll = useDragScroll();

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    if (active) {
      // rise the card, then flip it to reveal the portrait
      setUp(false);
      setFlipped(false);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      timers.current.push(
        window.setTimeout(() => {
          if (scrollRef.current) scrollRef.current.scrollTop = 0;
        }, 0),
      );
      timers.current.push(window.setTimeout(() => setUp(true), 60));
      timers.current.push(window.setTimeout(() => setFlipped(true), 780));
    } else {
      setUp(false);
      setFlipped(false);
    }
    return clearTimers;
  }, [active]);

  const bioRise = (delay: number): CSSProperties => ({
    opacity: up ? 1 : 0,
    transform: up ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity .55s ease ${delay}s, transform .6s cubic-bezier(.34,1.15,.64,1) ${delay}s`,
  });

  const faceBase: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: 28,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    boxShadow: CARD_SHADOW,
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none' }}>
      <div
        ref={(el) => {
          scrollRef.current = el;
          dragScroll(el);
        }}
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '104px 112px 56px',
          opacity: active ? 1 : 0,
          transition: 'opacity .5s ease',
          pointerEvents: active ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            flex: '0 0 auto',
            width: '100%',
            maxWidth: 1140,
            display: 'grid',
            gridTemplateColumns: '330px minmax(0, 1fr)',
            gridTemplateRows: '460px auto auto auto',
            columnGap: 64,
            rowGap: 56,
            alignContent: 'start',
          }}
        >
          {/* ROW 1 · COL 1 — portrait card (rises, then flips) */}
          <div style={{ position: 'relative', width: 330, height: 460, perspective: 1600, gridColumn: 1, gridRow: 1 }}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: -20,
                width: 390,
                height: 390,
                transform: 'translateX(-50%)',
                filter: 'blur(80px)',
                background: `radial-gradient(ellipse at center, ${glowSoft}, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                transform: `translateY(${up ? '0px' : '116%'}) rotateY(${flipped ? '180deg' : '0deg'})`,
                opacity: up ? 1 : 0,
                transition: 'transform .72s cubic-bezier(.34,1.2,.64,1), opacity .5s ease',
              }}
            >
              {/* FRONT: cover */}
              <div
                style={{
                  ...faceBase,
                  background: 'linear-gradient(180deg,#202024,#141416)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  opacity: flipped ? 0 : 1,
                  transition: 'opacity .05s linear .34s',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(120% 62% at 50% 0%, ${accentGlow}, transparent 62%)`,
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                  }}
                >
                  <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: '-0.04em', color: ACCENT, lineHeight: 1 }}>
                    Z
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      letterSpacing: '0.34em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.42)',
                    }}
                  >
                    About
                  </div>
                </div>
              </div>
              {/* BACK: portrait (placeholder) */}
              <div
                style={{
                  ...faceBase,
                  transform: 'rotateY(180deg)',
                  background: 'linear-gradient(180deg,#1c1c1f,#111113)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  opacity: flipped ? 1 : 0,
                  transition: 'opacity .05s linear .34s',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'repeating-linear-gradient(45deg,#242428 0 16px,#1d1d20 16px 32px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontSize: 14, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)' }}>
                    [ PORTRAIT ]
                  </span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 24,
                    bottom: 22,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  Zahin · About
                </div>
              </div>
            </div>
          </div>

          {/* ROW 1 · COL 2 — About Me heading + description */}
          <div
            style={{
              gridColumn: 2,
              gridRow: 1,
              height: 460,
              maxWidth: 620,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              ...bioRise(0.28),
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT }}>
              Zahin Ukasyah
            </div>
            <h2
              style={{
                marginTop: 16,
                fontSize: 'clamp(34px,3.6vw,52px)',
                fontWeight: 700,
                lineHeight: 1.03,
                letterSpacing: '-0.03em',
                color: '#fefefe',
              }}
            >
              About Me
            </h2>
            <p style={{ marginTop: 22, fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', maxWidth: 600 }}>
              Placeholder bio — a couple of sentences introducing who I am, what I care about, and
              the kind of work that keeps me up at night. Enough to give a warm first impression.
            </p>
            <p style={{ marginTop: 16, fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', maxWidth: 600 }}>
              Placeholder line — a second beat about how I got here and what I'm chasing next, kept
              short so the whole block sits comfortably beside the card.
            </p>
          </div>

          {/* ROW 2 · COL 1 — career timeline (most recent on top) */}
          <div style={{ gridColumn: 1, gridRow: 2, ...bioRise(0.4) }}>
            <div
              style={{
                fontSize: 'clamp(20px,2.2vw,28px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#fefefe',
                marginBottom: 26,
              }}
            >
              Career
            </div>
            {timelineData.map((ti, idx) => {
              const last = idx === timelineData.length - 1;
              const d = (0.42 + idx * 0.08).toFixed(2);
              return (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '44px 1fr auto',
                    columnGap: 18,
                    alignItems: 'start',
                    opacity: up ? 1 : 0,
                    transform: up ? 'translateY(0)' : 'translateY(14px)',
                    transition: `opacity .5s ease ${d}s, transform .55s cubic-bezier(.34,1.2,.64,1) ${d}s`,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 15,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: ACCENT, transform: 'rotate(45deg)' }} />
                    </div>
                    <div
                      style={{
                        width: 2,
                        flex: '1 1 auto',
                        marginTop: 8,
                        minHeight: last ? 0 : 32,
                        background: last
                          ? 'transparent'
                          : 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 19, fontWeight: 600, color: '#fefefe', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                      {ti.role}
                    </div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 4, whiteSpace: 'nowrap' }}>
                      {ti.org}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.42)',
                      whiteSpace: 'nowrap',
                      paddingTop: 16,
                    }}
                  >
                    {ti.date}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ROW 2 · COL 2 — My Hobbies */}
          <div style={{ gridColumn: 2, gridRow: 2, alignSelf: 'start', ...bioRise(0.5) }}>
            <div
              style={{
                textAlign: 'center',
                fontSize: 'clamp(20px,2.2vw,28px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#fefefe',
              }}
            >
              My Hobbies
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 18, marginTop: 28 }}>
              {HOBBY_ICONS.map((icon, i) => (
                <div
                  key={i}
                  className="lift-6 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-[rgba(255,255,255,0.2)]"
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 14,
                    cursor: 'default',
                    transition:
                      'transform .28s cubic-bezier(.34,1.4,.64,1), background .28s ease, border-color .28s ease',
                  }}
                >
                  <div style={{ color: ACCENT, display: 'flex' }}>{icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Placeholder</div>
                </div>
              ))}
            </div>
          </div>

          {/* ROW 3 · full width — Games I've been playing recently */}
          <div style={{ gridColumn: '1 / -1', gridRow: 3, marginTop: 8, ...bioRise(0.58) }}>
            <MediaGrid heading="Games I've been playing recently" items={gamesData} prefix="game" />
          </div>

          {/* ROW 4 · full width — Books I've been reading recently */}
          <div style={{ gridColumn: '1 / -1', gridRow: 4, marginTop: 8, ...bioRise(0.66) }}>
            <MediaGrid heading="Books I've been reading recently" items={booksData} prefix="book" />
          </div>
        </div>
      </div>
    </div>
  );
}
