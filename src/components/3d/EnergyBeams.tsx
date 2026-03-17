import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Converging energy beams that rush toward the camera as you scroll deeper.
 * Creates a "hyperspace" streaking effect along the Z corridor.
 */
export default function EnergyBeams({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const BEAM_COUNT = 30;

  const beamGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < BEAM_COUNT; i++) {
      const angle = (i / BEAM_COUNT) * Math.PI * 2;
      const r = 4 + Math.random() * 6;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      // Each beam is a line from far Z to near
      points.push(
        new THREE.Vector3(x, y, -60),
        new THREE.Vector3(x * 0.3, y * 0.3, 5)
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = clock.getElapsedTime() * 0.02;
    // Beams become more visible as you scroll deeper
    const mat = groupRef.current.children[0] as THREE.LineSegments;
    if (mat?.material && 'opacity' in mat.material) {
      (mat.material as THREE.LineBasicMaterial).opacity = THREE.MathUtils.lerp(0.01, 0.06, progress);
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={beamGeo}>
        <lineBasicMaterial color="#4dd0e1" transparent opacity={0.02} />
      </lineSegments>
    </group>
  );
}
