import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Lenis smooth scroll ──────────────────────────────────
let lenis: Lenis | null = null;

declare global {
  interface Window { lenisVelocity?: number; }
}

function initLenis() {
  if (lenis) return lenis;

  lenis = new Lenis({
    lerp: 0.05,
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time: number) {
    if (lenis) lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Keep ScrollTrigger in sync with Lenis
  lenis.on("scroll", (e: any) => {
    ScrollTrigger.update();
    // Expose velocity for StarField directly to avoid CustomEvent GC spam
    window.lenisVelocity = e.velocity;
  });

  return lenis;
}

// ── Global defaults ──────────────────────────────────────
gsap.config({ force3D: true, nullTargetWarn: false });
gsap.defaults({
  ease: "power3.out",
  duration: 0.6,
});

export { gsap, ScrollTrigger, useGSAP, initLenis, lenis };
export type { Lenis };
