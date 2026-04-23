import { useEffect, useRef, useState } from "react";

/**
 * Apple-like dual-layer cursor:
 * - Inner dot (precise pointer)
 * - Outer ring with spring-lerp follow + magnetic scale on interactive elements
 * Falls back to native cursor on touch devices and when prefers-reduced-motion is set.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const state = useRef({
    x: 0,
    y: 0,
    rx: 0,
    ry: 0,
    hover: false,
    down: false,
  });

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      state.current.x = e.clientX;
      state.current.y = e.clientY;
      // Detect interactive target
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor='hover']"
      );
      state.current.hover = interactive;
    };
    const onDown = () => (state.current.down = true);
    const onUp = () => (state.current.down = false);
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    let raf = 0;
    const tick = () => {
      const s = state.current;
      // Spring-lerp the ring (slower) and snap the dot
      s.rx += (s.x - s.rx) * 0.18;
      s.ry += (s.y - s.ry) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) scale(${s.down ? 0.6 : 1})`;
      }
      if (ringRef.current) {
        const scale = s.hover ? 1.8 : s.down ? 0.85 : 1;
        ringRef.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.borderColor = s.hover
          ? "hsl(var(--primary) / 0.9)"
          : "hsl(var(--foreground) / 0.45)";
        ringRef.current.style.backgroundColor = s.hover
          ? "hsl(var(--primary) / 0.08)"
          : "transparent";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hide native cursor
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[100] w-9 h-9 rounded-full border backdrop-blur-[2px] mix-blend-difference"
        style={{
          transition:
            "transform 120ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms ease, border-color 200ms ease, opacity 200ms ease",
          willChange: "transform",
          opacity: 1,
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[101] w-1.5 h-1.5 rounded-full bg-primary"
        style={{
          boxShadow: "0 0 14px hsl(var(--primary) / 0.9), 0 0 36px hsl(var(--primary) / 0.5)",
          transition: "transform 60ms linear, opacity 200ms ease",
          willChange: "transform",
          opacity: 1,
        }}
      />
    </>
  );
}
