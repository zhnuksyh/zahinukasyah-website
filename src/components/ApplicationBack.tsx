import { projData } from '../data/content';
import { shade } from '../lib/colors';
import { useDragScroll } from '../lib/useDragScroll';
import FlipCard from './FlipCard';

const TXT_DARK = '#17171c';
const TXT_LIGHT = '#f4f4f6';

/** Back face for the Application card: a drag-scrolled grid of flip cards. */
export default function ApplicationBack() {
  const dragScroll = useDragScroll();

  return (
    <>
      <div style={{ flex: '0 0 auto', padding: '44px 52px 6px' }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.42)',
          }}
        >
          Selected work
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#f4f4f6',
            marginTop: 6,
          }}
        >
          Application
        </div>
      </div>
      <div
        ref={dragScroll}
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '22px 54px 54px',
          cursor: 'grab',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column dense',
            gridTemplateRows: 'repeat(3, 148px)',
            gridAutoColumns: '186px',
            gap: 16,
            height: '100%',
            width: 'max-content',
          }}
        >
          {projData.map((pc, i) => {
            const t = pc.dark ? TXT_LIGHT : TXT_DARK;
            return (
              <FlipCard
                key={i}
                className="hover:-translate-y-2"
                wrapStyle={{
                  position: 'relative',
                  gridRow: 'span 1',
                  gridColumn: pc.wide ? 'span 2' : 'span 1',
                  perspective: 1000,
                  cursor: 'pointer',
                  transition: 'transform .3s cubic-bezier(.34,1.4,.64,1)',
                }}
                frontStyle={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 20,
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                  background: pc.c,
                  color: t,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 16px 34px -18px rgba(0,0,0,0.55)',
                }}
                backStyle={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 20,
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: shade(pc.c, 0.62),
                  color: '#f3f3f5',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 16px 34px -18px rgba(0,0,0,0.6)',
                }}
                front={
                  <>
                    <div
                      style={{
                        alignSelf: 'flex-start',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '5px 12px',
                        borderRadius: 999,
                        background: pc.dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)',
                        color: t,
                      }}
                    >
                      Category
                    </div>
                    <div style={{ flex: '1 1 auto' }} />
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        lineHeight: 1.28,
                        color: t,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Placeholder Title
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
                        marginBottom: 8,
                        color: '#f3f3f5',
                      }}
                    >
                      Description
                    </div>
                    <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>
                      Placeholder description — a short summary of what this project was about goes
                      here.
                    </div>
                  </>
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
