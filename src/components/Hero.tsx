import { useEffect, useRef, useState } from 'react';
import { useViewport } from '../lib/useViewport';

// Two-line quotes: first line renders bold, second line italic and lighter.
const QUOTES = [
  { a: 'Consistency beats intensity,', b: 'every single time.' },
  { a: 'Done is better', b: 'than perfect.' },
  { a: 'Slow is smooth,', b: 'and smooth is fast.' },
  { a: 'Stay curious first,', b: 'mastery will follow.' },
  { a: 'Great things take time,', b: 'so start today.' },
];

const TYPE_MS = 45;
const DELETE_MS = 22;
const HOLD_MS = 10000;
const GAP_MS = 400;

export default function Hero() {
  const mobile = useViewport() === 'mobile';
  const [quote, setQuote] = useState(0);
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'deleting'>('typing');
  const timer = useRef<number | undefined>(undefined);

  const q = QUOTES[quote];
  const total = q.a.length + q.b.length;

  useEffect(() => {
    clearTimeout(timer.current);
    if (phase === 'typing') {
      if (chars < total) {
        timer.current = window.setTimeout(() => setChars((c) => c + 1), TYPE_MS);
      } else {
        timer.current = window.setTimeout(() => setPhase('deleting'), HOLD_MS);
      }
    } else if (phase === 'deleting') {
      if (chars > 0) {
        timer.current = window.setTimeout(() => setChars((c) => c - 1), DELETE_MS);
      } else {
        timer.current = window.setTimeout(() => {
          setQuote((i) => (i + 1) % QUOTES.length);
          setPhase('typing');
        }, GAP_MS);
      }
    }
    return () => clearTimeout(timer.current);
  }, [phase, chars, total]);

  const line1 = q.a.slice(0, Math.min(chars, q.a.length));
  const line2 = q.b.slice(0, Math.max(0, chars - q.a.length));
  const caretOnLine2 = chars > q.a.length;

  const caret = (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: '0.06em',
        height: '0.92em',
        marginLeft: '0.06em',
        verticalAlign: '-0.08em',
        background: 'rgba(255,255,255,0.75)',
        animation: 'caret-blink 1.1s step-end infinite',
      }}
    />
  );

  return (
    <section
      style={{
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: mobile ? '16px 26px 0' : '34px 24px 0',
        maxWidth: 900,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: mobile ? 'block' : 'inline-flex',
          alignItems: 'center',
          gap: 9,
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.62)',
        }}
      >
        {mobile ? (
          <>
            Zahin Ukasyah here!
            <br />
            Glad you made it in time
          </>
        ) : (
          'Zahin Ukasyah here! Glad you made it in time'
        )}
      </div>
      <h1
        style={{
          marginTop: mobile ? 38 : 26,
          fontSize: 'clamp(34px,4.9vw,58px)',
          fontWeight: 700,
          lineHeight: 1.06,
          letterSpacing: '-0.03em',
          color: '#fefefe',
          minHeight: '2.12em',
        }}
      >
        <span>
          {line1}
          {!caretOnLine2 ? caret : null}
        </span>
        <br />
        <span style={{ fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>
          {line2}
          {caretOnLine2 ? caret : null}
        </span>
      </h1>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.65,
          color: 'rgba(255,255,255,0.52)',
          maxWidth: 600,
          margin: mobile ? '42px auto 0' : '32px auto 0',
        }}
      >
        This digital space is a documentation for everything I had done, and I hoped that it would
        be useful to someone out there.
      </p>
    </section>
  );
}
