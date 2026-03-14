import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const BG_PARTICLE_COUNT = 700;
const MID_LINE_COUNT = 280;
const SPARK_COUNT = 40;
const NODE_COUNT = 50;

/* ─── Scroll-driven camera ─── */
function ScrollCamera({ progress }: { progress: number }) {
  const { camera } = useThree();

  useFrame(() => {
    const p = progress;
    // Hero (0–0.35): cam at z6 → z3
    // Skills (0.35–0.55): dolly z3→1.5, rotateY -6°
    // Timeline (0.55–0.75): pan up y+0.8, z2.5
    // Projects+ (0.75–1): settle z3, y0
    let z: number, y: number, rotY: number;

    if (p < 0.35) {
      const t = p / 0.35;
      z = THREE.MathUtils.lerp(6, 3, t);
      y = THREE.MathUtils.lerp(1.2, 0.8, t);
      rotY = 0;
    } else if (p < 0.55) {
      const t = (p - 0.35) / 0.2;
      z = THREE.MathUtils.lerp(3, 1.5, t);
      y = THREE.MathUtils.lerp(0.8, 0.4, t);
      rotY = THREE.MathUtils.lerp(0, -0.105, t); // ~-6°
    } else if (p < 0.75) {
      const t = (p - 0.55) / 0.2;
      z = THREE.MathUtils.lerp(1.5, 2.5, t);
      y = THREE.MathUtils.lerp(0.4, 1.2, t);
      rotY = THREE.MathUtils.lerp(-0.105, -0.03, t);
    } else {
      const t = (p - 0.75) / 0.25;
      z = THREE.MathUtils.lerp(2.5, 3, t);
      y = THREE.MathUtils.lerp(1.2, 0.6, t);
      rotY = THREE.MathUtils.lerp(-0.03, 0, t);
    }

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, 0.08);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, rotY, 0.06);
  });

  return null;
}

/* ─── Volumetric fog that deepens on scroll ─── */
function DynamicFog({ progress }: { progress: number }) {
  const { scene } = useThree();

  useFrame(() => {
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      const nearTarget = THREE.MathUtils.lerp(10, 4, progress);
      const farTarget = THREE.MathUtils.lerp(30, 14, progress);
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, nearTarget, 0.05);
      scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, farTarget, 0.05);
    }
  });

  return null;
}

/* ─── Dynamic lighting that shifts with scroll ─── */
function DynamicLights({ progress }: { progress: number }) {
  const tealRef = useRef<THREE.PointLight>(null);
  const orangeRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (tealRef.current) {
      tealRef.current.intensity = THREE.MathUtils.lerp(0.6, 1.2, progress);
      tealRef.current.position.x = Math.sin(progress * Math.PI * 2) * 6;
    }
    if (orangeRef.current) {
      orangeRef.current.intensity = THREE.MathUtils.lerp(0.15, 0.5, progress);
      orangeRef.current.position.y = Math.cos(progress * Math.PI) * 4;
    }
    if (rimRef.current) {
      rimRef.current.intensity = THREE.MathUtils.lerp(0.1, 0.4, progress);
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight ref={tealRef} position={[5, 4, 5]} color="#00BFA6" intensity={0.6} distance={20} />
      <pointLight ref={orangeRef} position={[-5, -3, 3]} color="#FF7A59" intensity={0.15} distance={15} />
      <pointLight ref={rimRef} position={[0, 3, -5]} color="#4dd0e1" intensity={0.1} distance={18} />
    </>
  );
}

/* ─── Background particles (distant, slow, low opacity) ─── */
function BackgroundParticles({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: BG_PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 50,
      y: (Math.random() - 0.5) * 30,
      z: (Math.random() - 0.5) * 20 - 12,
      speed: Math.random() * 0.2 + 0.05,
      phase: Math.random() * Math.PI * 2,
      size: Math.random() * 0.015 + 0.008,
    })),
  []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.06;
    const parallax = progress * 0.02;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t + p.phase) * 0.15,
        p.y + Math.cos(t * p.speed + p.phase) * 0.1 + parallax * 50,
        p.z
      );
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BG_PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#CBD5E1" transparent opacity={0.06} />
    </instancedMesh>
  );
}

/* ─── Mid-layer data streams (merged into single LineSegments for perf) ─── */
function DataStreams({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const allPoints: THREE.Vector3[] = [];
    for (let c = 0; c < MID_LINE_COUNT; c++) {
      const startX = (Math.random() - 0.5) * 30;
      const startY = (Math.random() - 0.5) * 18;
      const startZ = (Math.random() - 0.5) * 8 - 4;
      const curvePoints: THREE.Vector3[] = [];
      for (let j = 0; j < 6; j++) {
        curvePoints.push(new THREE.Vector3(
          startX + j * (Math.random() * 1.5 - 0.75),
          startY + j * (Math.random() * 0.8 - 0.4),
          startZ + j * 0.3
        ));
      }
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const pts = curve.getPoints(12);
      for (let k = 0; k < pts.length - 1; k++) {
        allPoints.push(pts[k], pts[k + 1]);
      }
    }
    const geo = new THREE.BufferGeometry().setFromPoints(allPoints);
    return geo;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = progress * 0.06 * 50;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#00BFA6" transparent opacity={0.05} />
      </lineSegments>
    </group>
  );
}

/* ─── Neural network nodes with connections ─── */
function NetworkNodes({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(() =>
    Array.from({ length: NODE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 24,
      y: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 10 - 4,
      speed: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2,
    })),
  []);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(NODE_COUNT * NODE_COUNT * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.12;
    const parallax = progress * 0.06;

    const currentPositions: THREE.Vector3[] = [];
    positions.forEach((p, i) => {
      const x = p.x + Math.sin(t + p.phase) * 0.6;
      const y = p.y + Math.cos(t * p.speed + p.phase) * 0.5 + parallax * 30;
      const z = p.z + Math.sin(t * 0.25 + p.phase) * 0.4;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.05 + Math.sin(t * 2 + p.phase) * 0.01);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      currentPositions.push(new THREE.Vector3(x, y, z));
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    if (linesRef.current) {
      const posAttr = linesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      let idx = 0;
      for (let i = 0; i < currentPositions.length; i++) {
        for (let j = i + 1; j < currentPositions.length; j++) {
          const dist = currentPositions[i].distanceTo(currentPositions[j]);
          if (dist < 3.5 && idx < NODE_COUNT * NODE_COUNT * 2) {
            posAttr.setXYZ(idx * 2, currentPositions[i].x, currentPositions[i].y, currentPositions[i].z);
            posAttr.setXYZ(idx * 2 + 1, currentPositions[j].x, currentPositions[j].y, currentPositions[j].z);
            idx++;
          }
        }
      }
      for (let k = idx * 2; k < posAttr.count; k++) {
        posAttr.setXYZ(k, 0, 0, 0);
      }
      posAttr.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, idx * 2);
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#00BFA6" emissive="#00BFA6" emissiveIntensity={0.4} transparent opacity={0.8} />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#00BFA6" transparent opacity={0.1} />
      </lineSegments>
    </>
  );
}

/* ─── Foreground orange sparks that react to interactions ─── */
function OrangeSparks({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const sparks = useMemo(() =>
    Array.from({ length: SPARK_COUNT }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 4 + 1,
      speed: Math.random() * 0.8 + 0.3,
      phase: Math.random() * Math.PI * 2,
    })),
  []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.3;
    const parallax = progress * 0.12;
    sparks.forEach((s, i) => {
      const pulse = Math.sin(t * s.speed + s.phase) * 0.5 + 0.5;
      dummy.position.set(
        s.x + Math.sin(t * 0.5 + s.phase) * 0.8,
        s.y + Math.cos(t * s.speed * 0.3 + s.phase) * 0.6 + parallax * 30,
        s.z
      );
      dummy.scale.setScalar(0.02 * pulse + 0.005);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPARK_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#FF7A59" transparent opacity={0.6} />
    </instancedMesh>
  );
}

/* ─── Holographic grid floor ─── */
function GridFloor() {
  return (
    <gridHelper
      args={[60, 60, "#00BFA6", "#00BFA6"]}
      position={[0, -7, -5]}
      material-opacity={0.03}
      material-transparent={true}
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

    const handleScroll = () => {
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollH > 0) {
        setScrollProgress(window.scrollY / scrollH);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (reducedMotion) {
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
        camera={{ position: [0, 1.2, 6], fov: 45, near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "linear-gradient(180deg, #0F1724 0%, #080d16 40%, #0a1220 100%)" }}
      >
        <fog attach="fog" args={["#0F1724", 10, 30]} />
        <ScrollCamera progress={scrollProgress} />
        <DynamicFog progress={scrollProgress} />
        <DynamicLights progress={scrollProgress} />
        <BackgroundParticles progress={scrollProgress} />
        <DataStreams progress={scrollProgress} />
        <NetworkNodes progress={scrollProgress} />
        <OrangeSparks progress={scrollProgress} />
        <GridFloor />
      </Canvas>
    </div>
  );
}
