import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { dragState } from '../lib/useDragScroll';

interface FlipCardProps {
  className?: string;
  wrapStyle?: CSSProperties;
  frontStyle: CSSProperties;
  backStyle: CSSProperties;
  front: ReactNode;
  back: ReactNode;
  /** Flip duration in seconds. */
  duration?: number;
}

/**
 * Click-to-flip card. The renderer can't cull backface-visibility reliably
 * everywhere, so the two faces swap opacity at the flip's edge-on (~90deg)
 * moment — invisible to the eye.
 */
export default function FlipCard({
  className,
  wrapStyle,
  frontStyle,
  backStyle,
  front,
  back,
  duration = 0.5,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const swap = useRef<number | undefined>(undefined);

  useEffect(() => () => clearTimeout(swap.current), []);

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragState.dragged) {
      dragState.dragged = false;
      return;
    }
    const next = !flipped;
    setFlipped(next);
    clearTimeout(swap.current);
    swap.current = window.setTimeout(() => setShowBack(next), 240);
  };

  return (
    <div onClick={onClick} className={className} style={wrapStyle}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transition: `transform ${duration}s cubic-bezier(.4,.1,.2,1)`,
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div style={{ ...frontStyle, opacity: showBack ? 0 : 1 }}>{front}</div>
        <div style={{ ...backStyle, opacity: showBack ? 1 : 0 }}>{back}</div>
      </div>
    </div>
  );
}
