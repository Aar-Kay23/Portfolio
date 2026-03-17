import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Distant star field spread along the Z-depth corridor */
export default function BackgroundStars({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const COUNT = 1200;

  const stars = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 50,
        z: Math.random() * -60 - 5, // spread deeply along Z
        twinkleSpeed: Math.random() * 2 + 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        size: Math.random() * 0.02 + 0.005,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < COUNT; i++) {
      const s = stars[i];
      const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.4 + 0.6;
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.setScalar(s.size * twinkle);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#94a3b8" transparent opacity={0.06} />
    </instancedMesh>
  );
}
