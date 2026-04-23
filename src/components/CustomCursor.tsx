import { useEffect, useRef, useState } from "react";

/**
 * Dual-layer cursor that stays visible over dark backgrounds AND the WebGL canvas.
 * - Inner glowing dot (precise pointer)
 * - Outer ring with spring-lerp follow + magnetic scale on interactive elements
 * Uses solid colors (no mix-blend-difference) so it remains visible over the 3D scene.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const state = useRef({
    x: -100,
    y: -100,
    rx: -100,
    ry: -100,
    hover: false,
    down: false,
    visible: false,
  });

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      state.current.x = e.clientX;
      state.current.y = e.clientY;
      if (!state.current.visible) {
        state.current.rx = e.clientX;
        state.current.ry = e.clientY;
        state.current.visible = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
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
      state.current.visible = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      const s = state.current;
      s.rx += (s.x - s.rx) * 0.2;
      s.ry += (s.y - s.ry) * 0.2;

      if (dotRef.current) {
        const dScale = s.down ? 0.6 : s.hover ? 0 : 1;
        dotRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) scale(${dScale})`;
      }
      if (ringRef.current) {
        const scale = s.hover ? 1.9 : s.down ? 0.85 : 1;
        ringRef.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.borderColor = s.hover
          ? "hsl(var(--primary))"
          : "hsl(var(--foreground) / 0.55)";
        ringRef.current.style.backgroundColor = s.hover
          ? "hsl(var(--primary) / 0.12)"
          : "hsl(var(--foreground) / 0.04)";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-9 h-9 rounded-full border-[1.5px] backdrop-blur-[2px]"
        style={{
          transition:
            "transform 140ms cubic-bezier(0.16, 1, 0.3, 1), background-color 220ms ease, border-color 220ms ease, opacity 220ms ease",
          willChange: "transform",
          opacity: 0,
          boxShadow: "0 0 18px hsl(var(--primary) / 0.25)",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[10000] w-2 h-2 rounded-full"
        style={{
          background: "hsl(var(--primary))",
          boxShadow:
            "0 0 12px hsl(var(--primary) / 0.95), 0 0 32px hsl(var(--primary) / 0.55)",
          transition: "transform 70ms linear, opacity 220ms ease",
          willChange: "transform",
          opacity: 0,
        }}
      />
    </>
  );
}
