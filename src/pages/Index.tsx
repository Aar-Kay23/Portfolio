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
      {/* 3D Background with fallback */}
      {hasWebGL ? (
        <Suspense fallback={<div className="fixed inset-0 -z-10 bg-background" />}>
          <CinematicBackground />
        </Suspense>
      ) : (
        <div
          className="fixed inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, hsl(218 40% 13%) 0%, hsl(218 45% 7%) 70%)",
          }}
        />
      )}

      <Navigation />

      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
