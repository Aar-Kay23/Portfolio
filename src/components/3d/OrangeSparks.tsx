import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Foreground sparks that travel with the camera depth */
export default function OrangeSparks({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const SPARK_COUNT = 50;

  const sparks = useMemo(
    () =>
      Array.from({ length: SPARK_COUNT }, () => ({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 15,
        z: -Math.random() * 35,
        speed: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.6 + 0.2,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.25;

    for (let i = 0; i < SPARK_COUNT; i++) {
      const s = sparks[i];
      const pulse = Math.sin(t * s.speed * 2 + s.phase) * 0.5 + 0.5;
      dummy.position.set(
        s.x + Math.sin(t * 0.4 + s.phase) * 1.5,
        s.y + Math.cos(t * s.speed * 0.3 + s.phase) * 1.0,
        s.z + Math.sin(t * 0.3 + s.phase) * s.drift
      );
      dummy.scale.setScalar(0.018 * pulse + 0.006);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPARK_COUNT]}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshBasicMaterial color="#FF7A59" transparent opacity={0.6} />
    </instancedMesh>
  );
}
