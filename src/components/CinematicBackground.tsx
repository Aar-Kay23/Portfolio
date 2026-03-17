import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

import ScrollCamera from "./3d/ScrollCamera";
import DynamicFog from "./3d/DynamicFog";
import DynamicLights from "./3d/DynamicLights";
import BackgroundStars from "./3d/BackgroundStars";
import DataRibbons from "./3d/DataRibbons";
import NeuralNetwork from "./3d/NeuralNetwork";
import OrangeSparks from "./3d/OrangeSparks";
import DepthTunnel from "./3d/DepthTunnel";
import FloatingGeometry from "./3d/FloatingGeometry";
import EnergyBeams from "./3d/EnergyBeams";
import PulseWaves from "./3d/PulseWaves";
import GridFloor from "./3d/GridFloor";

export default function CinematicBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    const handleScroll = () => {
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollH > 0) setScrollProgress(window.scrollY / scrollH);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const [lowGPU, setLowGPU] = useState(() => {
    try { return localStorage.getItem("lowGPU") === "true"; } catch { return false; }
  });

  useEffect(() => {
    const handler = () => {
      try { setLowGPU(localStorage.getItem("lowGPU") === "true"); } catch {}
    };
    window.addEventListener("storage", handler);
    window.addEventListener("lowgpu-toggle", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("lowgpu-toggle", handler);
    };
  }, []);

  if (reducedMotion || lowGPU) {
    return (
      <div
        className="fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #141f30 0%, #0a1018 70%)",
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 45, near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "linear-gradient(180deg, #0F1724 0%, #080d16 40%, #0a1220 100%)" }}
      >
        <fog attach="fog" args={["#0F1724", 15, 50]} />

        {/* Camera & atmosphere */}
        <ScrollCamera progress={scrollProgress} />
        <DynamicFog progress={scrollProgress} />
        <DynamicLights progress={scrollProgress} />

        {/* Background layer (parallax 0.02) */}
        <BackgroundStars progress={scrollProgress} />
        <EnergyBeams progress={scrollProgress} />

        {/* Mid layer (parallax 0.06) */}
        <DataRibbons progress={scrollProgress} />
        <NeuralNetwork progress={scrollProgress} />
        <DepthTunnel progress={scrollProgress} />
        <PulseWaves progress={scrollProgress} />

        {/* Foreground layer (parallax 0.12) */}
        <OrangeSparks progress={scrollProgress} />
        <FloatingGeometry progress={scrollProgress} />

        {/* Ground reference */}
        <GridFloor progress={scrollProgress} />
      </Canvas>
    </div>
  );
}
