import { useEffect, useRef, useState } from 'react';

// Chunky rounded arrow: a sharp polygon fattened by round-join strokes.
// The fat black pass underneath and the thinner white pass on top yield a
// white cursor with a rounded black outline.
const ARROW_PATH = 'M 28 18 L 86 62 Q 56 64 48 76 L 36 94 Z';

// visual tip of the arrow inside the 110x120 viewBox (stroke included)
const HOTSPOT: [number, number] = [19, 9];

const CURSOR_H = 30;
const SCALE = CURSOR_H / 120;

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const posRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('custom-cursor');

    const move = (e: MouseEvent) => {
      const el = posRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      el.style.opacity = '1';
    };
    const down = (e: MouseEvent) => {
      setPressed(true);
      const id = ++rippleId.current;
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
    };
    const up = () => setPressed(false);
    const leave = () => {
      if (posRef.current) posRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      document.documentElement.classList.remove('custom-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="cursor-ripple"
          style={{ left: r.x, top: r.y }}
          onAnimationEnd={() => setRipples((list) => list.filter((it) => it.id !== r.id))}
        />
      ))}
      <div
        ref={posRef}
        aria-hidden
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0,
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 110 120"
          style={{
            width: 110 * SCALE,
            height: CURSOR_H,
            marginLeft: -HOTSPOT[0] * SCALE,
            marginTop: -HOTSPOT[1] * SCALE,
            transform: pressed ? 'scale(0.88)' : 'scale(1)',
            transformOrigin: `${HOTSPOT[0] * SCALE}px ${HOTSPOT[1] * SCALE}px`,
            transition: 'transform .12s ease',
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.45))',
          }}
        >
          <path
            d={ARROW_PATH}
            fill="#000"
            stroke="#000"
            strokeWidth="24"
            strokeLinejoin="round"
          />
          <path
            d={ARROW_PATH}
            fill="#fff"
            stroke="#fff"
            strokeWidth="13"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
