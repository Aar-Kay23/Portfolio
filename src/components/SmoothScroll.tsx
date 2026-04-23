import { useEffect } from "react";

/**
 * Lightweight Lenis-style smooth scroll using rAF + lerp on window.scrollY.
 * No external dep. Disabled on touch / reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let active = false;

    const onWheel = (e: WheelEvent) => {
      // Let modifier-key gestures (zoom, horizontal) pass through
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.max(0, Math.min(max, target + e.deltaY * 1.0));
      if (!active) {
        active = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.4) {
        current = target;
        active = false;
        window.scrollTo(0, current);
        return;
      }
      window.scrollTo(0, current);
      raf = requestAnimationFrame(tick);
    };

    // Sync on direct scroll (anchor jumps, keyboard, scrollbar drag)
    const onScroll = () => {
      if (!active) {
        target = window.scrollY;
        current = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
