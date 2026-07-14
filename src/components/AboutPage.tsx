import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  Brain,
  Clapperboard,
  Code,
  Cpu,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  Joystick,
  Lightbulb,
  Palette,
  Podcast,
  Puzzle,
} from 'lucide-react';
import portrait from '../assets/syah-portrait.jpg';
import portraitBack from '../assets/syah-portrait-back.jpg';
import { booksData, gamesData, moviesData, podcastsData, timelineData } from '../data/content';
import type { MediaItem } from '../data/content';
import { hexToRgba, shade } from '../lib/colors';
import { ACCENT, accentGlow, glowSoft } from '../lib/theme';
import { useDragScroll } from '../lib/useDragScroll';
import { useViewport } from '../lib/useViewport';
import FlipCard from './FlipCard';
import ImagePlaceholder from './ImagePlaceholder';

const CARD_SHADOW = '0 44px 90px -24px rgba(0,0,0,0.85), 0 10px 30px -12px rgba(0,0,0,0.5)';

const HOBBY_ICON = { size: 34, strokeWidth: 1.6 } as const;

const HOBBIES: { label: string; icon: ReactNode }[] = [
  { label: 'Video Games', icon: <Gamepad2 {...HOBBY_ICON} /> },
  { label: 'Game Dev', icon: <Joystick {...HOBBY_ICON} /> },
  { label: 'Philosophy', icon: <Lightbulb {...HOBBY_ICON} /> },
  { label: 'Anime', icon: <Clapperboard {...HOBBY_ICON} /> },
  { label: 'Psychology', icon: <Brain {...HOBBY_ICON} /> },
  { label: 'Puzzle Games', icon: <Puzzle {...HOBBY_ICON} /> },
  { label: 'Digital Arts', icon: <Palette {...HOBBY_ICON} /> },
  { label: 'Podcast', icon: <Podcast {...HOBBY_ICON} /> },
];

// Timeline node icons, matched by index to timelineData.
const TL_ICON = { size: 22, strokeWidth: 1.6 } as const;

const TIMELINE_ICONS: ReactNode[] = [
  <Code key="code" {...TL_ICON} />, // SWE Contract
  <Cpu key="cpu" {...TL_ICON} />, // MLE Trainee
  <FlaskConical key="flask" {...TL_ICON} />, // Research Assistant
  <GraduationCap key="cap" {...TL_ICON} />, // SWE Undergrad
];

function MediaGrid({ heading, items, prefix }: { heading: string; items: MediaItem[]; prefix: string }) {
  const vp = useViewport();
  const mobile = vp === 'mobile';
  const cols = mobile ? 2 : vp === 'tablet' ? 3 : 4;
  return (
    <>
      <div style={{ fontSize: 'clamp(20px,2.2vw,28px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fefefe' }}>
        {heading}
      </div>
      <div
        style={
          mobile
            ? {
                display: 'flex',
                gap: 14,
                overflowX: 'auto',
                margin: '28px -26px 0',
                padding: '4px 26px 12px',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }
            : {
                display: 'grid',
                gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`,
                gap: 20,
                marginTop: 28,
              }
        }
      >
        {items.map((g, idx) => (
          <FlipCard
            key={`${prefix}-${idx}`}
            className="lift-8"
            duration={0.55}
            wrapStyle={{
              position: 'relative',
              height: mobile ? 'clamp(210px, 62vw, 260px)' : 260,
              ...(mobile ? { flex: '0 0 min(62vw, 240px)', scrollSnapAlign: 'center' } : {}),
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
                <div style={{ minWidth: 0, marginTop: 14 }}>
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
  const [showTop, setShowTop] = useState(false);
  const vp = useViewport();
  const mobile = vp === 'mobile';
  const tablet = vp === 'tablet';
  // On mobile everything stacks in source order; otherwise pin to the 2-col grid.
  const cell = (col: number | string, row: number): CSSProperties =>
    mobile ? {} : { gridColumn: col, gridRow: row };
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
        onScroll={(e) => setShowTop(e.currentTarget.scrollTop > 320)}
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: mobile ? '88px 26px 56px' : tablet ? '96px 44px 52px' : '104px 112px 56px',
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
            gridTemplateColumns: mobile ? 'minmax(0, 1fr)' : '330px minmax(0, 1fr)',
            gridTemplateRows: mobile ? 'none' : '460px auto auto auto auto auto',
            columnGap: tablet ? 40 : 64,
            rowGap: mobile ? 44 : 56,
            alignContent: 'start',
          }}
        >
          {/* ROW 1 Â· COL 1 â€” portrait card (rises, then flips) */}
          <div
            style={{
              position: 'relative',
              width: 330,
              maxWidth: '100%',
              height: 460,
              perspective: 1600,
              ...cell(1, 1),
              ...(mobile ? { justifySelf: 'center' } : {}),
            }}
          >
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
              onClick={() => setFlipped((f) => !f)}
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                transform: `translateY(${up ? '0px' : '116%'}) rotateY(${flipped ? '180deg' : '0deg'})`,
                opacity: up ? 1 : 0,
                cursor: 'pointer',
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
              ...cell(2, 1),
              height: mobile ? 'auto' : 460,
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
          <div style={{ ...cell(1, 2), ...bioRise(0.4) }}>
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
                    <div
                      style={{
                        fontSize: mobile ? 17 : 19,
                        fontWeight: 600,
                        color: '#fefefe',
                        letterSpacing: '-0.01em',
                        whiteSpace: mobile ? 'normal' : 'nowrap',
                      }}
                    >
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
          <div style={{ ...cell(2, 2), alignSelf: 'start', ...bioRise(0.5) }}>
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${mobile ? 3 : 4},minmax(0,1fr))`,
                gap: mobile ? 12 : 16,
                marginTop: 28,
              }}
            >
              {HOBBIES.map((h) => (
                <div
                  key={h.label}
                  className="lift-6 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-[rgba(255,255,255,0.2)]"
                  style={{
                    height: mobile ? 116 : 148,
                    padding: '14px 10px',
                    borderRadius: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    cursor: 'default',
                    transition:
                      'transform .28s cubic-bezier(.34,1.4,.64,1), background .28s ease, border-color .28s ease',
                  }}
                >
                  <div style={{ color: ACCENT, display: 'flex' }}>{h.icon}</div>
                  <div
                    style={{
                      fontSize: mobile ? 13 : 15,
                      fontWeight: 600,
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {h.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROW 3 Â· full width â€” games */}
          <div style={{ ...cell('1 / -1', 3), marginTop: 8, ...bioRise(0.58) }}>
            <MediaGrid heading="Games I've been playing recently" items={gamesData} prefix="game" />
          </div>

          {/* ROW 4 Â· full width â€” books */}
          <div style={{ ...cell('1 / -1', 4), marginTop: 8, ...bioRise(0.66) }}>
            <MediaGrid heading="Books I've been reading recently" items={booksData} prefix="book" />
          </div>

          {/* ROW 5 Â· full width â€” movies */}
          <div style={{ ...cell('1 / -1', 5), marginTop: 8, ...bioRise(0.74) }}>
            <MediaGrid heading="Movies I've been watching recently" items={moviesData} prefix="movie" />
          </div>

          {/* ROW 6 Â· full width â€” podcasts */}
          <div style={{ ...cell('1 / -1', 6), marginTop: 8, ...bioRise(0.82) }}>
            <MediaGrid heading="Podcasts I've been listening to recently" items={podcastsData} prefix="podcast" />
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
          right: mobile ? 18 : 36,
          bottom: mobile ? 34 : 36,
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
