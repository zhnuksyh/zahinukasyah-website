import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CardFan from './components/CardFan';
import AboutPage from './components/AboutPage';
import JournalPage from './components/JournalPage';
import CollabPage from './components/CollabPage';
import SocialOverlay from './components/SocialOverlay';
import DesignDetail from './components/DesignDetail';
import { useViewport } from './lib/useViewport';

export default function App() {
  const [active, setActive] = useState(0);
  const [socialOpen, setSocialOpen] = useState(false);
  const [designSel, setDesignSel] = useState<number | null>(null);
  const [designAnim, setDesignAnim] = useState(false);
  const designTimers = useRef<number[]>([]);
  const mobile = useViewport() === 'mobile';

  const clearDesignTimers = () => {
    designTimers.current.forEach(clearTimeout);
    designTimers.current = [];
  };

  useEffect(() => () => clearDesignTimers(), []);

  const openDesign = (i: number) => {
    clearDesignTimers();
    setDesignSel(i);
    setDesignAnim(false);
    designTimers.current.push(window.setTimeout(() => setDesignAnim(true), 30));
  };

  const closeDesign = () => {
    clearDesignTimers();
    setDesignAnim(false);
    designTimers.current.push(window.setTimeout(() => setDesignSel(null), 420));
  };

  const homeHidden = active !== 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0a0a0b',
        overflow: 'hidden',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* grid outline background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.8,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 42%, #000 55%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 42%, #000 55%, transparent 100%)',
        }}
      />

      {/* ambient starfield */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.5,
          backgroundImage:
            'radial-gradient(1.4px 1.4px at 12% 22%, rgba(255,255,255,.7), transparent),' +
            'radial-gradient(1.2px 1.2px at 82% 16%, rgba(255,255,255,.5), transparent),' +
            'radial-gradient(1.6px 1.6px at 68% 30%, rgba(255,255,255,.55), transparent),' +
            'radial-gradient(1.2px 1.2px at 24% 40%, rgba(255,255,255,.4), transparent),' +
            'radial-gradient(1.4px 1.4px at 91% 44%, rgba(255,255,255,.5), transparent),' +
            'radial-gradient(1.2px 1.2px at 8% 54%, rgba(255,255,255,.45), transparent),' +
            'radial-gradient(1.5px 1.5px at 46% 10%, rgba(255,255,255,.5), transparent),' +
            'radial-gradient(1.2px 1.2px at 58% 50%, rgba(255,255,255,.4), transparent)',
        }}
      />

      <Header active={active} onSelect={setActive} onOpenSocial={() => setSocialOpen(true)} />

      {/* HOME (cross-fades out when another page is active) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          minHeight: 0,
          position: 'relative',
          justifyContent: mobile ? 'center' : undefined,
          opacity: homeHidden ? 0 : 1,
          transition: 'opacity .45s ease',
          pointerEvents: homeHidden ? 'none' : 'auto',
        }}
      >
        <Hero />
        <div style={mobile ? { flex: '0 0 44px' } : { flex: '1 1 auto', minHeight: 16 }} />
        <CardFan onOpenDesign={openDesign} />
      </div>

      <AboutPage active={active === 1} />
      <JournalPage active={active === 2} />
      <CollabPage active={active === 3} />

      <SocialOverlay open={socialOpen} onClose={() => setSocialOpen(false)} />
      <DesignDetail sel={designSel} anim={designAnim} onClose={closeDesign} />
    </div>
  );
}
