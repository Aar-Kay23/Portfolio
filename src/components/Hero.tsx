import { useRef, useEffect, useCallback } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Mail, Phone, Linkedin, Github, FileText, MapPin } from "lucide-react";
import { createRipple, removeRipple } from "@/lib/ripple";

const LINKS = {
  resume: "/Raj_Khandelwal_Tech_Resume.pdf",
  email: "raj.khandelwal2302@gmail.com",
  phone: "+91-9811945369",
  linkedin: "https://linkedin.com/in/rajkhandelwal23",
  github: "https://github.com/rajkhandelwal23",
};

const MARQUEE_ITEMS = [
  "GEN-AI ENGINEER", "COMPUTER VISION", "BACKEND ARCHITECT",
  "ML ENGINEER", "VIDEO ANALYTICS", "RAG PIPELINES",
  "FASTAPI", "YOLO", "LANGCHAIN",
];

const DIVIDER_ITEMS = "AVAILABLE FOR WORK ● AVAILABLE FOR WORK ● AVAILABLE FOR WORK ● AVAILABLE FOR WORK ● ";

export default function Hero({ ready }: { ready: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // ── Entrance + scroll animations ────────────────────────
  useGSAP(
    () => {
      if (!ready) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
      tl.set(".hero-content", { visibility: "visible" });

      // Kinetic typography — chars from y:120, rotateX:-90
      const nameChars = containerRef.current!.querySelectorAll(".name-char");
      tl.from(nameChars, {
        y: 120, rotateX: -90, autoAlpha: 0,
        stagger: 0.04, duration: 1.2, ease: "power4.out",
      });

      tl.from(".hero-subtitle", { y: "105%", duration: 0.9, ease: "power4.out" }, "-=0.6");
      tl.from(".hero-bio", { y: 30, autoAlpha: 0, duration: 0.7 }, "-=0.4");
      tl.from(".hero-cta", { y: 25, autoAlpha: 0, scale: 0.9, stagger: 0.1, duration: 0.5 }, "-=0.3");
      tl.from(".hero-stat", { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.5 }, "-=0.3");
      tl.from(".hero-social", { y: 15, autoAlpha: 0, stagger: 0.06, duration: 0.4 }, "-=0.3");
      tl.from(".hero-marquee", { autoAlpha: 0, duration: 0.6 }, "-=0.3");
      tl.from(".hero-scroll-indicator", { autoAlpha: 0, y: -10, duration: 0.5 }, "-=0.2");
      tl.from(".hero-watermark", { autoAlpha: 0, duration: 1 }, "-=0.8");

      // Floating particles entrance
      tl.from(".ambient-particle", {
        autoAlpha: 0, stagger: { each: 0.02, from: "random" }, duration: 0.5,
      }, "-=0.5");

      // Scroll indicator disappear
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top", end: "5% top",
        onLeave: () => gsap.to(".hero-scroll-indicator", { autoAlpha: 0, duration: 0.3 }),
      });

      // ── Scroll exit parallax — 400ms delay for Lenis sync ────
      setTimeout(() => {
        const section = document.getElementById('hero');
        const content = section?.querySelector('.hero-content') as HTMLElement;
        if (!section || !content) {
          console.warn('Hero parallax: #hero or .hero-content not found');
          return;
        }
        gsap.to(content, {
          yPercent: -18,
          scale: 0.93,
          opacity: 0,
          filter: 'blur(12px)',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=700',
            scrub: 2,
          }
        });
      }, 400);

      // ── GSAP ticker marquee ──────────────────────────────
      const marqueeTrack = containerRef.current!.querySelector(".marquee-track") as HTMLElement;
      if (marqueeTrack) {
        let x = 0;
        const speed = 0.5;
        const totalWidth = marqueeTrack.scrollWidth / 2;
        gsap.ticker.add(() => {
          x -= speed;
          if (x <= -totalWidth) x += totalWidth;
          gsap.set(marqueeTrack, { x });
        });
      }

      // ── Divider marquee ──────────────────────────────────
      const dividerTrack = containerRef.current!.querySelector(".divider-track") as HTMLElement;
      if (dividerTrack) {
        let dx = 0;
        const dSpeed = 0.3;
        const dTotal = dividerTrack.scrollWidth / 2;
        gsap.ticker.add(() => {
          dx -= dSpeed;
          if (dx <= -dTotal) dx += dTotal;
          gsap.set(dividerTrack, { x: dx });
        });
      }

      // ── Floating particle animations ─────────────────────
      containerRef.current!.querySelectorAll(".ambient-particle").forEach((p) => {
        gsap.to(p, {
          x: `random(-30, 30)`,
          y: `random(-30, 30)`,
          duration: `random(4, 8)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: `random(0, 3)`,
        });
      });
    },
    { scope: containerRef, dependencies: [ready] }
  );

  // ── Gradient orbs follow mouse (Change 1: warm colors, Change 4: z-depth) ──
  useEffect(() => {
    if (!orbsRef.current) return;
    const orbs = orbsRef.current.querySelectorAll(".gradient-orb");
    const xFns: ReturnType<typeof gsap.quickTo>[] = [];
    const yFns: ReturnType<typeof gsap.quickTo>[] = [];

    orbs.forEach((orb, i) => {
      const lag = 0.8 + i * 0.4;
      xFns.push(gsap.quickTo(orb, "x", { duration: lag, ease: "power3.out" }));
      yFns.push(gsap.quickTo(orb, "y", { duration: lag, ease: "power3.out" }));
    });

    const onMove = (e: MouseEvent) => {
      const cx = e.clientX - window.innerWidth / 2;
      const cy = e.clientY - window.innerHeight / 2;
      xFns.forEach((fn, i) => fn(cx * (0.08 + i * 0.04)));
      yFns.forEach((fn, i) => fn(cy * (0.08 + i * 0.04)));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // (Local magnetic logic removed in favor of global [data-magnetic] logic)

  const stats = [
    { val: "1+", label: "Year Experience" },
    { val: "15+", label: "ETL Pipelines" },
    { val: "97%", label: "ML Accuracy" },
    { val: "10K+", label: "Daily Events" },
  ];

  const nameChars = "RAJ KHANDELWAL".split("");

  // Generate ambient particles
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.3 + 0.05,
  }));

  const marqueeContent = MARQUEE_ITEMS.map((item) => (
    <span key={item} className="mx-6 md:mx-8 text-[11px] md:text-xs font-mono tracking-[0.25em] text-muted-foreground/20 uppercase whitespace-nowrap select-none flex items-center gap-3">
      <span className="w-1 h-1 rounded-full bg-[#C9A84C]/20" />
      {item}
    </span>
  ));

  return (
    <>
      <section id="hero" className="min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden" ref={containerRef} style={{ perspective: "1200px" }}>
        {/* ── Warm gradient orbs (Change 1 colors, Change 4 z-depth) ── */}
        <div ref={orbsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="gradient-orb absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.15] blur-[130px] will-change-transform"
            style={{ background: "radial-gradient(circle, #C9A84C, transparent 70%)", transform: "translateZ(-100px)" }} />
          <div className="gradient-orb absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.10] blur-[110px] will-change-transform"
            style={{ background: "radial-gradient(circle, #8B4513, transparent 70%)", transform: "translateZ(50px)" }} />
          <div className="gradient-orb absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full opacity-[0.06] blur-[100px] will-change-transform"
            style={{ background: "radial-gradient(circle, #C9A84C, transparent 70%)", transform: "translateZ(-50px)" }} />
        </div>

        {/* ── Ambient particles (Change 3) ──────────────────── */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <div key={p.id}
              className="ambient-particle absolute rounded-full will-change-transform"
              style={{
                left: p.left, top: p.top,
                width: p.size, height: p.size,
                background: "#C9A84C",
                opacity: p.opacity,
              }}
            />
          ))}
        </div>

        {/* ── Watermark "01" (Change 3) ─────────────────────── */}
        <div className="hero-watermark watermark bottom-[10%] right-[5%] text-[20vw] opacity-0" style={{ color: "rgba(201,168,76,0.04)" }}>
          01
        </div>

        <div className="hero-content w-full" style={{ visibility: "hidden" }}>
          <div className="hero-inner flex flex-col items-center text-center gap-6 md:gap-8 px-4 md:px-8 will-change-transform" style={{ transformStyle: "preserve-3d" }}>
            {/* ── Kinetic name ──────────────────────────────── */}
            <div className="overflow-hidden">
              <h1 className="flex flex-wrap justify-center" style={{ perspective: "800px" }}>
                {nameChars.map((char, i) => (
                  <span key={i}
                    className={`name-char inline-block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold will-change-transform ${
                      char === " " ? "w-4 sm:w-6 md:w-8" : "text-foreground"
                    } ${i >= 4 ? "text-gradient-teal" : ""}`}
                    style={{ transformOrigin: "center bottom" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h1>
            </div>

            <div className="overflow-hidden">
              <p className="hero-subtitle text-sm md:text-base text-muted-foreground font-mono tracking-wider">
                Software Engineer — Gen-AI · Computer Vision · Scalable Systems
              </p>
            </div>

            <p className="hero-bio text-sm md:text-base text-muted-foreground/60 leading-relaxed max-w-lg mx-auto">
              Engineering production-grade AI systems, real-time video analytics pipelines,
              and scalable backend platforms that turn complexity into clarity.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <a href={LINKS.resume} target="_blank" rel="noopener noreferrer"
                 data-magnetic="true"
                 className="magnetic-target glass-button px-7 py-3 rounded-full font-display font-bold text-sm tracking-wide text-[#C9A84C] relative overflow-hidden group"
                 onMouseLeave={(e) => removeRipple(e.currentTarget.querySelector('.ripple-drop'))}
                 onMouseEnter={(e) => createRipple(e, e.currentTarget, { filled: true })}>
                <span className="relative z-10 flex items-center gap-2"><FileText className="w-4 h-4" /> Download CV</span>
              </a>
              <a href="#contact"
                 data-magnetic="true"
                 className="magnetic-target px-7 py-3 rounded-full font-display font-bold text-sm tracking-wide text-foreground border border-white/10 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 transition-all relative overflow-hidden group"
                 onMouseLeave={(e) => removeRipple(e.currentTarget.querySelector('.ripple-drop'))}
                 onMouseEnter={(e) => createRipple(e, e.currentTarget)}>
                <span className="relative z-10 flex items-center gap-2"><Mail className="w-4 h-4" /> Let's Talk</span>
              </a>
            </div>

            <div className="flex flex-wrap gap-8 md:gap-14 justify-center mt-2">
              {stats.map((s) => (
                <div key={s.label} className="hero-stat text-center">
                  <span className="text-2xl md:text-3xl font-display font-bold text-gradient-teal">{s.val}</span>
                  <p className="text-[10px] md:text-[11px] text-muted-foreground/40 mt-1 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>

            {/* ── Social links ──────────────────────────────── */}
            <div className="flex items-center gap-3">
              {[
                { href: LINKS.github, icon: Github, label: "GitHub" },
                { href: LINKS.linkedin, icon: Linkedin, label: "LinkedIn" },
                { href: `mailto:${LINKS.email}`, icon: Mail, label: "Email" },
                { href: `tel:${LINKS.phone}`, icon: Phone, label: "Phone" },
              ].map((link) => (
                <a key={link.label} href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="hero-social magnetic-target w-10 h-10 rounded-full border border-[rgba(201,168,76,0.1)] flex items-center justify-center text-muted-foreground/50 hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.3)] transition-all"
                  aria-label={link.label}
                  data-magnetic="true">
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
              <span className="text-[10px] text-muted-foreground/25 ml-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Noida, IN
              </span>
            </div>
          </div>

          {/* ── Horizontal marquee ──────────────────────────── */}
          <div className="hero-marquee w-full overflow-hidden mt-12 md:mt-16 opacity-0">
            <div className="marquee-track flex whitespace-nowrap will-change-transform">
              {marqueeContent}{marqueeContent}
            </div>
          </div>

          {/* ── Scroll indicator ────────────────────────────── */}
          <div className="hero-scroll-indicator flex flex-col items-center mt-8">
            <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/20 mb-3 font-mono">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[rgba(201,168,76,0.3)] to-transparent relative">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] absolute -left-[2.5px] animate-bounce" style={{ animationDuration: "2s" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider marquee between hero and about (Change 3) ── */}
      <div className="w-full overflow-hidden py-6 border-y border-[rgba(201,168,76,0.06)] pointer-events-none" style={{ position: 'relative', zIndex: 0 }}>
        <div className="divider-track flex whitespace-nowrap will-change-transform">
          {[0, 1].map((i) => (
            <span key={i} className="text-[11px] font-mono tracking-[0.3em] text-muted-foreground/20 uppercase whitespace-nowrap select-none px-4">
              {DIVIDER_ITEMS}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
