import { useRef, useEffect } from "react";

// ── Star layers for parallax depth ──────────────────────
const LAYERS = [
  { count: 800, size: 0.6, speed: 0.03, opacity: 0.4 },  // distant
  { count: 400, size: 1.0, speed: 0.08, opacity: 0.7 },  // mid
  { count: 150, size: 1.8, speed: 0.15, opacity: 1.0 },  // close
];

// ── Nebula clouds (static) ──────────────────────────────
const NEBULAE = [
  { x: 0.2, y: 0.3, r: 400, color: "rgba(201,168,76,0.02)" },
  { x: 0.75, y: 0.65, r: 350, color: "rgba(120,130,150,0.015)" },
  { x: 0.5, y: 0.85, r: 450, color: "rgba(201,168,76,0.018)" },
];

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  speed: number;
  isGold: boolean;
  layer: number;
}

export default function StarField({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const velocityRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const shootingRef = useRef({ active: false, x: 0, y: 0, dx: 0, dy: 0, life: 0, maxLife: 0 });
  const shootTimerRef = useRef(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // ── Initialize stars ────────────────────────────────────
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initStars();
    };

    const initStars = () => {
      const stars: Star[] = [];
      const w = window.innerWidth;
      const h = window.innerHeight;

      LAYERS.forEach((layer, li) => {
        for (let i = 0; i < layer.count; i++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          stars.push({
            x, y, baseX: x, baseY: y,
            size: layer.size + Math.random() * 0.3,
            opacity: layer.opacity * (0.5 + Math.random() * 0.5),
            speed: layer.speed,
            isGold: Math.random() < 1 / 15,
            layer: li,
          });
        }
      });
      starsRef.current = stars;
    };

    // ── Lenis velocity sync ───────────────────────────────
    // We now read window.lenisVelocity directly in the render loop

    // Also track raw scroll for velocity fallback
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    const onNativeScroll = () => {
      const now = performance.now();
      const dt = now - lastScrollTime;
      if (dt > 0) {
        velocityRef.current = (window.scrollY - lastScrollY) / dt * 16;
      }
      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };

    // ── Mouse parallax ────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // ── Shooting star logic ───────────────────────────────
    const triggerShootingStar = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const side = Math.random() > 0.5 ? 0 : w;
      shootingRef.current = {
        active: true,
        x: side === 0 ? Math.random() * w * 0.3 : w * 0.7 + Math.random() * w * 0.3,
        y: Math.random() * h * 0.5,
        dx: (side === 0 ? 1 : -1) * (6 + Math.random() * 4),
        dy: 3 + Math.random() * 3,
        life: 0,
        maxLife: 40 + Math.random() * 20,
      };
    };

    // ── Render loop (separate RAF, not GSAP ticker) ───────
    const render = () => {
      if (!ctx || !canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // Draw nebulae (static)
      NEBULAE.forEach((neb) => {
        const grad = ctx.createRadialGradient(neb.x * w, neb.y * h, 0, neb.x * w, neb.y * h, neb.r);
        grad.addColorStop(0, neb.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // Fallback velocity (if lenis isn't scrolling, use native)
      const currentVelocity = window.lenisVelocity ?? velocityRef.current;
      const vel = reducedMotion.current ? 0 : Math.abs(currentVelocity) * 0.3;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw + move stars
      for (const star of starsRef.current) {
        // Scroll drift — stars move up as user scrolls down
        if (!reducedMotion.current) {
          star.y -= star.speed * vel;

          // Wrap around
          if (star.y < -5) { star.y = h + 5; star.x = Math.random() * w; star.baseX = star.x; star.baseY = star.y; }
          if (star.y > h + 5) { star.y = -5; star.x = Math.random() * w; star.baseX = star.x; star.baseY = star.y; }
        }

        // Mouse parallax (within 150px radius) - skip Math.sqrt for perf
        let drawX = star.x;
        let drawY = star.y;
        if (mx > -9000) {
          const dx = star.x - mx;
          const dy = star.y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < 22500) { // 150 * 150
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 150) * 3 * (star.layer === 2 ? 1.5 : star.layer === 1 ? 1 : 0.5);
            drawX += dx * force * 0.05;
            drawY += dy * force * 0.05;
          }
        }

        const baseColor = star.isGold ? "201,168,76" : "240,235,225";

        // Streak effect for close stars at high velocity
        if (star.layer === 2 && vel > 2 && !reducedMotion.current) {
          const streakLen = Math.min(vel * 0.5, 8);
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(drawX, drawY + streakLen);
          ctx.strokeStyle = `rgba(${baseColor}, ${star.opacity * 0.8})`;
          ctx.lineWidth = star.size * 0.6;
          ctx.stroke();
        } else {
          // Fix 3: use fillRect instead of arc for massive performance boost
          ctx.fillStyle = `rgba(${baseColor}, ${star.opacity})`;
          ctx.fillRect(drawX - star.size * 0.5, drawY - star.size * 0.5, star.size, star.size);
        }
      }

      // ── Shooting star ───────────────────────────────────
      if (!reducedMotion.current) {
        shootTimerRef.current++;
        const shootInterval = 480 + Math.random() * 240; // ~8-12s at 60fps
        if (shootTimerRef.current > shootInterval && !shootingRef.current.active) {
          triggerShootingStar();
          shootTimerRef.current = 0;
        }

        const ss = shootingRef.current;
        if (ss.active) {
          ss.x += ss.dx;
          ss.y += ss.dy;
          ss.life++;

          const progress = ss.life / ss.maxLife;
          const alpha = progress < 0.5 ? progress * 2 : 2 - progress * 2;

          ctx.beginPath();
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(ss.x - ss.dx * 4, ss.y - ss.dy * 4);
          const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.dx * 4, ss.y - ss.dy * 4);
          grad.addColorStop(0, `rgba(240,235,225,${alpha * 0.9})`);
          grad.addColorStop(1, "rgba(240,235,225,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          if (ss.life >= ss.maxLife) ss.active = false;
        }
      }

      // Decay velocity
      velocityRef.current *= 0.95;

      rafRef.current = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, pointerEvents: "none", userSelect: "none", WebkitUserSelect: "none" }}
      aria-hidden="true"
    />
  );
}
