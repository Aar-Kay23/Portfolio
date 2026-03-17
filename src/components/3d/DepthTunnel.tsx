import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A series of rings that form a tunnel along the Z axis.
 * As you scroll, you travel through the rings — creating the "entering the world" effect.
 */
export default function DepthTunnel({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const RING_COUNT = 40;

  const rings = useMemo(
    () =>
      Array.from({ length: RING_COUNT }, (_, i) => ({
        z: -i * 2, // evenly spaced along Z corridor
        radius: 3 + Math.sin(i * 0.5) * 1.5,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.1;

    for (let i = 0; i < RING_COUNT; i++) {
      const r = rings[i];
      dummy.position.set(0, 0, r.z);
      dummy.rotation.set(
        Math.sin(t + r.phase) * 0.1,
        t * r.rotSpeed,
        Math.cos(t * 0.5 + r.phase) * 0.05
      );
      const scale = r.radius;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, RING_COUNT]} frustumCulled={false}>
      <torusGeometry args={[1, 0.008, 8, 64]} />
      <meshBasicMaterial color="#00BFA6" transparent opacity={0.08} />
    </instancedMesh>
  );
}
