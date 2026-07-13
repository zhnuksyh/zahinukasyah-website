import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import portrait from '../assets/syah-portrait.jpg';
import portraitBack from '../assets/syah-portrait-back.jpg';
import { booksData, gamesData, moviesData, timelineData } from '../data/content';
import type { MediaItem } from '../data/content';
import { hexToRgba, shade, tint } from '../lib/colors';
import { ACCENT, accentGlow, glowSoft } from '../lib/theme';
import { useDragScroll } from '../lib/useDragScroll';
import FlipCard from './FlipCard';
import ImagePlaceholder from './ImagePlaceholder';

const CARD_SHADOW = '0 44px 90px -24px rgba(0,0,0,0.85), 0 10px 30px -12px rgba(0,0,0,0.5)';

const HOBBIES: { label: string; icon: ReactNode }[] = [
  {
    label: 'Video Games',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8h12a4 4 0 0 1 4 4v3a3 3 0 0 1-5.3 1.9L15 15H9l-1.7 1.9A3 3 0 0 1 2 15v-3a4 4 0 0 1 4-4z" />
        <line x1="7" y1="11" x2="10" y2="11" />
        <line x1="8.5" y1="9.5" x2="8.5" y2="12.5" />
        <circle cx="16" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="18" cy="12.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Game Dev',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 12l-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" />
        <path d="M17.64 15 22 10.64" />
        <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
      </svg>
    ),
  },
  {
    label: 'Philosophy',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-4 10.5c.6.55 1 1.3 1 2.05V16h6v-.45c0-.75.4-1.5 1-2.05A6 6 0 0 0 12 3z" />
      </svg>
    ),
  },
  {
    label: 'Anime',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="13" rx="2" />
        <polyline points="8 2.5 12 6 16 2.5" />
        <path d="m10.2 9.9 5 2.6-5 2.6z" />
      </svg>
    ),
  },
  {
    label: 'Psychology',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.5 3a6.5 6.5 0 0 1 6.5 6.5c0 1.3-.4 2.5-1 3.5l1.5 3h-2.5v2.5a2 2 0 0 1-2 2H12v2.5H7.5V18c-1.9-1.3-3-3.4-3-5.7A6.8 6.8 0 0 1 12.5 3z" />
        <path d="M10.5 9.5a2 2 0 1 1 2 2v1.5" />
        <line x1="12.5" y1="15.2" x2="12.5" y2="15.3" />
      </svg>
    ),
  },
  {
    label: 'Puzzle Games',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
      </svg>
    ),
  },
];

// Timeline node icons, matched by index to timelineData.
const TIMELINE_ICONS: ReactNode[] = [
  // SWE Contract — code
  <svg key="code" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>,
  // MLE Trainee — cpu
  <svg key="cpu" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <rect x="9.5" y="9.5" width="5" height="5" />
    <line x1="9" y1="2" x2="9" y2="5" />
    <line x1="15" y1="2" x2="15" y2="5" />
    <line x1="9" y1="19" x2="9" y2="22" />
    <line x1="15" y1="19" x2="15" y2="22" />
    <line x1="2" y1="9" x2="5" y2="9" />
    <line x1="2" y1="15" x2="5" y2="15" />
    <line x1="19" y1="9" x2="22" y2="9" />
    <line x1="19" y1="15" x2="22" y2="15" />
  </svg>,
  // Research Assistant — flask
  <svg key="flask" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v7.5L4.7 19a2 2 0 0 0 1.8 3h11a2 2 0 0 0 1.8-3L14 9.5V2" />
    <line x1="8.5" y1="2" x2="15.5" y2="2" />
    <line x1="7" y1="16" x2="17" y2="16" />
  </svg>,
  // SWE Undergrad — graduation cap
  <svg key="cap" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10 12 5 2 10l10 5 10-5z" />
    <path d="M6 12.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" />
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
                  {g.img ? (
                    <img
                      src={g.img}
                      alt={`${g.title} cover art`}
                      draggable={false}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ImagePlaceholder label="cover art" />
                  )}
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

export default function AboutPage({
  active,
  onScroll,
}: {
  active: boolean;
  onScroll?: (top: number) => void;
}) {
  const [up, setUp] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showTop, setShowTop] = useState(false);
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
      setShowTop(false);
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
        onScroll={(e) => {
          const top = e.currentTarget.scrollTop;
          onScroll?.(top);
          setShowTop(top > 320);
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
            gridTemplateRows: '460px auto auto auto auto',
            columnGap: 64,
            rowGap: 56,
            alignContent: 'start',
          }}
        >
          {/* ROW 1 Â· COL 1 â€” portrait card (rises, then flips) */}
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
                <img
                  src={portraitBack}
                  alt=""
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(120% 62% at 50% 0%, ${accentGlow}, transparent 62%)`,
                    pointerEvents: 'none',
                  }}
                />
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
                <img
                  src={portrait}
                  alt="Portrait of Zahin Ukasyah"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  draggable={false}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 24,
                    bottom: 22,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                  }}
                >
                  Zahin Ukasyah
                </div>
              </div>
            </div>
          </div>

          {/* ROW 1 Â· COL 2 â€” About Me heading + description */}
          <div
            style={{
              gridColumn: 2,
              gridRow: 1,
              height: 460,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              ...bioRise(0.28),
            }}
          >
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
            <p style={{ marginTop: 22, fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
              Hi, Zahin Ukasyah here! This is not a portfolio website, so let's keep things casual
              haha. I think I'm best described as a Puzzle Gamer? since I loved deck-building and
              rogue-likes games. However, I do equally loves wrestling with abstract ideas as
              well, as I have been long fascinated by the long studies of fundamental
              consciousness, especially now with the current rise of AI.
            </p>
            <p style={{ marginTop: 16, fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)' }}>
              Oh, I'm a SWE based in KL. I work on web/ mobile application dev mostly, and I likes
              to design too: flat vector art and UI/UX elements. This is getting too long haha,
              anyway, I'm glad that you're here. Let's be friends!
            </p>
          </div>

          {/* ROW 2 Â· COL 1 â€” career timeline (most recent on top) */}
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
              Career<span style={{ fontWeight: 400 }}>/</span> Academic
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
                      <div style={{ color: ACCENT, display: 'flex' }}>{TIMELINE_ICONS[idx]}</div>
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
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
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

          {/* ROW 2 Â· COL 2 â€” My Hobbies */}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 18, marginTop: 28 }}>
              {HOBBIES.map((h) => (
                <div
                  key={h.label}
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
                  <div style={{ color: ACCENT, display: 'flex' }}>{h.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{h.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ROW 3 Â· full width â€” games */}
          <div style={{ gridColumn: '1 / -1', gridRow: 3, marginTop: 8, ...bioRise(0.58) }}>
            <MediaGrid heading="Games I've been obsessing recently" items={gamesData} prefix="game" />
          </div>

          {/* ROW 4 Â· full width â€” books */}
          <div style={{ gridColumn: '1 / -1', gridRow: 4, marginTop: 8, ...bioRise(0.66) }}>
            <MediaGrid heading="Books I've been obsessing recently" items={booksData} prefix="book" />
          </div>

          {/* ROW 5 Â· full width â€” movies */}
          <div style={{ gridColumn: '1 / -1', gridRow: 5, marginTop: 8, ...bioRise(0.74) }}>
            <MediaGrid heading="Movies I've been obsessing recently" items={moviesData} prefix="movie" />
          </div>
        </div>
      </div>

      {/* back-to-top (appears once the page is scrolled a bit) */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'absolute',
          right: 36,
          bottom: 36,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'rgba(22,22,25,0.85)',
          backdropFilter: 'blur(8px)',
          color: '#fefefe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 18px 40px -18px rgba(0,0,0,0.8)',
          opacity: active && showTop ? 1 : 0,
          transform: active && showTop ? 'translateY(0)' : 'translateY(14px)',
          pointerEvents: active && showTop ? 'auto' : 'none',
          transition: 'opacity .3s ease, transform .3s cubic-bezier(.34,1.4,.64,1)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}
