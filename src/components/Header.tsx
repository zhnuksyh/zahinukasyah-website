import { useEffect, useRef, useState } from 'react';
import { ACCENT } from '../lib/theme';

const TABS = ['Home', 'About', 'Journal', 'Collab'];
const MUTED = 'rgba(255,255,255,0.72)';

interface HeaderProps {
  active: number;
  onSelect: (tab: number) => void;
  onOpenSocial: () => void;
}

export default function Header({ active, onSelect, onOpenSocial }: HeaderProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ left: 4, width: 72 });

  useEffect(() => {
    const measure = () => {
      const el = navRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
      if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    // re-measure once webfonts have settled
    const t = window.setTimeout(measure, 360);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [active]);

  return (
    <header
      style={{
        flexShrink: 0,
        position: 'relative',
        zIndex: 20,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '24px 40px',
        maxWidth: 1320,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifySelf: 'start' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            whiteSpace: 'nowrap',
            fontSize: 26,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: ACCENT,
            fontWeight: 700,
          }}
        >
          ZU
        </div>
      </div>

      <nav
        style={{
          justifySelf: 'center',
          padding: 6,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div ref={navRef} style={{ position: 'relative', display: 'flex', alignItems: 'stretch', gap: 4 }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: ind.left,
              width: ind.width,
              background: '#ffffff',
              borderRadius: 999,
              zIndex: 0,
              pointerEvents: 'none',
              transition:
                'left .42s cubic-bezier(.6,.05,.12,1), width .42s cubic-bezier(.6,.05,.12,1)',
            }}
          />
          {TABS.map((label, i) => (
            <a
              key={label}
              href="#"
              data-tab={i}
              onClick={(e) => {
                e.preventDefault();
                onSelect(i);
              }}
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '9px 18px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                color: active === i ? '#0a0a0b' : MUTED,
                transition: 'color .3s',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifySelf: 'end' }}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onOpenSocial();
          }}
          className="hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-[0_12px_26px_-8px_rgba(255,255,255,0.3)]"
          style={{
            padding: '10px 22px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            color: '#0a0a0b',
            background: '#ffffff',
            border: '1px solid #fff',
            display: 'inline-block',
            transition:
              'transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease, background .25s',
          }}
        >
          Social
        </a>
      </div>
    </header>
  );
}
