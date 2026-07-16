import { useEffect, useRef, useState } from 'react';
import logo from '../assets/syah-logo-white.svg';
import { useViewport } from '../lib/useViewport';

const TABS = ['Home', 'About', 'Article', 'Collab'];
const MUTED = 'rgba(255,255,255,0.72)';

interface HeaderProps {
  active: number;
  onSelect: (tab: number) => void;
  onOpenSocial: () => void;
}

export default function Header({ active, onSelect, onOpenSocial }: HeaderProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ left: 4, width: 72 });
  const [menuOpen, setMenuOpen] = useState(false);
  const mobile = useViewport() === 'mobile';

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
  }, [active, mobile]);

  useEffect(() => {
    if (!mobile) setMenuOpen(false);
  }, [mobile]);

  if (mobile) {
    return (
      <>
        <header
          style={{
            flexShrink: 0,
            position: 'relative',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 26px',
            width: '100%',
          }}
        >
          <img src={logo} alt="Zahin Ukasyah" style={{ height: 24, width: 'auto', display: 'block' }} />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              position: 'relative',
              width: 42,
              height: 42,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: menuOpen ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
              cursor: 'pointer',
              transition: 'background .25s ease',
            }}
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: 12,
                  right: 12,
                  top: '50%',
                  height: 2,
                  borderRadius: 2,
                  background: '#fefefe',
                  transform: menuOpen
                    ? `translateY(-50%) rotate(${i === 0 ? 45 : -45}deg)`
                    : `translateY(${i === 0 ? -4.5 : 3.5}px)`,
                  transition: 'transform .32s cubic-bezier(.34,1.3,.64,1)',
                }}
              />
            ))}
          </button>
        </header>

        {/* full-screen menu */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 35,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'rgba(9,9,11,0.94)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'auto' : 'none',
            transition: 'opacity .35s ease',
          }}
        >
          {TABS.map((label, i) => (
            <a
              key={label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelect(i);
                setMenuOpen(false);
              }}
              style={{
                padding: '12px 26px',
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: active === i ? '#fefefe' : 'rgba(255,255,255,0.5)',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(14px)',
                transition: `opacity .4s ease ${0.05 + i * 0.05}s, transform .45s cubic-bezier(.34,1.2,.64,1) ${0.05 + i * 0.05}s, color .3s ease`,
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              onOpenSocial();
            }}
            style={{
              marginTop: 22,
              padding: '12px 30px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              color: '#0a0a0b',
              background: '#ffffff',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity .4s ease .28s, transform .45s cubic-bezier(.34,1.2,.64,1) .28s',
            }}
          >
            Social
          </a>
        </div>
      </>
    );
  }

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
        <img src={logo} alt="Zahin Ukasyah" style={{ height: 30, width: 'auto', display: 'block' }} />
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
          className="pop hover-shadow"
          style={{
            padding: '10px 22px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            color: '#0a0a0b',
            background: '#ffffff',
            border: '1px solid #fff',
            display: 'inline-block',
            transition: 'transform .25s cubic-bezier(.34,1.56,.64,1), background .25s',
            ['--hover-shadow' as string]: '0 12px 26px -8px rgba(255,255,255,0.3)',
          }}
        >
          Social
        </a>
      </div>
    </header>
  );
}
