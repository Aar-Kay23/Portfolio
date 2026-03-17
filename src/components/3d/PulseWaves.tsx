import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Concentric pulse rings that expand outward from depth points.
 * Creates visual "sonar" pulses at key Z-depth positions, marking chapter transitions.
 */
export default function PulseWaves({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const PULSE_COUNT = 12;

  // Each pulse is at a Z-depth corresponding to a chapter boundary
  const pulses = useMemo(
    () =>
      Array.from({ length: PULSE_COUNT }, (_, i) => ({
        z: -i * 6,
        phase: i * 0.8,
        maxRadius: 5 + Math.random() * 3,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PULSE_COUNT; i++) {
      const p = pulses[i];
      const wave = (Math.sin(t * 0.5 + p.phase) + 1) * 0.5; // 0-1 oscillation
      const scale = wave * p.maxRadius;
      const fade = 1 - wave; // fade out as it expands

      dummy.position.set(0, 0, p.z);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.scale.set(scale || 0.01, scale || 0.01, scale || 0.01);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PULSE_COUNT]} frustumCulled={false}>
      <ringGeometry args={[0.95, 1, 64]} />
      <meshBasicMaterial color="#00BFA6" transparent opacity={0.04} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}
