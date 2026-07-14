import { useEffect, useRef, useState } from 'react';
import { collabData, collabEmail } from '../data/content';
import { useViewport } from '../lib/useViewport';
import { shade } from '../lib/colors';
import { ACCENT, accentGlow } from '../lib/theme';
import FlipCard from './FlipCard';
import { useCenterLift } from '../lib/useCenterLift';

const STAG = [0, 22, 8, 22, 0];

export default function CollabPage({ active }: { active: boolean }) {
  const [up, setUp] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const vp = useViewport();
  const mobile = vp === 'mobile';
  const timers = useRef<number[]>([]);
  const railRef = useRef<HTMLDivElement>(null);

  // mobile carousel starts centered on the middle card
  useEffect(() => {
    if (!mobile || !active) return;
    const rail = railRef.current;
    const el = rail?.children[Math.floor(collabData.length / 2)] as HTMLElement | undefined;
    if (rail && el) rail.scrollLeft = el.offsetLeft - (rail.clientWidth - el.clientWidth) / 2;
  }, [mobile, active]);

  // whichever card scrolls through the center of the rail rises
  useCenterLift(railRef, mobile);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    if (active) {
      setUp(false);
      timers.current.push(window.setTimeout(() => setUp(true), 60));
    } else {
      setUp(false);
      setEmailOpen(false);
    }
    return clearTimers;
  }, [active]);

  const copyEmail = () => {
    try {
      if (navigator.clipboard) void navigator.clipboard.writeText(collabEmail);
    } catch {
      // clipboard unavailable — the address is still visible to copy manually
    }
    setCopied(true);
    timers.current.push(window.setTimeout(() => setCopied(false), 1800));
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 12,
          display: 'flex',
          justifyContent: 'center',
          padding: mobile ? '64px 26px 24px' : vp === 'tablet' ? '92px 44px 30px' : '92px 100px 30px',
          opacity: active ? 1 : 0,
          pointerEvents: active ? 'auto' : 'none',
          transition: 'opacity .45s ease',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 1140,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: mobile ? 'center' : undefined,
          }}
        >
          {/* TOP: prompt + email */}
          <div
            style={{
              flexShrink: 0,
              textAlign: 'center',
              maxWidth: 840,
              margin: '0 auto',
              paddingTop: mobile ? 0 : 40,
              opacity: up ? 1 : 0,
              transform: up ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity .55s ease, transform .6s cubic-bezier(.34,1.15,.64,1)',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(30px,4vw,52px)',
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: '#fefefe',
                textWrap: 'pretty',
              }}
            >
              What great thing shall we{' '}
              <span style={{ fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>
                build together?
              </span>
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.52)',
                maxWidth: 540,
                margin: mobile ? '26px auto 0' : '18px auto 0',
              }}
            >
              Feel free reach out. I'm always up for an interesting idea!
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: mobile ? 34 : 26 }}>
              <button
                onClick={() => setEmailOpen(true)}
                className="pop-sm hover:shadow-[0_12px_26px_-8px_rgba(255,255,255,0.3)]"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '11px 24px',
                  borderRadius: 999,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#0a0a0b',
                  background: '#ffffff',
                  border: '1px solid #fff',
                  cursor: 'pointer',
                  transition: 'transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease',
                }}
              >
                Email me
              </button>
            </div>
          </div>

          {/* BOTTOM: carousel */}
          <div
            style={{
              flex: mobile ? '0 0 auto' : '1 1 auto',
              minHeight: 0,
              marginTop: mobile ? 26 : 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
            }}
          >
            <div
              ref={railRef}
              style={{
                display: 'flex',
                gap: mobile ? 14 : 22,
                alignItems: 'flex-start',
                justifyContent: mobile ? 'flex-start' : 'center',
                // mobile: bleed to the screen edge and pad back in to match the
                // home carousel's 26px gutters; top headroom keeps the lifted
                // card from clipping
                padding: mobile ? '22px 26px 16px' : '0 40px',
                ...(mobile ? { margin: '0 -26px', width: 'calc(100% + 52px)' } : { width: '100%' }),
                overflowX: mobile ? 'auto' : 'visible',
                ...(mobile ? { scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' } : {}),
              }}
            >
              {collabData.map((cc, idx) => {
                const delay = (0.12 + idx * 0.05).toFixed(2);
                return (
                  <FlipCard
                    key={idx}
                    className="lift-12"
                    duration={0.55}
                    wrapStyle={{
                      position: 'relative',
                      flex: mobile ? '0 0 200px' : '1 1 0',
                      minWidth: 0,
                      maxWidth: 236,
                      ...(mobile ? { scrollSnapAlign: 'center' } : {}),
                      height: 250,
                      perspective: 1000,
                      cursor: 'pointer',
                      marginTop: mobile ? 0 : STAG[idx % STAG.length],
                      opacity: up ? 1 : 0,
                      // no inline transform once risen — it would override the hover lift
                      ...(up ? {} : { transform: 'translateY(40px)' }),
                      transition: `opacity .5s ease ${delay}s, transform .6s cubic-bezier(.34,1.2,.64,1) ${delay}s`,
                    }}
                    frontStyle={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 20,
                      overflow: 'hidden',
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(180deg,#1c1c20,#131315)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 30px 60px -24px rgba(0,0,0,0.8)',
                    }}
                    backStyle={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 20,
                      overflow: 'hidden',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: shade(cc.c, 0.62),
                      color: '#f3f3f5',
                      padding: 22,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      boxShadow: '0 14px 30px -14px rgba(0,0,0,0.4)',
                    }}
                    front={
                      <>
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: `radial-gradient(120% 60% at 50% 0%, ${accentGlow}, transparent 60%)`,
                            pointerEvents: 'none',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: 14,
                            left: 14,
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '4px 11px',
                            borderRadius: 999,
                            color: '#f2f2f2',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.18)',
                          }}
                        >
                          {cc.cat}
                        </div>
                      </>
                    }
                    back={
                      <>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            opacity: 0.55,
                            marginBottom: 10,
                            color: '#f3f3f5',
                          }}
                        >
                          {cc.cat}
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.9)' }}>
                          {cc.desc}
                        </div>
                      </>
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* EMAIL POPUP */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          background: 'rgba(8,8,10,0.55)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          opacity: emailOpen ? 1 : 0,
          pointerEvents: emailOpen ? 'auto' : 'none',
          transition: 'opacity .4s ease, backdrop-filter .4s ease',
        }}
      >
        <div
          onClick={() => {
            setEmailOpen(false);
            setCopied(false);
          }}
          style={{ position: 'absolute', inset: 0 }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 480,
            width: '100%',
            background: 'linear-gradient(180deg,#1a1a1d,#121214)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 28,
            padding: 40,
            textAlign: 'center',
            boxShadow: '0 50px 100px -30px rgba(0,0,0,0.8)',
            transform: emailOpen ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            opacity: emailOpen ? 1 : 0,
            transition: 'transform .5s cubic-bezier(.34,1.2,.64,1) .04s, opacity .45s ease .04s',
          }}
        >
          <button
            onClick={() => {
              setEmailOpen(false);
              setCopied(false);
            }}
            className="scale-up hover:bg-white/[0.12]"
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              width: 38,
              height: 38,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: 15,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background .2s ease, transform .2s ease',
            }}
          >
            ✕
          </button>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.42)',
            }}
          >
            Say hello
          </div>
          <h2 style={{ marginTop: 12, fontSize: 30, fontWeight: 700, letterSpacing: '-0.025em', color: '#fefefe' }}>
            Let's build something
          </h2>
          <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)' }}>
            Tell me what you have in mind and I'll get back to you soon.
          </p>
          <div style={{ position: 'relative', marginTop: 26 }}>
            {/* the email itself is the copy button */}
            <button
              onClick={copyEmail}
              className="hover:bg-white/[0.08] hover:border-[rgba(255,255,255,0.2)]"
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: "'Poppins',sans-serif",
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: '0.01em',
                color: '#f2f2f2',
                cursor: 'pointer',
                transition: 'background .2s ease, border-color .2s ease',
              }}
            >
              {collabEmail}
            </button>
            {/* copied toast */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: -14,
                transform: `translate(-50%, ${copied ? '-100%' : 'calc(-100% + 6px)'})`,
                padding: '7px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: '#0a0a0b',
                background: ACCENT,
                boxShadow: '0 12px 26px -10px rgba(0,0,0,0.6)',
                opacity: copied ? 1 : 0,
                pointerEvents: 'none',
                transition: 'opacity .25s ease, transform .3s cubic-bezier(.34,1.4,.64,1)',
              }}
            >
              Copied!
            </div>
          </div>
          <a
            href={`mailto:${collabEmail}`}
            className="lift-2 hover:shadow-[0_12px_26px_-8px_rgba(255,255,255,0.3)]"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
              marginTop: 16,
              width: '100%',
              padding: '13px 22px',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 600,
              color: '#0a0a0b',
              background: '#ffffff',
              border: '1px solid #fff',
              textDecoration: 'none',
              transition: 'transform .25s cubic-bezier(.34,1.5,.64,1), box-shadow .25s ease',
            }}
          >
            Open in mail app
          </a>
        </div>
      </div>
    </>
  );
}
