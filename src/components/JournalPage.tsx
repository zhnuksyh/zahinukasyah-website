import { useEffect, useRef, useState } from 'react';
import { newsData, newsParas, newsYear } from '../data/content';
import { hexToRgba, shade, tint } from '../lib/colors';
import { ACCENT } from '../lib/theme';
import { useDragScroll } from '../lib/useDragScroll';
import { useViewport } from '../lib/useViewport';

export default function JournalPage({ active }: { active: boolean }) {
  const [up, setUp] = useState(false);
  const [detailOn, setDetailOn] = useState(false);
  const [sel, setSel] = useState(0);
  const [filter, setFilter] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [shareLabel, setShareLabel] = useState<'Share' | 'Copied!'>('Share');
  const [mobileOpen, setMobileOpen] = useState(false);
  const shareTimer = useRef<number | undefined>(undefined);
  const timers = useRef<number[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const dragScroll = useDragScroll();
  const vp = useViewport();
  const mobile = vp === 'mobile';

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    if (active) {
      setUp(false);
      setDetailOn(false);
      timers.current.push(window.setTimeout(() => setUp(true), 60));
      timers.current.push(window.setTimeout(() => setDetailOn(true), 300));
    } else {
      setUp(false);
      setDetailOn(false);
      setMobileOpen(false);
    }
    return clearTimers;
  }, [active]);

  const select = (i: number) => {
    if (i === sel) return;
    clearTimers();
    setDetailOn(false);
    timers.current.push(
      window.setTimeout(() => {
        setSel(i);
        timers.current.push(window.setTimeout(() => setDetailOn(true), 30));
      }, 220),
    );
  };

  const toggleSearch = () => {
    const open = !searchOpen;
    setSearchOpen(open);
    if (open) {
      window.setTimeout(() => searchRef.current?.focus(), 90);
    } else {
      setSearchText('');
    }
  };

  const nd = newsData[sel] ?? newsData[0];

  const share = () => {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      void navigator.share({ title: document.title, url }).catch(() => {});
    } else if (navigator.clipboard) {
      void navigator.clipboard.writeText(url);
      setShareLabel('Copied!');
      clearTimeout(shareTimer.current);
      shareTimer.current = window.setTimeout(() => setShareLabel('Share'), 1600);
    }
  };

  const filterTabStyle = (f: number) => ({
    position: 'relative' as const,
    fontSize: 17,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: filter === f ? '#fefefe' : 'rgba(255,255,255,0.4)',
    paddingBottom: 8,
    cursor: 'pointer',
    textDecoration: 'none',
    borderBottom: '2px solid ' + (filter === f ? ACCENT : 'transparent'),
    transition: 'color .25s ease, border-color .25s ease',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 12,
        display: 'flex',
        justifyContent: 'center',
        padding: mobile ? '80px 22px 24px' : vp === 'tablet' ? '92px 44px 34px' : '92px 100px 34px',
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
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : vp === 'tablet' ? '330px 1fr' : '404px 1fr',
          gap: mobile ? 0 : 44,
        }}
      >
        {/* LEFT: feed list */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            opacity: up ? 1 : 0,
            transform: up ? 'translateX(0)' : 'translateX(-22px)',
            transition: 'opacity .5s ease, transform .6s cubic-bezier(.34,1.15,.64,1)',
          }}
        >
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 4px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setFilter(0);
                }}
                style={filterTabStyle(0)}
              >
                Latest
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setFilter(1);
                }}
                style={filterTabStyle(1)}
              >
                Popular
              </a>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: mobile ? 42 : 34,
                borderRadius: mobile ? 12 : 10,
                background: searchOpen ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
                border: `1px solid rgba(255,255,255,${searchOpen ? '0.16' : '0.09'})`,
                overflow: 'hidden',
                width: searchOpen ? 210 : mobile ? 42 : 34,
                transition: 'width .4s cubic-bezier(.4,0,.2,1), background .25s ease, border-color .25s ease',
              }}
            >
              <button
                onClick={toggleSearch}
                style={{
                  width: mobile ? 40 : 32,
                  height: mobile ? 40 : 32,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  color: searchOpen ? '#fff' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  transition: 'color .25s ease',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="7" cy="7" r="5" />
                  <line x1="10.6" y1="10.6" x2="15" y2="15" strokeLinecap="round" />
                </svg>
              </button>
              <input
                ref={searchRef}
                value={searchText}
                onInput={(e) => setSearchText((e.target as HTMLInputElement).value)}
                placeholder="Search entries"
                style={{
                  flex: '1 1 auto',
                  minWidth: 0,
                  height: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: 13,
                  paddingRight: 12,
                  fontFamily: 'inherit',
                  opacity: searchOpen ? 1 : 0,
                  transition: 'opacity .28s ease',
                  pointerEvents: searchOpen ? 'auto' : 'none',
                }}
              />
            </div>
          </div>

          <div
            ref={dragScroll}
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '0 28px 14px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                padding: '14px 2px 10px',
                background: 'linear-gradient(180deg,#0a0a0b 72%,rgba(10,10,11,0))',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.36)',
              }}
            >
              {newsYear}
            </div>
            {newsData.map((it, idx) => {
              const selected = idx === sel;
              return (
                <a
                  key={idx}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    select(idx);
                    if (mobile) setMobileOpen(true);
                  }}
                  className={selected ? undefined : 'hover:bg-white/5'}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '12px 14px',
                    borderRadius: 18,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    border: '1px solid ' + (selected ? 'rgba(255,255,255,0.16)' : 'transparent'),
                    ...(selected ? { background: 'rgba(255,255,255,0.06)' } : {}),
                    boxShadow: selected ? '0 18px 40px -24px rgba(0,0,0,0.7)' : 'none',
                    opacity: up ? 1 : 0,
                    transform: up ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity .5s ease ${0.12 + idx * 0.05}s, transform .55s cubic-bezier(.34,1.2,.64,1) ${0.12 + idx * 0.05}s, background .25s ease, border-color .25s ease`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3,
                      width: 34,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        color: selected ? ACCENT : 'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {it.mon}
                    </div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 700,
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        color: selected ? '#fefefe' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {it.date}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 13,
                      flexShrink: 0,
                      background: `linear-gradient(150deg, ${tint(it.c, 0.1)}, ${shade(it.c, 0.28)})`,
                      boxShadow: '0 8px 18px -10px ' + hexToRgba(it.c, 0.7),
                    }}
                  />
                  <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.34)',
                      }}
                    >
                      {it.ago}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: 1.35,
                        color: selected ? '#fefefe' : 'rgba(255,255,255,0.82)',
                        marginTop: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      Placeholder headline that runs onto a second line
                    </div>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      right: -23,
                      top: '50%',
                      width: 12,
                      height: 12,
                      transform: `translateY(-50%) rotate(45deg) scale(${selected ? 1 : 0})`,
                      background: 'rgba(255,255,255,0.06)',
                      borderRight: '1px solid rgba(255,255,255,0.16)',
                      borderTop: '1px solid rgba(255,255,255,0.16)',
                      borderRadius: 2,
                      transition: 'transform .3s cubic-bezier(.34,1.4,.64,1)',
                      pointerEvents: 'none',
                    }}
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* RIGHT: detail — on mobile it becomes a fullscreen page opened from the list */}
        <div
          ref={dragScroll}
          style={
            mobile
              ? {
                  position: 'fixed',
                  inset: 0,
                  zIndex: 460,
                  background: '#0a0a0b',
                  overflowY: 'auto',
                  padding: '84px 24px 48px',
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(26px)',
                  pointerEvents: mobileOpen ? 'auto' : 'none',
                  transition: 'opacity .35s ease, transform .4s cubic-bezier(.34,1.15,.64,1)',
                }
              : {
                  height: '100%',
                  minHeight: 0,
                  overflowY: 'auto',
                  paddingRight: 4,
                  paddingTop: 4,
                  opacity: up ? 1 : 0,
                  transform: up ? 'translateY(0)' : 'translateY(18px)',
                  transition: 'opacity .55s ease .08s, transform .6s cubic-bezier(.34,1.15,.64,1) .08s',
                }
          }
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: mobile ? 'space-between' : 'flex-end',
              marginBottom: 26,
            }}
          >
            {mobile ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fefefe',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </a>
            ) : null}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                share();
              }}
              className="lift-2 hover:bg-white/10"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                padding: '10px 20px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                color: '#fefefe',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                transition: 'transform .25s cubic-bezier(.34,1.5,.64,1), background .25s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="3.5" r="2" />
                <circle cx="4" cy="8" r="2" />
                <circle cx="12" cy="12.5" r="2" />
                <line x1="5.7" y1="7" x2="10.3" y2="4.5" />
                <line x1="5.7" y1="9" x2="10.3" y2="11.5" />
              </svg>
              {shareLabel}
            </a>
          </div>

          <div
            style={{
              opacity: detailOn ? 1 : 0,
              transform: detailOn ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity .34s ease, transform .38s cubic-bezier(.34,1.15,.64,1)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: 22,
                overflow: 'hidden',
                background: `linear-gradient(150deg, ${tint(nd.c, 0.12)}, ${shade(nd.c, 0.28)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 40px 80px -30px ' + hexToRgba(nd.c, 0.6),
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  color: 'rgba(255,255,255,0.55)',
                  background: 'rgba(0,0,0,0.18)',
                  padding: '6px 12px',
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
                marginTop: 26,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{nd.cat}</span>
              <span>·</span>
              <span>
                {nd.mon} {nd.date}, {newsYear}
              </span>
              <span>·</span>
              <span>{nd.ago}</span>
            </div>

            <h2
              style={{
                marginTop: 14,
                fontSize: 'clamp(28px,3vw,40px)',
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
                color: '#fefefe',
                maxWidth: 640,
                textWrap: 'pretty',
              }}
            >
              Placeholder headline for the most recent thing I worked on
            </h2>

            <div style={{ marginTop: 22, maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {newsParas.map((p, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
