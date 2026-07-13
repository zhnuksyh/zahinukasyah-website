import { useEffect, useRef, useState } from 'react';
import { gameParas, gamesArcadeData } from '../data/content';
import { hexToRgba, shade, tint } from '../lib/colors';
import { useDragScroll } from '../lib/useDragScroll';
import CloseButton from './CloseButton';

const COLS = 16;
const ROWS = 9;
const CELL_W = 100 / COLS;
const CELL_H = 100 / ROWS;

/** Back face for the Games card: a walkable arcade floor plus a fullscreen game detail. */
export default function ArcadeBack({ open }: { open: boolean }) {
  const [pos, setPos] = useState({ x: 8, y: 7 });
  const [gameSel, setGameSel] = useState<number | null>(null);
  const [gameAnim, setGameAnim] = useState(false);
  const timers = useRef<number[]>([]);
  const dragScroll = useDragScroll();

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const openGame = (i: number) => {
    clearTimers();
    setGameSel(i);
    setGameAnim(false);
    timers.current.push(window.setTimeout(() => setGameAnim(true), 30));
  };

  const closeGame = () => {
    clearTimers();
    setGameAnim(false);
    timers.current.push(window.setTimeout(() => setGameSel(null), 400));
  };

  useEffect(() => {
    if (!open) {
      clearTimers();
      setGameSel(null);
      setGameAnim(false);
    }
  }, [open]);

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (gameSel !== null) {
        if (key === 'Escape') {
          e.preventDefault();
          closeGame();
        }
        return;
      }
      let { x, y } = pos;
      let moved = false;
      if (key === 'ArrowUp' || key === 'w' || key === 'W') {
        y = Math.max(0, y - 1);
        moved = true;
      } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
        y = Math.min(ROWS - 1, y + 1);
        moved = true;
      } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        x = Math.max(0, x - 1);
        moved = true;
      } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        x = Math.min(COLS - 1, x + 1);
        moved = true;
      } else if (key === 'Enter' || key === ' ' || key === 'e' || key === 'E') {
        const hit = gamesArcadeData.findIndex((o) => o.x === pos.x && o.y === pos.y);
        if (hit >= 0) {
          e.preventDefault();
          openGame(hit);
        }
        return;
      }
      if (moved) {
        e.preventDefault();
        setPos({ x, y });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, pos, gameSel]);

  const hint = gamesArcadeData.find((o) => o.x === pos.x && o.y === pos.y);
  const gg = gamesArcadeData[gameSel ?? 0] ?? gamesArcadeData[0];

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          backgroundColor: '#0a0a0b',
          backgroundImage:
            'radial-gradient(120% 130% at 50% 38%, rgba(255,255,255,0.05), transparent 62%),' +
            'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: `100% 100%, ${CELL_W}% 100%, 100% ${CELL_H}%`,
        }}
      >
        {/* HUD */}
        <div
          style={{
            position: 'absolute',
            top: 26,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 9,
            zIndex: 8,
            pointerEvents: 'none',
            padding: '0 20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            Arcade
          </div>
          <div
            style={{
              fontSize: 'clamp(22px,2.6vw,34px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#fafafa',
            }}
          >
            Walk the space · visit a game
          </div>
          <div
            style={{
              marginTop: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.42)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: 'rgba(255,255,255,0.8)',
                  padding: '4px 9px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 7,
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                WASD
              </span>
              move
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: 'rgba(255,255,255,0.8)',
                  padding: '4px 9px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 7,
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                Enter
              </span>
              visit
            </span>
          </div>
        </div>

        {/* ORBS */}
        {gamesArcadeData.map((o, idx) => {
          const on = o.x === pos.x && o.y === pos.y;
          return (
            <div
              key={idx}
              onClick={() => openGame(idx)}
              style={{
                position: 'absolute',
                left: `${o.x * CELL_W}%`,
                top: `${o.y * CELL_H}%`,
                width: `${CELL_W}%`,
                height: `${CELL_H}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '78%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: on ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                  transition: 'color .2s ease',
                  pointerEvents: 'none',
                }}
              >
                {o.title}
              </div>
              <div
                style={{
                  width: on ? '48%' : '40%',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 38% 30%, #ffffff, ${on ? '#ececee' : '#c9c9cd'} 55%, ${on ? '#8f8f96' : '#67676e'})`,
                  boxShadow: on
                    ? '0 0 0 5px rgba(255,255,255,0.12), 0 0 40px 12px rgba(255,255,255,0.45)'
                    : '0 0 22px 5px rgba(255,255,255,0.16)',
                  transition: 'all .22s cubic-bezier(.34,1.4,.64,1)',
                }}
              />
            </div>
          );
        })}

        {/* PLAYER */}
        <div
          style={{
            position: 'absolute',
            left: `${pos.x * CELL_W}%`,
            top: `${pos.y * CELL_H}%`,
            width: `${CELL_W}%`,
            height: `${CELL_H}%`,
            transition: 'left .13s cubic-bezier(.4,0,.2,1), top .13s cubic-bezier(.4,0,.2,1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 6,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: '52%',
              aspectRatio: '1',
              borderRadius: '32% 32% 36% 36%',
              background: 'linear-gradient(180deg,#ffffff,#cfcfd4)',
              boxShadow: '0 7px 18px rgba(0,0,0,0.55), inset 0 -3px 6px rgba(0,0,0,0.14)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '36%',
                left: '26%',
                width: '13%',
                aspectRatio: '1',
                borderRadius: '50%',
                background: '#17171a',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '36%',
                right: '26%',
                width: '13%',
                aspectRatio: '1',
                borderRadius: '50%',
                background: '#17171a',
              }}
            />
          </div>
        </div>

        {/* INTERACT PROMPT */}
        {hint ? (
          <div
            style={{
              position: 'absolute',
              bottom: 34,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 22px',
              borderRadius: 999,
              background: 'rgba(14,14,17,0.84)',
              border: '1px solid rgba(255,255,255,0.16)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 14px 36px -12px rgba(0,0,0,0.7)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              {hint.title}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#fafafa' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  padding: '4px 9px',
                  border: '1px solid rgba(255,255,255,0.24)',
                  borderRadius: 7,
                  background: 'rgba(255,255,255,0.06)',
                }}
              >
                Enter
              </span>
              visit
            </span>
          </div>
        ) : null}
      </div>

      {/* GAME DETAIL (orb → full screen) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 480,
          background: '#0a0a0b',
          opacity: gameSel !== null ? 1 : 0,
          pointerEvents: gameSel !== null ? 'auto' : 'none',
          transition: 'opacity .4s ease',
        }}
      >
        <div onClick={closeGame} style={{ position: 'absolute', inset: 0 }} />
        <div
          ref={dragScroll}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            transform: gameAnim ? 'scale(1)' : 'scale(0.94)',
            opacity: gameAnim ? 1 : 0,
            transition: 'transform .5s cubic-bezier(.34,1.2,.64,1), opacity .4s ease',
          }}
        >
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 40px 90px' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '21 / 9',
                borderRadius: 24,
                overflow: 'hidden',
                background: `linear-gradient(150deg, ${tint(gg.c, 0.1)}, ${shade(gg.c, 0.34)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 50px 100px -40px ' + hexToRgba(gg.c, 0.6),
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 13,
                  letterSpacing: '0.24em',
                  color: 'rgba(255,255,255,0.62)',
                  background: 'rgba(0,0,0,0.22)',
                  padding: '7px 14px',
                  borderRadius: 999,
                }}
              >
                [ COVER IMAGE ]
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 30,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              <span style={{ color: tint(gg.c, 0.22) }}>{gg.cat}</span>
              <span>&middot;</span>
              <span>{gg.meta}</span>
            </div>
            <h2
              style={{
                marginTop: 16,
                fontSize: 'clamp(30px,3.4vw,46px)',
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: '#fefefe',
                maxWidth: 760,
                textWrap: 'pretty',
              }}
            >
              {gg.title}
            </h2>
            <div
              style={{ marginTop: 24, maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 18 }}
            >
              {gameParas.map((p, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
                  {p}
                </p>
              ))}
            </div>
            <a
              href={gg.href}
              className="cta-lift"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 42,
                padding: '15px 28px',
                borderRadius: 999,
                background: `linear-gradient(180deg, ${tint(gg.c, 0.16)}, ${gg.c})`,
                color: shade(gg.c, 0.74),
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                cursor: 'pointer',
                boxShadow: '0 16px 40px -16px ' + hexToRgba(gg.c, 0.85),
                transition: 'transform .2s ease, filter .2s ease',
              }}
            >
              <span>Travel to the Game</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
        {gameSel !== null ? <CloseButton onClick={closeGame} zIndex={490} /> : null}
      </div>
    </>
  );
}
