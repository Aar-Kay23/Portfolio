import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Chapter scroll segments ─── */
const CHAPTERS = [
  { name: "hero", start: 0, end: 0.18 },
  { name: "about", start: 0.18, end: 0.28 },
  { name: "skills", start: 0.28, end: 0.45 },
  { name: "experience", start: 0.45, end: 0.62 },
  { name: "projects", start: 0.62, end: 0.78 },
  { name: "education", start: 0.78, end: 0.88 },
  { name: "contact", start: 0.88, end: 1.0 },
];

function getChapter(p: number) {
  return CHAPTERS.find((c) => p >= c.start && p < c.end) ?? CHAPTERS[CHAPTERS.length - 1];
}

/* ─── Scroll-driven cinematic camera ─── */
function ScrollCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 1.2, z: 6, rotX: 0, rotY: 0 });

  useFrame(() => {
    const p = progress;
    const t = target.current;

    // Chapter-based camera keyframes
    if (p < 0.18) {
      // Hero: wide establishing shot, slow zoom
      const s = p / 0.18;
      t.z = THREE.MathUtils.lerp(7, 5.5, s);
      t.y = THREE.MathUtils.lerp(1.4, 1.0, s);
      t.x = THREE.MathUtils.lerp(0, 0.3, s);
      t.rotY = THREE.MathUtils.lerp(0, 0.015, s);
      t.rotX = 0;
    } else if (p < 0.28) {
      // About: gentle push forward
      const s = (p - 0.18) / 0.1;
      t.z = THREE.MathUtils.lerp(5.5, 4.5, s);
      t.y = THREE.MathUtils.lerp(1.0, 0.8, s);
      t.x = THREE.MathUtils.lerp(0.3, -0.2, s);
      t.rotY = THREE.MathUtils.lerp(0.015, -0.02, s);
      t.rotX = 0;
    } else if (p < 0.45) {
      // Skills: dramatic close-up, slight tilt
      const s = (p - 0.28) / 0.17;
      t.z = THREE.MathUtils.lerp(4.5, 2.0, s);
      t.y = THREE.MathUtils.lerp(0.8, 0.3, s);
      t.x = THREE.MathUtils.lerp(-0.2, 0.5, s);
      t.rotY = THREE.MathUtils.lerp(-0.02, -0.105, s); // -6°
      t.rotX = THREE.MathUtils.lerp(0, 0.03, s);
    } else if (p < 0.62) {
      // Experience: orbit around timeline
      const s = (p - 0.45) / 0.17;
      t.z = THREE.MathUtils.lerp(2.0, 3.0, s);
      t.y = THREE.MathUtils.lerp(0.3, 1.0, s);
      t.x = THREE.MathUtils.lerp(0.5, -0.4, s);
      t.rotY = THREE.MathUtils.lerp(-0.105, 0.04, s);
      t.rotX = THREE.MathUtils.lerp(0.03, -0.02, s);
    } else if (p < 0.78) {
      // Projects: pull back for overview, then push into cards
      const s = (p - 0.62) / 0.16;
      t.z = THREE.MathUtils.lerp(3.0, 2.5, s);
      t.y = THREE.MathUtils.lerp(1.0, 1.4, s);
      t.x = THREE.MathUtils.lerp(-0.4, 0.2, s);
      t.rotY = THREE.MathUtils.lerp(0.04, -0.03, s);
      t.rotX = THREE.MathUtils.lerp(-0.02, 0.02, s);
    } else if (p < 0.88) {
      // Education: gentle settle
      const s = (p - 0.78) / 0.1;
      t.z = THREE.MathUtils.lerp(2.5, 3.5, s);
      t.y = THREE.MathUtils.lerp(1.4, 0.8, s);
      t.x = THREE.MathUtils.lerp(0.2, 0, s);
      t.rotY = THREE.MathUtils.lerp(-0.03, 0, s);
      t.rotX = THREE.MathUtils.lerp(0.02, 0, s);
    } else {
      // Contact: calm, centered
      const s = (p - 0.88) / 0.12;
      t.z = THREE.MathUtils.lerp(3.5, 4.0, s);
      t.y = THREE.MathUtils.lerp(0.8, 0.5, s);
      t.x = 0;
      t.rotY = 0;
      t.rotX = 0;
    }

    // Smooth interpolation (cinematic easing)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, t.x, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, t.y, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, t.z, 0.04);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, t.rotX, 0.03);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, t.rotY, 0.03);
  });

  return null;
}

/* ─── Volumetric fog that deepens as camera approaches ─── */
function DynamicFog({ progress }: { progress: number }) {
  const { scene } = useThree();

  useFrame(() => {
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      // Fog thickens in middle chapters (skills/experience) for dramatic depth
      const chapterDepth = progress < 0.28 ? 0 : progress < 0.62 ? (progress - 0.28) / 0.34 : 1 - (progress - 0.62) / 0.38;
      const nearTarget = THREE.MathUtils.lerp(12, 3, chapterDepth * 0.8);
      const farTarget = THREE.MathUtils.lerp(35, 12, chapterDepth * 0.6);
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, nearTarget, 0.03);
      scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, farTarget, 0.03);
    }
  });

  return null;
}

/* ─── Three-point cinematic lighting with scroll-driven hue shifts ─── */
function DynamicLights({ progress }: { progress: number }) {
  const keyRef = useRef<THREE.PointLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const warmRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.15;

    if (keyRef.current) {
      // Key light orbits slowly, intensifies in middle chapters
      keyRef.current.intensity = THREE.MathUtils.lerp(0.5, 1.6, Math.sin(progress * Math.PI) * 0.5 + 0.5);
      keyRef.current.position.set(
        Math.sin(t * 0.3 + progress * 4) * 8,
        4 + Math.sin(progress * Math.PI) * 2,
        Math.cos(t * 0.2) * 6
      );
    }
    if (fillRef.current) {
      fillRef.current.intensity = THREE.MathUtils.lerp(0.15, 0.4, progress);
      fillRef.current.position.set(-6, -2 + Math.sin(t * 0.4) * 1.5, 4);
    }
    if (rimRef.current) {
      rimRef.current.intensity = THREE.MathUtils.lerp(0.08, 0.5, Math.sin(progress * Math.PI * 1.5) * 0.5 + 0.5);
      rimRef.current.position.set(Math.cos(t * 0.2) * 5, 3, -6);
    }
    if (warmRef.current) {
      // Warm accent grows stronger in experience/projects chapters
      const warmth = progress > 0.4 && progress < 0.8 ? (progress - 0.4) / 0.4 : progress >= 0.8 ? 1 - (progress - 0.8) / 0.2 : 0;
      warmRef.current.intensity = THREE.MathUtils.lerp(0, 0.7, Math.max(0, warmth));
      warmRef.current.position.set(Math.sin(t * 0.5) * 4, -1, 5);
    }
  });

  return (
    <>
      <ambientLight intensity={0.12} color="#1a2a40" />
      <pointLight ref={keyRef} color="#00BFA6" distance={25} decay={2} />
      <pointLight ref={fillRef} color="#4dd0e1" distance={18} decay={2} />
      <pointLight ref={rimRef} color="#80cbc4" distance={20} decay={2} />
      <pointLight ref={warmRef} color="#FF7A59" distance={16} decay={2} />
    </>
  );
}

/* ─── Background particles: distant star field ─── */
function BackgroundStars({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const COUNT = 800;

  const stars = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 40,
        z: -(Math.random() * 25 + 8),
        twinkleSpeed: Math.random() * 2 + 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        size: Math.random() * 0.018 + 0.006,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const parallaxY = progress * 0.02 * 60;

    stars.forEach((s, i) => {
      const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.4 + 0.6;
      dummy.position.set(s.x, s.y + parallaxY, s.z);
      dummy.scale.setScalar(s.size * twinkle);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#94a3b8" transparent opacity={0.08} />
    </instancedMesh>
  );
}

/* ─── Mid-layer: data stream ribbons (curved, teal-glowing) ─── */
function DataRibbons({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const RIBBON_COUNT = 60;

  const ribbonGeo = useMemo(() => {
    const allPoints: THREE.Vector3[] = [];
    for (let r = 0; r < RIBBON_COUNT; r++) {
      const baseX = (Math.random() - 0.5) * 35;
      const baseY = (Math.random() - 0.5) * 25;
      const baseZ = (Math.random() - 0.5) * 12 - 3;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j < 10; j++) {
        pts.push(
          new THREE.Vector3(
            baseX + j * (Math.random() * 2 - 1),
            baseY + j * (Math.random() * 1.2 - 0.6),
            baseZ + j * 0.4
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const cPts = curve.getPoints(20);
      for (let k = 0; k < cPts.length - 1; k++) {
        allPoints.push(cPts[k], cPts[k + 1]);
      }
    }
    return new THREE.BufferGeometry().setFromPoints(allPoints);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = progress * 0.06 * 40;
    groupRef.current.rotation.z = Math.sin(progress * Math.PI * 0.5) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={ribbonGeo}>
        <lineBasicMaterial color="#00BFA6" transparent opacity={0.04} />
      </lineSegments>
    </group>
  );
}

/* ─── Neural network: nodes with dynamic connections ─── */
function NeuralNetwork({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const NODE_COUNT = 45;

  const nodes = useMemo(
    () =>
      Array.from({ length: NODE_COUNT }, () => ({
        x: (Math.random() - 0.5) * 28,
        y: (Math.random() - 0.5) * 18,
        z: (Math.random() - 0.5) * 10 - 3,
        speed: Math.random() * 0.25 + 0.08,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 1.5 + 0.5,
      })),
    []
  );

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(NODE_COUNT * NODE_COUNT * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.1;
    const parallaxY = progress * 0.06 * 30;
    const currentPos: THREE.Vector3[] = [];

    nodes.forEach((n, i) => {
      const pulse = Math.sin(t * n.pulseSpeed + n.phase) * 0.3 + 0.7;
      const x = n.x + Math.sin(t + n.phase) * 0.7;
      const y = n.y + Math.cos(t * n.speed + n.phase) * 0.5 + parallaxY;
      const z = n.z + Math.sin(t * 0.2 + n.phase) * 0.5;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.04 + pulse * 0.02);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      currentPos.push(new THREE.Vector3(x, y, z));
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Dynamic connections
    if (linesRef.current) {
      const posAttr = linesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      let idx = 0;
      const maxDist = 3.2 + progress * 1.5; // connections grow denser as you scroll deeper
      for (let i = 0; i < currentPos.length && idx < NODE_COUNT * NODE_COUNT; i++) {
        for (let j = i + 1; j < currentPos.length && idx < NODE_COUNT * NODE_COUNT; j++) {
          if (currentPos[i].distanceTo(currentPos[j]) < maxDist) {
            posAttr.setXYZ(idx * 2, currentPos[i].x, currentPos[i].y, currentPos[i].z);
            posAttr.setXYZ(idx * 2 + 1, currentPos[j].x, currentPos[j].y, currentPos[j].z);
            idx++;
          }
        }
      }
      for (let k = idx * 2; k < posAttr.count; k++) posAttr.setXYZ(k, 0, 0, 0);
      posAttr.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, idx * 2);
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial
          color="#00BFA6"
          emissive="#00BFA6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.75}
        />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color="#00BFA6" transparent opacity={0.08} />
      </lineSegments>
    </>
  );
}

/* ─── Foreground orange sparks: pulse on interaction ─── */
function OrangeSparks({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const SPARK_COUNT = 45;

  const sparks = useMemo(
    () =>
      Array.from({ length: SPARK_COUNT }, () => ({
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 4 + 2,
        speed: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.6 + 0.2,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.25;
    const parallaxY = progress * 0.12 * 25;

    sparks.forEach((s, i) => {
      const pulse = Math.sin(t * s.speed * 2 + s.phase) * 0.5 + 0.5;
      const breathe = Math.sin(t * 0.3 + s.phase) * s.drift;
      dummy.position.set(
        s.x + Math.sin(t * 0.4 + s.phase) * 1.2,
        s.y + Math.cos(t * s.speed * 0.3 + s.phase) * 0.8 + parallaxY,
        s.z + breathe
      );
      dummy.scale.setScalar(0.015 * pulse + 0.005);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPARK_COUNT]}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshBasicMaterial color="#FF7A59" transparent opacity={0.55} />
    </instancedMesh>
  );
}

/* ─── Holographic grid floor with scroll parallax ─── */
function GridFloor({ progress }: { progress: number }) {
  const ref = useRef<THREE.GridHelper>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.y = -8 + progress * 2;
    (ref.current.material as THREE.Material).opacity = THREE.MathUtils.lerp(0.025, 0.06, Math.sin(progress * Math.PI) * 0.5 + 0.5);
  });

  return (
    <gridHelper
      ref={ref}
      args={[80, 80, "#00BFA6", "#00BFA6"]}
      position={[0, -8, -5]}
      material-transparent={true}
      material-opacity={0.025}
    />
  );
}

/* ─── Main export ─── */
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

  // Check low-GPU toggle from localStorage
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
        camera={{ position: [0, 1.4, 7], fov: 45, near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "linear-gradient(180deg, #0F1724 0%, #080d16 40%, #0a1220 100%)" }}
      >
        <fog attach="fog" args={["#0F1724", 12, 35]} />
        <ScrollCamera progress={scrollProgress} />
        <DynamicFog progress={scrollProgress} />
        <DynamicLights progress={scrollProgress} />
        <BackgroundStars progress={scrollProgress} />
        <DataRibbons progress={scrollProgress} />
        <NeuralNetwork progress={scrollProgress} />
        <OrangeSparks progress={scrollProgress} />
        <GridFloor progress={scrollProgress} />
      </Canvas>
    </div>
  );
}
