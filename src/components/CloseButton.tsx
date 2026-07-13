interface CloseButtonProps {
  onClick: () => void;
  zIndex: number;
  /** Pop-in entrance animation (used by the card fan's fullscreen state). */
  animateIn?: boolean;
}

export default function CloseButton({ onClick, zIndex, animateIn }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      className="bg-[rgba(20,20,22,0.72)] border border-[rgba(255,255,255,0.22)] hover:bg-[rgba(40,40,44,0.92)] hover:border-[rgba(255,255,255,0.4)] hover:scale-[1.08]"
      style={{
        position: 'fixed',
        top: 28,
        right: 32,
        zIndex,
        width: 52,
        height: 52,
        borderRadius: 999,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: '#f4f4f6',
        fontSize: 20,
        lineHeight: 1,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px -8px rgba(0,0,0,0.6)',
        transition: 'background .2s ease, transform .2s ease, border-color .2s ease',
        ...(animateIn
          ? {
              animation: 'close-btn-in .38s cubic-bezier(.34,1.5,.64,1) both',
              transformOrigin: 'center',
            }
          : {}),
      }}
    >
      ✕
    </button>
  );
}
