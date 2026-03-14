import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 40;
const PARTICLE_COUNT = 200;

function NetworkNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 10 - 5,
        speed: Math.random() * 0.3 + 0.1,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return pos;
  }, []);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(NODE_COUNT * NODE_COUNT * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.15;

    const currentPositions: THREE.Vector3[] = [];
    positions.forEach((p, i) => {
      const x = p.x + Math.sin(t + p.phase) * 0.5;
      const y = p.y + Math.cos(t * p.speed + p.phase) * 0.4;
      const z = p.z + Math.sin(t * 0.3 + p.phase) * 0.3;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.04);
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
          if (dist < 4 && idx < NODE_COUNT * NODE_COUNT * 2) {
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
        <meshBasicMaterial color="#00BFA6" transparent opacity={0.7} />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#00BFA6" transparent opacity={0.08} />
      </lineSegments>
    </>
  );
}

function FloatingParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 15 - 5,
      speed: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.1;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t + p.phase) * 0.3,
        p.y + Math.cos(t * p.speed + p.phase) * 0.2,
        p.z
      );
      dummy.scale.setScalar(0.015 + Math.sin(t * 2 + p.phase) * 0.005);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#CBD5E1" transparent opacity={0.3} />
    </instancedMesh>
  );
}

function GridFloor() {
  return (
    <gridHelper
      args={[40, 40, "#00BFA6", "#00BFA6"]}
      position={[0, -6, -5]}
      rotation={[0, 0, 0]}
      material-opacity={0.04}
      material-transparent={true}
    />
  );
}

export default function CinematicBackground() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "linear-gradient(180deg, #0F1724 0%, #0a1018 50%, #0F1724 100%)" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#00BFA6" />
        <pointLight position={[-5, -3, 3]} intensity={0.2} color="#FF7A59" />
        <fog attach="fog" args={["#0F1724", 8, 25]} />
        <NetworkNodes />
        <FloatingParticles />
        <GridFloor />
      </Canvas>
    </div>
  );
}
