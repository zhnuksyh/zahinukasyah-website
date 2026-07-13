import { useEffect, useRef, useState } from 'react';
import { collabData, collabEmail } from '../data/content';
import { useViewport } from '../lib/useViewport';
import { shade } from '../lib/colors';
import { ACCENT } from '../lib/theme';
import FlipCard from './FlipCard';

const TXT_DARK = '#17171c';
const STAG = [0, 22, 8, 22, 0];

export default function CollabPage({ active }: { active: boolean }) {
  const [up, setUp] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const mobile = useViewport() === 'mobile';
  const timers = useRef<number[]>([]);

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
          padding: mobile ? '80px 22px 24px' : '92px 40px 30px',
          opacity: active ? 1 : 0,
          pointerEvents: active ? 'auto' : 'none',
          transition: 'opacity .45s ease',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 1320,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* TOP: prompt + email */}
          <div
            style={{
              flexShrink: 0,
              textAlign: 'center',
              maxWidth: 840,
              margin: '0 auto',
              paddingTop: 40,
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
                margin: '18px auto 0',
              }}
            >
              Feel free reach out. I'm always up for an interesting idea!
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 26 }}>
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
              flex: '1 1 auto',
              minHeight: 0,
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: mobile ? 14 : 22,
                alignItems: 'flex-start',
                justifyContent: mobile ? 'flex-start' : 'center',
                padding: mobile ? '0 4px 16px' : '0 40px',
                width: '100%',
                overflowX: mobile ? 'auto' : 'visible',
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
                      height: 250,
                      perspective: 1000,
                      cursor: 'pointer',
                      marginTop: STAG[idx % STAG.length],
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
                      background: cc.c,
                      color: TXT_DARK,
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 14px 30px -14px rgba(0,0,0,0.35)',
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
                            alignSelf: 'flex-start',
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '4px 11px',
                            borderRadius: 999,
                            background: 'rgba(0,0,0,0.14)',
                            color: TXT_DARK,
                            marginBottom: 14,
                          }}
                        >
                          {cc.cat}
                        </div>
                        <div
                          style={{
                            fontSize: 17,
                            fontWeight: 600,
                            lineHeight: 1.32,
                            color: TXT_DARK,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {cc.title}
                        </div>
                        <div style={{ flex: '1 1 auto' }} />
                        <div
                          style={{
                            marginTop: 14,
                            height: 92,
                            borderRadius: 13,
                            border: '1px dashed rgba(0,0,0,0.16)',
                            background: 'rgba(255,255,255,0.22)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'monospace',
                            fontSize: 10,
                            letterSpacing: '0.08em',
                            color: 'rgba(0,0,0,0.35)',
                          }}
                        >
                          visual
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
                          Description
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 26,
              padding: '14px 18px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span
              style={{
                flex: '1 1 auto',
                fontFamily: "'Poppins',sans-serif",
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: '0.01em',
                color: '#f2f2f2',
                textAlign: 'left',
              }}
            >
              {collabEmail}
            </span>
            <button
              onClick={copyEmail}
              className={copied ? undefined : 'bg-white/[0.08] hover:bg-white/[0.16]'}
              style={{
                flexShrink: 0,
                padding: '9px 16px',
                borderRadius: 10,
                fontFamily: "'Poppins', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                color: copied ? '#0a0a0b' : '#fefefe',
                ...(copied ? { background: ACCENT } : {}),
                border: '1px solid ' + (copied ? ACCENT : 'rgba(255,255,255,0.14)'),
                transition: 'background .2s ease, color .2s ease, border-color .2s ease',
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
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
