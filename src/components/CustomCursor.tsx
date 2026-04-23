import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor({ visible }: { visible?: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ── Fade in cursor when `visible` prop flips to true ────
  useEffect(() => {
    if (!isDesktop) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    if (visible) {
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.5, delay: 0.3 });
    } else {
      gsap.set([dot, ring], { autoAlpha: 0 });
    }
  }, [visible, isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;
    if (!dot || !ring || !text) return;

    dot.style.display = "block";
    ring.style.display = "flex";
    document.documentElement.classList.add("custom-cursor-active");

    // Start hidden (preloader phase) — visible prop controls fade-in
    gsap.set([dot, ring], { autoAlpha: visible ? 1 : 0 });

    // ── quickTo for buttery smooth tracking ──────────────
    const xRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
    const xDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });

    gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 1 });
    gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 1 });

    // ── Document-level mousemove — never loses track ──────
    const onMove = (e: MouseEvent) => {
      const oob =
        e.clientX <= 0 ||
        e.clientY <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight;

      if (oob) {
        gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
        return;
      }

      // Force visibility — kills any GSAP tween that might be fading them out
      gsap.killTweensOf([dot, ring], "opacity,visibility");
      dot.style.opacity = "1";
      dot.style.visibility = "visible";
      ring.style.opacity = "1";
      ring.style.visibility = "visible";

      xRing(e.clientX);
      yRing(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);
    };

    // ── Hover via event delegation ──────────────────────────
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Project card hover — show "VIEW" text
      const card = target.closest(".project-card");
      if (card) {
        gsap.to(ring, { scale: 1.8, borderColor: "rgba(201,168,76,1)", borderWidth: "1.5px", duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { scale: 0.3, duration: 0.3, ease: "power2.out" });
        gsap.to(text, { autoAlpha: 1, duration: 0.3 });
        return;
      }

      const interactive = target.closest('a, button, [data-magnetic], [role="button"], input, textarea');
      if (interactive) {
        gsap.to(ring, { scale: 1.8, borderColor: "rgba(201,168,76,1)", borderWidth: "1.5px", duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { scale: 0.3, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(ring, { scale: 1, borderColor: "rgba(201,168,76,0.5)", borderWidth: "1px", duration: 0.5, ease: "elastic.out(1, 0.5)" });
        gsap.to(dot, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        gsap.to(text, { autoAlpha: 0, duration: 0.2 });
      }
    };

    // ── Click squish ────────────────────────────────────────
    const onClick = () => {
      gsap.to(ring, {
        scale: 0.75, duration: 0.1, ease: "power2.in",
        onComplete: () => gsap.to(ring, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" }),
      });
    };

    // ── Attach at document level ──────────────────────────
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onClick);
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [isDesktop, visible]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Inner dot — warm gold */}
      <div
        ref={dotRef}
        className="custom-cursor-dot fixed top-0 left-0 pointer-events-none hidden"
        style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#C9A84C",
          willChange: "transform",
          zIndex: 2147483647,
          opacity: 0, visibility: "hidden",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring fixed top-0 left-0 pointer-events-none hidden items-center justify-center"
        style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.5)",
          background: "transparent",
          willChange: "transform",
          zIndex: 2147483646,
          transition: "border-color 0.3s",
          opacity: 0, visibility: "hidden",
        }}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ opacity: 0 }}
        />
        <span
          ref={textRef}
          className="relative z-10 text-[9px] font-display font-bold tracking-[0.2em] text-white/90 uppercase"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          VIEW
        </span>
      </div>
    </>
  );
}
