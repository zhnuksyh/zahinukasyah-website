import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { gameParas, gamesArcadeData } from '../data/content';
import { hexToRgba, shade, tint } from '../lib/colors';
import { useDragScroll } from '../lib/useDragScroll';
import { useViewport } from '../lib/useViewport';
import CloseButton from './CloseButton';

// Odd counts so the board has a true center cell — the character's home
// square lands exactly on the middle of the screen.
const COLS = 15;
const ROWS = 9;
const HOME = { x: 7, y: 4 };
const KEYCAP_FONT = "'Poppins', sans-serif";

interface WalkTarget {
  x: number;
  y: number;
  game: number | null;
}

/** Back face for the Games card: a walkable arcade floor plus a fullscreen game detail. */
export default function ArcadeBack({ open }: { open: boolean }) {
  const [pos, setPos] = useState({ x: HOME.x, y: HOME.y });
  const [walkTarget, setWalkTarget] = useState<WalkTarget | null>(null);
  const [showKeys, setShowKeys] = useState(true);
  const [gameSel, setGameSel] = useState<number | null>(null);
  const [gameAnim, setGameAnim] = useState(false);
  const timers = useRef<number[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragScroll = useDragScroll();
  const mobile = useViewport() === 'mobile';

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
      setWalkTarget(null);
      setPos({ x: HOME.x, y: HOME.y });
    }
  }, [open]);

  useEffect(() => () => clearTimers(), []);

  // Show the key hints briefly each time the card opens, then fade them out.
  useEffect(() => {
    if (!open) {
      setShowKeys(true);
      return;
    }
    const id = window.setTimeout(() => setShowKeys(false), 4000);
    return () => clearTimeout(id);
  }, [open]);

  // Auto-walk: step one square at a time toward a clicked cell; if the cell
  // holds a game, open it on arrival.
  useEffect(() => {
    if (walkTarget === null) return;
    if (pos.x === walkTarget.x && pos.y === walkTarget.y) {
      const g = walkTarget.game;
      setWalkTarget(null);
      if (g !== null) openGame(g);
      return;
    }
    const id = window.setTimeout(() => {
      setPos((p) => {
        const dx = Math.sign(walkTarget.x - p.x);
        if (dx !== 0) return { ...p, x: p.x + dx };
        return { ...p, y: p.y + Math.sign(walkTarget.y - p.y) };
      });
    }, 150);
    return () => clearTimeout(id);
  }, [walkTarget, pos]);

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
        setWalkTarget(null);
        setPos({ x, y });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, pos, gameSel]);

  const hint = gamesArcadeData.find((o) => o.x === pos.x && o.y === pos.y);
  const gg = gamesArcadeData[gameSel ?? 0] ?? gamesArcadeData[0];

  // The floor keeps square cells everywhere; on phones it turns portrait
  // (rows and columns swap) so the board stays big enough to walk around.
  const dCols = mobile ? ROWS : COLS;
  const dRows = mobile ? COLS : ROWS;
  const cw = 100 / dCols;
  const ch = 100 / dRows;
  const colOf = (p: { x: number; y: number }) => (mobile ? p.y : p.x);
  const rowOf = (p: { x: number; y: number }) => (mobile ? p.x : p.y);

  // step in screen directions; translate back into data coordinates
  const step = (dc: number, dr: number) => {
    const mx = mobile ? dr : dc;
    const my = mobile ? dc : dr;
    setWalkTarget(null);
    setPos((p) => ({
      x: Math.min(COLS - 1, Math.max(0, p.x + mx)),
      y: Math.min(ROWS - 1, Math.max(0, p.y + my)),
    }));
  };

  // Click anywhere on the floor: walk to that cell (clamped to the board).
  const onFloorClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    if (!grid) return;
    const r = grid.getBoundingClientRect();
    const dc = Math.min(dCols - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * dCols)));
    const dr = Math.min(dRows - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * dRows)));
    const cell = mobile ? { x: dr, y: dc } : { x: dc, y: dr };
    const game = gamesArcadeData.findIndex((o) => o.x === cell.x && o.y === cell.y);
    if (game >= 0 && cell.x === pos.x && cell.y === pos.y) {
      openGame(game);
      return;
    }
    setWalkTarget({ x: cell.x, y: cell.y, game: game >= 0 ? game : null });
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          backgroundColor: '#0a0a0b',
          backgroundImage:
            'radial-gradient(120% 130% at 50% 38%, rgba(255,255,255,0.05), transparent 62%)',
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
              fontSize: 'clamp(22px,2.6vw,34px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#fafafa',
            }}
          >
            Have a look around!
          </div>
          {mobile ? (
            <div
              style={{
                marginTop: 4,
                fontSize: 12.5,
                color: 'rgba(255,255,255,0.42)',
                opacity: showKeys ? 1 : 0,
                transition: 'opacity 1s ease',
              }}
            >
              use the pad to walk · step on a game to visit
            </div>
          ) : (
            <div
              style={{
                marginTop: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                fontSize: 12.5,
                color: 'rgba(255,255,255,0.42)',
                opacity: showKeys ? 1 : 0,
                transition: 'opacity 1s ease',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: KEYCAP_FONT,
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
                    fontFamily: KEYCAP_FONT,
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
          )}
          {/* INTERACT PROMPT */}
          {hint ? (
            <div
              onClick={() => {
                const hit = gamesArcadeData.findIndex((o) => o.x === pos.x && o.y === pos.y);
                if (hit >= 0) openGame(hit);
              }}
              style={{
                marginTop: 6,
                pointerEvents: 'auto',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: '#fafafa' }}>
                visit
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </div>
          ) : null}
        </div>

        {/* FLOOR — aspect-locked so cells stay square */}
        <div
          onClick={onFloorClick}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: mobile ? '128px 14px 196px' : '90px 20px 150px',
            cursor: 'pointer',
          }}
        >
          <div
            ref={gridRef}
            style={{
              position: 'relative',
              height: '100%',
              aspectRatio: `${dCols} / ${dRows}`,
              maxWidth: '100%',
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),' +
                'linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: `${cw}% 100%, 100% ${ch}%`,
            }}
          >
        {/* ORBS */}
        {gamesArcadeData.map((o, idx) => {
          const on = o.x === pos.x && o.y === pos.y;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${colOf(o) * cw}%`,
                top: `${rowOf(o) * ch}%`,
                width: `${cw}%`,
                height: `${ch}%`,
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#232327',
                }}
              >
                {idx + 1}
              </div>
            </div>
          );
        })}

        {/* PLAYER */}
        <div
          style={{
            position: 'absolute',
            left: `${colOf(pos) * cw}%`,
            top: `${rowOf(pos) * ch}%`,
            width: `${cw}%`,
            height: `${ch}%`,
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
                inset: 0,
                animation: 'eye-look 7s ease-in-out infinite',
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
                  animation: 'eye-blink 4.4s infinite',
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
                  animation: 'eye-blink 4.4s infinite',
                }}
              />
            </div>
          </div>
        </div>
          </div>
        </div>

        {/* D-PAD */}
        <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 48px)',
              gridTemplateRows: 'repeat(2, 48px)',
              gap: 7,
            }}
          >
            {(
              [
                { dc: 0, dr: -1, col: 2, row: 1, rot: 0 },
                { dc: -1, dr: 0, col: 1, row: 2, rot: -90 },
                { dc: 0, dr: 1, col: 2, row: 2, rot: 180 },
                { dc: 1, dr: 0, col: 3, row: 2, rot: 90 },
              ] as const
            ).map((b, i) => (
              <button
                key={i}
                onClick={() => step(b.dc, b.dr)}
                style={{
                  gridColumn: b.col,
                  gridRow: b.row,
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.16)',
                  background: 'rgba(20,20,23,0.85)',
                  color: '#fefefe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: `rotate(${b.rot}deg)` }}
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            ))}
        </div>
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
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: mobile ? '88px 24px 64px' : '96px 40px 90px' }}>
            <button
              onClick={closeGame}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 28,
                padding: '10px 18px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fafafa',
                fontFamily: KEYCAP_FONT,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to the game space
            </button>
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
                  fontFamily: KEYCAP_FONT,
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
