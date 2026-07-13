export default function Hero() {
  return (
    <section
      style={{
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '34px 24px 0',
        maxWidth: 900,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 9,
          fontSize: 15,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.62)',
        }}
      >
        Zahin Ukasyah here! Glad you made it in time
      </div>
      <h1
        style={{
          marginTop: 16,
          fontSize: 'clamp(34px,4.9vw,58px)',
          fontWeight: 700,
          lineHeight: 1.06,
          letterSpacing: '-0.03em',
          color: '#fefefe',
        }}
      >
        Consistency beats intensity,
        <br />
        <span style={{ fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>
          every single time.
        </span>
      </h1>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.65,
          color: 'rgba(255,255,255,0.52)',
          maxWidth: 600,
          margin: '22px auto 0',
        }}
      >
        This digital space is a documentation for everything I had done, and I hoped that it would
        be useful to someone out there.
      </p>
    </section>
  );
}
