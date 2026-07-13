import { socials } from '../data/content';
import { hexToRgba } from '../lib/colors';
import { useViewport } from '../lib/useViewport';
import CloseButton from './CloseButton';
import { SocialIcon } from './icons/SocialIcons';

export default function SocialOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const mobile = useViewport() === 'mobile';
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        display: 'flex',
        padding: mobile ? '72px 18px 32px' : 40,
        overflowY: 'auto',
        background: 'rgba(8,8,10,0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity .4s ease, backdrop-filter .4s ease',
      }}
    >
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} />

      {open ? <CloseButton onClick={onClose} zIndex={470} /> : null}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 860,
          width: '100%',
          margin: 'auto',
          transform: open ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          opacity: open ? 1 : 0,
          transition: 'transform .5s cubic-bezier(.34,1.2,.64,1) .04s, opacity .45s ease .04s',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.42)',
            }}
          >
            Elsewhere
          </div>
          <h2
            style={{
              marginTop: 12,
              fontSize: 'clamp(28px,3.4vw,40px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#fefefe',
            }}
          >
            Find me around the web
          </h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href ?? '#'}
              target={s.href ? '_blank' : undefined}
              rel={s.href ? 'noopener noreferrer' : undefined}
              onClick={s.href ? undefined : (e) => e.preventDefault()}
              className="lift-8 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-[rgba(255,255,255,0.22)]"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                width: mobile ? 150 : 188,
                padding: mobile ? '22px 14px' : '28px 20px',
                borderRadius: 22,
                textDecoration: 'none',
                transition:
                  'transform .28s cubic-bezier(.34,1.4,.64,1), background .28s ease, border-color .28s ease',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: s.c,
                  color: s.txt,
                  boxShadow: '0 12px 28px -10px ' + hexToRgba(s.c, 0.7),
                }}
              >
                <SocialIcon name={s.name} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#f2f2f2' }}>{s.name}</div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "'Poppins',sans-serif",
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.42)',
                }}
              >
                {s.handle}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
