import { Suspense, lazy } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const CinematicBackground = lazy(() => import("@/components/CinematicBackground"));

function WebGLCheck() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

const hasWebGL = WebGLCheck();

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {hasWebGL ? (
        <Suspense
          fallback={
            <div
              className="fixed inset-0 -z-10"
              style={{ background: "radial-gradient(ellipse at 50% 30%, hsl(232 32% 14%) 0%, hsl(230 35% 5%) 70%)" }}
            />
          }
        >
          <CinematicBackground />
        </Suspense>
      ) : (
        <div
          className="fixed inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, hsl(232 32% 14%) 0%, hsl(230 35% 5%) 70%)",
          }}
        />
      )}

      {/* Atmospheric overlays */}
      <div className="vignette" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />

      <Navigation />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>

      <Footer />

      <ScrollProgress />
    </div>
  );
};

function ScrollProgress() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-foreground/5">
      <div
        className="h-full transition-none"
        id="scroll-progress"
        style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" }}
        ref={(el) => {
          if (!el) return;
          const update = () => {
            const scrollH = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollH > 0) {
              el.style.width = `${(window.scrollY / scrollH) * 100}%`;
            }
            requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
        }}
      />
    </div>
  );
}

export default Index;
