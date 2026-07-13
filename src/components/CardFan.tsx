import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { accentGlow, glowSoft } from '../lib/theme';
import CloseButton from './CloseButton';
import DesignBentoBack from './DesignBentoBack';
import ApplicationBack from './ApplicationBack';
import ResearchBack from './ResearchBack';
import ArcadeBack from './ArcadeBack';

const ROTS = [-12, -6.5, 0, 6.5, 12];
const TXS = [-345, -192, 0, 192, 345];
const BOTTOMS = [-248, -214, -174, -214, -248];
const WIDTHS = [290, 300, 330, 300, 290];
const HEIGHTS = [465, 475, 500, 475, 465];
const ZS = [1, 2, 3, 2, 1];

const CARD_TRANSITION = 'transform .34s cubic-bezier(.34,1.3,.64,1)';
const FRONT_TRANSITION = 'box-shadow .34s ease, border-color .34s ease, opacity .12s linear';
const BACK_TRANSITION = 'opacity .12s linear';

interface SelInfo {
  pos: HTMLElement;
  card: HTMLElement;
  faces: HTMLElement[];
  W: number;
  H: number;
  rot: number;
  rest: { left: number; top: number };
  i: number;
}

interface CardSpec {
  title: string;
  sub: string;
  alignRight?: boolean;
  back: ReactNode;
  /** back faces that provide their own full-bleed background (research, arcade) */
  plainBack?: boolean;
}

export default function CardFan({ onOpenDesign }: { onOpenDesign: (i: number) => void }) {
  const fanRef = useRef<HTMLDivElement>(null);
  const selRef = useRef<SelInfo | null>(null);
  const timers = useRef<number[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [showClose, setShowClose] = useState(false);
  // features on the back faces stay live only between open-start and close-start
  const [featureSel, setFeatureSel] = useState<number | null>(null);
  const [vw, setVw] = useState(() => window.innerWidth);
  // mobile: the fan becomes a swipe carousel and cards open as a simple overlay
  const [mobileSel, setMobileSel] = useState<number | null>(null);
  const [mobileAnim, setMobileAnim] = useState(false);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const mobile = vw < 768;

  // scale the whole fan down on narrow screens so it always fits the viewport
  const s = Math.min(1, Math.max(0.34, (vw - 24) / 1030));
  const txs = TXS.map((v) => Math.round(v * s));
  const bottoms = BOTTOMS.map((v) => Math.round(v * s));
  const widths = WIDTHS.map((v) => Math.round(v * s));
  const heights = HEIGHTS.map((v) => Math.round(v * s));

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const showFace = (faces: HTMLElement[], back: boolean) => {
    faces[0].style.transition = FRONT_TRANSITION;
    faces[1].style.transition = BACK_TRANSITION;
    faces[0].style.opacity = back ? '0' : '1';
    faces[1].style.opacity = back ? '1' : '0';
  };

  // push the non-selected cards outward + down and fade them, clearing the stage
  const scatterOthers = (i: number) => {
    const fan = fanRef.current;
    if (!fan) return;
    fan.querySelectorAll<HTMLElement>('[data-card]').forEach((pos) => {
      const j = +pos.getAttribute('data-card')!;
      if (j === i) return;
      pos.style.transition = 'transform .5s cubic-bezier(.5,0,.2,1), opacity .45s ease';
      pos.style.transform = `translateX(${txs[j] * 1.6}px) translateY(150px) rotate(${ROTS[j]}deg) scale(0.88)`;
      pos.style.opacity = '0';
      pos.style.pointerEvents = 'none';
    });
  };

  // fan the OTHER cards (not i) back into place
  const restoreOthers = (i: number) => {
    const fan = fanRef.current;
    if (!fan) return;
    fan.querySelectorAll<HTMLElement>('[data-card]').forEach((pos) => {
      const j = +pos.getAttribute('data-card')!;
      if (j === i) return;
      pos.style.transition = 'transform .58s cubic-bezier(.34,1.2,.64,1), opacity .5s ease';
      pos.style.transform = `translateX(${txs[j]}px) rotate(${ROTS[j]}deg)`;
      pos.style.opacity = '';
      pos.style.pointerEvents = '';
    });
    timers.current.push(
      window.setTimeout(() => {
        fan.querySelectorAll<HTMLElement>('[data-card]').forEach((pos) => {
          if (+pos.getAttribute('data-card')! !== i) pos.style.transition = '';
        });
      }, 720),
    );
  };

  // put the selected card's inline styles back to their exact resting values,
  // so the fixed->absolute swap is pixel-identical (no flicker).
  const restoreSelected = (i: number) => {
    const s = selRef.current;
    if (!s) return;
    const { pos, card, faces } = s;
    pos.style.transition = '';
    pos.style.position = 'absolute';
    pos.style.left = '50%';
    pos.style.top = '';
    pos.style.bottom = bottoms[i] + 'px';
    pos.style.width = widths[i] + 'px';
    pos.style.height = heights[i] + 'px';
    pos.style.marginLeft = -widths[i] / 2 + 'px';
    pos.style.transform = `translateX(${txs[i]}px) rotate(${ROTS[i]}deg)`;
    pos.style.zIndex = String(ZS[i]);
    pos.style.perspective = '1200px';
    pos.style.opacity = '';
    pos.style.pointerEvents = '';
    card.style.transition = CARD_TRANSITION;
    card.style.transform = '';
    const r = i === 2 ? '28px' : '26px';
    faces[0].style.transition = FRONT_TRANSITION;
    faces[1].style.transition = BACK_TRANSITION;
    faces[0].style.borderRadius = r;
    faces[1].style.borderRadius = r;
    faces[0].style.opacity = ''; // front visible at rest
    faces[1].style.opacity = '0'; // back hidden at rest
    if (fanRef.current) fanRef.current.style.zIndex = '5';
  };

  const openCard = (e: MouseEvent, i: number) => {
    e.preventDefault();
    if (sel !== null || !fanRef.current) return;
    clearTimers();

    const pos = fanRef.current.querySelector<HTMLElement>(`[data-card="${i}"]`)!;
    const card = pos.querySelector<HTMLElement>('[data-face]')!;
    const faces = Array.from(pos.querySelectorAll<HTMLElement>('[data-facepane]'));
    const W = widths[i];
    const H = heights[i];
    const rot = ROTS[i];
    const b = pos.getBoundingClientRect();
    // rotation is around the center; derive the un-rotated top-left so the fixed
    // element lands exactly on the tilted card.
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const rest = { left: cx - W / 2, top: cy - H / 2 };
    selRef.current = { pos, card, faces, W, H, rot, rest, i };

    // lift the fan out of its stacking context so the fixed card can cover the page
    fanRef.current.style.zIndex = '300';

    // FREEZE the real card exactly where it sits, as a fixed element
    pos.style.transition = 'none';
    pos.style.position = 'fixed';
    pos.style.left = rest.left + 'px';
    pos.style.top = rest.top + 'px';
    pos.style.width = W + 'px';
    pos.style.height = H + 'px';
    pos.style.marginLeft = '0';
    pos.style.bottom = 'auto';
    pos.style.transform = `rotate(${rot}deg)`;
    pos.style.perspective = '1200px';
    pos.style.zIndex = '10';
    // drop any hover lift smoothly
    card.style.transition = 'transform .4s ease';
    card.style.transform = 'rotateY(0deg)';

    scatterOthers(i);
    setSel(i);
    setFeatureSel(i);
    setShowClose(false);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ease = 'cubic-bezier(.6,0,.15,1)';
    const moveT = `left .62s ${ease}, top .62s ${ease}, width .62s ${ease}, height .62s ${ease}, transform .62s ${ease}, border-radius .62s ${ease}`;

    // 1) glide to center
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        pos.style.transition = moveT;
        pos.style.left = (vw - W) / 2 + 'px';
        pos.style.top = (vh - H) / 2 + 'px';
        pos.style.transform = 'rotate(0deg) scale(1.06)';
      }),
    );
    // 2) flip to the back; swap faces at the edge-on midpoint (~90deg)
    timers.current.push(
      window.setTimeout(() => {
        card.style.transition = `transform .56s ${ease}`;
        card.style.transform = 'rotateY(180deg)';
      }, 760),
    );
    timers.current.push(window.setTimeout(() => showFace(faces, true), 760 + 280));
    // 3) fill the screen
    timers.current.push(
      window.setTimeout(() => {
        pos.style.transition = moveT;
        pos.style.left = '0px';
        pos.style.top = '0px';
        pos.style.width = vw + 'px';
        pos.style.height = vh + 'px';
        pos.style.transform = 'rotate(0deg) scale(1)';
        faces.forEach((f) => {
          f.style.transition = 'border-radius .5s ease';
          f.style.borderRadius = '0px';
        });
        setShowClose(true);
      }, 1320),
    );
  };

  const closeCard = () => {
    const s = selRef.current;
    if (!s) return;
    clearTimers();
    const { pos, card, faces, W, H, rot, rest, i } = s;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ease = 'cubic-bezier(.6,0,.15,1)';
    const moveT = `left .58s ${ease}, top .58s ${ease}, width .58s ${ease}, height .58s ${ease}, transform .58s ${ease}, border-radius .58s ${ease}`;

    setShowClose(false);
    setFeatureSel(null);

    // 1) shrink back from full-screen to the centered card
    pos.style.transition = moveT;
    pos.style.left = (vw - W) / 2 + 'px';
    pos.style.top = (vh - H) / 2 + 'px';
    pos.style.width = W + 'px';
    pos.style.height = H + 'px';
    pos.style.transform = 'rotate(0deg) scale(1.06)';
    const r = i === 2 ? '28px' : '26px';
    faces.forEach((f) => {
      f.style.transition = 'border-radius .5s ease';
      f.style.borderRadius = r;
    });

    // 2) flip back to the front; swap faces at the edge-on midpoint
    timers.current.push(
      window.setTimeout(() => {
        card.style.transition = `transform .52s ${ease}`;
        card.style.transform = 'rotateY(0deg)';
      }, 300),
    );
    timers.current.push(window.setTimeout(() => showFace(faces, false), 300 + 260));

    // 3) travel home to the exact resting spot (+ fan the others back in).
    // Drop the card into its FINAL stacking order NOW, while it is still traveling, so
    // it rejoins the fan in the correct z-order and nothing reorders at the settle.
    timers.current.push(
      window.setTimeout(() => {
        pos.style.zIndex = String(ZS[i]);
        pos.style.transition = `left .56s cubic-bezier(.34,1.1,.64,1), top .56s cubic-bezier(.34,1.1,.64,1), transform .56s ease`;
        pos.style.left = rest.left + 'px';
        pos.style.top = rest.top + 'px';
        pos.style.transform = `rotate(${rot}deg) scale(1)`;
        restoreOthers(i);
      }, 760),
    );

    // 4) settle: convert fixed -> absolute at the identical spot. Because the geometry
    // matches to the pixel, the same element simply rejoins the fan.
    timers.current.push(
      window.setTimeout(() => {
        restoreSelected(i);
        selRef.current = null;
        setSel(null);
      }, 1330),
    );
  };

  const cards: CardSpec[] = [
    {
      title: 'Design',
      sub: 'placeholder',
      back: (
        <DesignBentoBack label="Everything I've ever designed" title="Design" onOpenTile={onOpenDesign} />
      ),
    },
    {
      title: 'Animation',
      sub: 'placeholder',
      back: (
        <DesignBentoBack
          label="Everything I've ever animated"
          title="Animation"
          onOpenTile={onOpenDesign}
        />
      ),
    },
    {
      title: 'Application',
      sub: 'placeholder',
      back: <ApplicationBack />,
    },
    {
      title: 'Research',
      sub: 'placeholder',
      alignRight: true,
      back: <ResearchBack open={featureSel === 3} />,
      plainBack: true,
    },
    {
      title: 'Games',
      sub: 'enter the arcade',
      alignRight: true,
      back: <ArcadeBack open={featureSel === 4} />,
      plainBack: true,
    },
  ];

  const openMobile = (i: number) => {
    clearTimers();
    setMobileSel(i);
    setFeatureSel(i);
    setMobileAnim(false);
    setShowClose(false);
    timers.current.push(window.setTimeout(() => setMobileAnim(true), 30));
    timers.current.push(window.setTimeout(() => setShowClose(true), 380));
  };

  const closeMobile = () => {
    clearTimers();
    setShowClose(false);
    setMobileAnim(false);
    setFeatureSel(null);
    timers.current.push(window.setTimeout(() => setMobileSel(null), 420));
  };

  if (mobile) {
    const mc = mobileSel !== null ? cards[mobileSel] : null;
    return (
      <>
        {showClose ? <CloseButton onClick={closeMobile} zIndex={350} animateIn /> : null}
        <div style={{ flexShrink: 0, position: 'relative', zIndex: 5 }}>
          <div
            style={{
              display: 'flex',
              gap: 14,
              overflowX: 'auto',
              padding: '10px 24px 26px',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {cards.map((c, i) => (
              <a
                key={i}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openMobile(i);
                }}
                style={{
                  position: 'relative',
                  flex: '0 0 auto',
                  width: 'min(58vw, 240px)',
                  aspectRatio: '33 / 46',
                  scrollSnapAlign: 'center',
                  borderRadius: 24,
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg,#1c1c20,#131315)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 30px 60px -24px rgba(0,0,0,0.8)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(120% 60% at 50% 0%, ${accentGlow}, transparent 60%)`,
                  }}
                />
                <div style={{ position: 'relative', padding: '18px 18px', textAlign: c.alignRight ? 'right' : 'left' }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: '#f4f4f4' }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{c.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* fullscreen card content */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: mc?.plainBack ? '#0a0a0b' : 'linear-gradient(180deg,#161618,#0e0e10)',
            opacity: mobileAnim ? 1 : 0,
            transform: mobileAnim ? 'scale(1)' : 'scale(0.96)',
            pointerEvents: mobileSel !== null ? 'auto' : 'none',
            transition: 'opacity .4s ease, transform .45s cubic-bezier(.34,1.2,.64,1)',
            ...(mc && !mc.plainBack ? { display: 'flex', flexDirection: 'column' } : {}),
          }}
        >
          {mc ? mc.back : null}
        </div>
      </>
    );
  }

  return (
    <>
      {showClose ? <CloseButton onClick={closeCard} zIndex={350} animateIn /> : null}
      <div ref={fanRef} style={{ flexShrink: 0, position: 'relative', height: Math.round(334 * s), zIndex: 5 }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: Math.round(-196 * s),
            width: Math.round(950 * s),
            height: Math.round(530 * s),
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            filter: 'blur(90px)',
            background: `radial-gradient(ellipse at center, ${glowSoft}, transparent 70%)`,
            animation: 'float-glow 9s ease-in-out infinite',
          }}
        />
        {cards.map((c, i) => {
          const center = i === 2;
          const outer = i === 0 || i === 4;
          const radius = center ? 28 : 26;
          const frontClass = center
            ? 'border border-[rgba(255,255,255,0.12)] shadow-[0_44px_90px_-24px_rgba(0,0,0,0.85)] group-hover:border-[rgba(255,255,255,0.3)] group-hover:shadow-[0_58px_110px_-22px_rgba(0,0,0,0.9)]'
            : outer
              ? 'border border-[rgba(255,255,255,0.07)] shadow-[0_30px_60px_-22px_rgba(0,0,0,0.75)] group-hover:border-[rgba(255,255,255,0.24)] group-hover:shadow-[0_44px_80px_-20px_rgba(0,0,0,0.85)]'
              : 'border border-[rgba(255,255,255,0.07)] shadow-[0_34px_66px_-22px_rgba(0,0,0,0.78)] group-hover:border-[rgba(255,255,255,0.24)] group-hover:shadow-[0_48px_88px_-20px_rgba(0,0,0,0.85)]';
          return (
            <div
              key={i}
              data-card={i}
              style={{
                position: 'absolute',
                left: '50%',
                bottom: bottoms[i],
                width: widths[i],
                height: heights[i],
                marginLeft: -widths[i] / 2,
                transform: `translateX(${txs[i]}px) rotate(${ROTS[i]}deg)`,
                zIndex: ZS[i],
                perspective: 1200,
                transformStyle: 'preserve-3d',
              }}
            >
              <a
                href="#"
                onClick={(e) => openCard(e, i)}
                data-face=""
                className={`group ${center ? 'lift-18' : 'lift-16'}`}
                style={{
                  display: 'block',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: CARD_TRANSITION,
                }}
              >
                {/* front face */}
                <div
                  data-facepane=""
                  className={frontClass}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: radius,
                    overflow: 'hidden',
                    backfaceVisibility: 'hidden',
                    background: center
                      ? 'linear-gradient(180deg,#202024,#141416)'
                      : i === 0 || i === 4
                        ? 'linear-gradient(180deg,#1a1a1d,#111113)'
                        : 'linear-gradient(180deg,#1c1c1f,#121214)',
                    transition: FRONT_TRANSITION,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(120% ${center ? 62 : 60}% at 50% 0%, ${accentGlow}, transparent ${center ? 62 : 60}%)`,
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      padding: center
                        ? `${Math.max(12, Math.round(22 * s))}px ${Math.max(13, Math.round(24 * s))}px`
                        : `${Math.max(11, Math.round(20 * s))}px ${Math.max(12, Math.round(22 * s))}px`,
                      textAlign: c.alignRight ? 'right' : 'left',
                    }}
                  >
                    <div
                      style={{
                        fontSize: Math.max(14, Math.round((center ? 21 : 19) * s)),
                        fontWeight: 600,
                        color: center ? '#f6f6f6' : '#f2f2f2',
                      }}
                    >
                      {c.title}
                    </div>
                    <div
                      style={{
                        fontSize: Math.max(10, Math.round(12 * s)),
                        color: center ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.38)',
                        marginTop: 2,
                      }}
                    >
                      {c.sub}
                    </div>
                  </div>
                </div>
                {/* back face */}
                <div
                  data-facepane=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: radius,
                    overflow: 'hidden',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: c.plainBack ? '#0a0a0b' : 'linear-gradient(180deg,#161618,#0e0e10)',
                    opacity: 0,
                    transition: BACK_TRANSITION,
                    ...(c.plainBack ? {} : { display: 'flex', flexDirection: 'column' }),
                  }}
                >
                  {c.back}
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
}
