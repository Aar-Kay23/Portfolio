import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Neural network nodes spread along the Z-depth corridor */
export default function NeuralNetwork({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const NODE_COUNT = 60;

  const nodes = useMemo(
    () =>
      Array.from({ length: NODE_COUNT }, () => ({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 20,
        z: -Math.random() * 40 - 3, // spread deep into Z
        speed: Math.random() * 0.25 + 0.08,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 1.5 + 0.5,
      })),
    []
  );

  // Preallocate position array for connections
  const maxConnections = 400;
  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxConnections * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Reusable vectors to avoid GC
  const posCache = useMemo(() => Array.from({ length: NODE_COUNT }, () => new THREE.Vector3()), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.1;

    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i];
      const pulse = Math.sin(t * n.pulseSpeed + n.phase) * 0.3 + 0.7;
      const x = n.x + Math.sin(t + n.phase) * 0.8;
      const y = n.y + Math.cos(t * n.speed + n.phase) * 0.5;
      const z = n.z + Math.sin(t * 0.2 + n.phase) * 0.6;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.05 + pulse * 0.025);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      posCache[i].set(x, y, z);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Dynamic connections
    if (linesRef.current) {
      const posAttr = linesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      let idx = 0;
      const maxDist = 4 + progress * 2;
      for (let i = 0; i < NODE_COUNT && idx < maxConnections; i++) {
        for (let j = i + 1; j < NODE_COUNT && idx < maxConnections; j++) {
          if (posCache[i].distanceTo(posCache[j]) < maxDist) {
            posAttr.setXYZ(idx * 2, posCache[i].x, posCache[i].y, posCache[i].z);
            posAttr.setXYZ(idx * 2 + 1, posCache[j].x, posCache[j].y, posCache[j].z);
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
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color="#00BFA6" transparent opacity={0.06} />
      </lineSegments>
    </>
  );
}
