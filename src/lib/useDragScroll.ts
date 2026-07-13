import { useCallback, useRef } from 'react';

/**
 * Shared "a drag just happened" flag so click handlers on cards inside a
 * drag-scrolled container can ignore the click that ends a drag.
 */
export const dragState = { dragged: false };

/**
 * Universal drag-to-scroll. Returns a callback ref — attach it to any
 * scrollable container to let users grab-and-drag it on both axes.
 */
export function useDragScroll() {
  const bound = useRef<WeakSet<HTMLElement>>(new WeakSet());

  return useCallback((el: HTMLElement | null) => {
    if (!el || bound.current.has(el)) return;
    bound.current.add(el);

    el.addEventListener('pointerdown', (e: PointerEvent) => {
      if (e.button !== 0) return;
      // mouse users scroll with the wheel; dragging is touch-only
      if (e.pointerType === 'mouse') return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('a,button,input,textarea,select,[role="button"]')) return;
      const canX = el.scrollWidth > el.clientWidth + 1;
      const canY = el.scrollHeight > el.clientHeight + 1;
      if (!canX && !canY) return;
      dragState.dragged = false;
      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = el.scrollLeft;
      const startTop = el.scrollTop;
      const prevCursor = el.style.cursor;
      let moved = false;
      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
          moved = true;
          dragState.dragged = true;
          el.style.cursor = 'grabbing';
        }
        if (canX) el.scrollLeft = startLeft - dx;
        if (canY) el.scrollTop = startTop - dy;
      };
      const up = () => {
        el.style.cursor = prevCursor;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        setTimeout(() => {
          dragState.dragged = false;
        }, 0);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
  }, []);
}
