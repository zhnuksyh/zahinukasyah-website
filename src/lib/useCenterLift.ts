import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Scroll-driven lift for horizontal card rails: whichever card currently sits
 * nearest the rail's center rises, easing back down as it scrolls away.
 * Uses the standalone `translate` property so it never fights the cards'
 * inline `transform` animations.
 */
export function useCenterLift(rail: RefObject<HTMLElement | null>, enabled: boolean, max = 16) {
  useEffect(() => {
    const el = rail.current;
    if (!enabled || !el) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      // read every rect before the first style write so no write can force a
      // synchronous re-layout mid-loop
      const rect = el.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;
      const children = Array.from(el.children) as HTMLElement[];
      const lifts = children.map((child) => {
        const r = child.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        return Math.max(0, 1 - d / Math.max(1, r.width));
      });
      children.forEach((child, i) => {
        child.style.translate = `0 ${(-max * lifts[i]).toFixed(1)}px`;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    el.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      for (const child of Array.from(el.children) as HTMLElement[]) child.style.translate = '';
    };
  }, [rail, enabled, max]);
}
