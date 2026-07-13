import { designData, designParas } from '../data/content';
import { hexToRgba, shade, tint } from '../lib/colors';
import { useDragScroll } from '../lib/useDragScroll';
import CloseButton from './CloseButton';

interface DesignDetailProps {
  sel: number | null;
  anim: boolean;
  onClose: () => void;
}

/** Fullscreen detail view for a design/animation bento tile. */
export default function DesignDetail({ sel, anim, onClose }: DesignDetailProps) {
  const dragScroll = useDragScroll();
  const dd = designData[sel ?? 0] ?? designData[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 460,
        background: '#0a0a0b',
        opacity: sel !== null ? 1 : 0,
        pointerEvents: sel !== null ? 'auto' : 'none',
        transition: 'opacity .4s ease',
      }}
    >
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} />
      <div
        ref={dragScroll}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          transform: anim ? 'scale(1)' : 'scale(0.94)',
          opacity: anim ? 1 : 0,
          transition: 'transform .5s cubic-bezier(.34,1.2,.64,1), opacity .4s ease',
        }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 40px 90px' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '21 / 9',
              borderRadius: 24,
              overflow: 'hidden',
              background: `linear-gradient(150deg, ${tint(dd.c, 0.1)}, ${shade(dd.c, 0.34)})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 50px 100px -40px ' + hexToRgba(dd.c, 0.6),
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 13,
                letterSpacing: '0.24em',
                color: 'rgba(255,255,255,0.62)',
                background: 'rgba(0,0,0,0.22)',
                padding: '7px 14px',
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
              marginTop: 30,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <span style={{ color: tint(dd.c, 0.22) }}>{dd.cat}</span>
            <span>&middot;</span>
            <span>{dd.meta}</span>
          </div>
          <h2
            style={{
              marginTop: 16,
              fontSize: 'clamp(30px,3.4vw,46px)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#fefefe',
              maxWidth: 760,
              textWrap: 'pretty',
            }}
          >
            {dd.title}
          </h2>
          <div style={{ marginTop: 24, maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {designParas.map((p, i) => (
              <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
                {p}
              </p>
            ))}
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginTop: 42 }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  aspectRatio: '4 / 3',
                  borderRadius: 16,
                  border: '1px dashed rgba(255,255,255,0.16)',
                  background: `linear-gradient(150deg, ${hexToRgba(dd.c, 0.1)}, rgba(255,255,255,0.02))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  color: 'rgba(255,255,255,0.32)',
                }}
              >
                [ SHOT {n} ]
              </div>
            ))}
          </div>
        </div>
      </div>
      {sel !== null ? <CloseButton onClick={onClose} zIndex={470} /> : null}
    </div>
  );
}
