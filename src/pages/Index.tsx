import { useRef, useState, useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP, initLenis } from "@/lib/gsap";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Activities from "@/components/Activities";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import PageTransition from "@/components/PageTransition";
import StarField from "@/components/StarField";

const Index = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // ── Phase 1: Init Lenis after preloader completes ────
  useEffect(() => {
    if (!preloaderDone) return;
    initLenis();
    const t = setTimeout(() => {
      setHeroReady(true);
      setTimeout(() => ScrollTrigger.refresh(), 200);
    }, 100);
    return () => clearTimeout(t);
  }, [preloaderDone]);

  // ── Scroll progress bar via ScrollTrigger ────────────
  useGSAP(() => {
    if (!progressRef.current || !preloaderDone) return;
    gsap.to(progressRef.current, {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
    });
  }, { dependencies: [preloaderDone] });

  // ── Initialize Magnetic Elements (desktop only) ────────
  useEffect(() => {
    if (!preloaderDone) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const t = setTimeout(() => {
        const magnetics = document.querySelectorAll("[data-magnetic]");
        magnetics.forEach((el) => {
          const hEl = el as HTMLElement;
          let rect: DOMRect | null = null;
          
          hEl.addEventListener("mouseenter", () => {
            rect = hEl.getBoundingClientRect();
          });
          
          hEl.addEventListener("mousemove", (e) => {
            if (!rect) rect = hEl.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
            gsap.to(hEl, { x, y, duration: 0.4, ease: "power2.out" });
          });
          
          hEl.addEventListener("mouseleave", () => {
            rect = null;
            gsap.to(hEl, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
          });
        });
      }, 500);
      return () => clearTimeout(t);
    });

    return () => mm.revert();
  }, [preloaderDone]);

  return (
    <div className="min-h-screen bg-background relative" style={{ perspective: "1200px" }}>
      {/* Preloader */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      {/* Fix 4: Star field background — replaces CinematicBackground */}
      <StarField active={preloaderDone} />

      {/* Fix 2: Cursor hidden during preloader, visible after */}
      <CustomCursor visible={preloaderDone} />
      <PageTransition />
      <Navigation />

      <main className="relative" style={{ zIndex: 1 }}>
        <Hero ready={heroReady} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Activities />
        <Contact />
      </main>

      <Footer />

      {/* Scroll progress — warm gold */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px]">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-[#C9A84C] to-[rgba(201,168,76,0.3)] origin-left" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
};

export default Index;
