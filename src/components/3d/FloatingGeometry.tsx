import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Floating geometric shapes (icosahedrons, octahedrons) scattered along the Z corridor.
 * These act as "landmarks" as you travel through the depth.
 */
export default function FloatingGeometry({ progress }: { progress: number }) {
  const icoRef = useRef<THREE.InstancedMesh>(null);
  const octRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ICO_COUNT = 20;
  const OCT_COUNT = 15;

  const icos = useMemo(
    () =>
      Array.from({ length: ICO_COUNT }, (_, i) => ({
        x: (Math.random() - 0.5) * 25,
        y: (Math.random() - 0.5) * 18,
        z: -i * 3.5 - 4,
        rotSpeed: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 0.15 + 0.08,
        phase: Math.random() * Math.PI * 2,
        floatSpeed: Math.random() * 0.5 + 0.2,
      })),
    []
  );

  const octs = useMemo(
    () =>
      Array.from({ length: OCT_COUNT }, (_, i) => ({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 20,
        z: -i * 4 - 8,
        rotSpeed: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 0.12 + 0.06,
        phase: Math.random() * Math.PI * 2,
        floatSpeed: Math.random() * 0.4 + 0.15,
      })),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (icoRef.current) {
      for (let i = 0; i < ICO_COUNT; i++) {
        const g = icos[i];
        dummy.position.set(
          g.x + Math.sin(t * g.floatSpeed + g.phase) * 0.5,
          g.y + Math.cos(t * g.floatSpeed * 0.7 + g.phase) * 0.4,
          g.z
        );
        dummy.rotation.set(t * g.rotSpeed, t * g.rotSpeed * 0.7, 0);
        dummy.scale.setScalar(g.size);
        dummy.updateMatrix();
        icoRef.current.setMatrixAt(i, dummy.matrix);
      }
      icoRef.current.instanceMatrix.needsUpdate = true;
    }

    if (octRef.current) {
      for (let i = 0; i < OCT_COUNT; i++) {
        const g = octs[i];
        dummy.position.set(
          g.x + Math.cos(t * g.floatSpeed + g.phase) * 0.6,
          g.y + Math.sin(t * g.floatSpeed * 0.8 + g.phase) * 0.5,
          g.z
        );
        dummy.rotation.set(0, t * g.rotSpeed, t * g.rotSpeed * 0.5);
        dummy.scale.setScalar(g.size);
        dummy.updateMatrix();
        octRef.current.setMatrixAt(i, dummy.matrix);
      }
      octRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={icoRef} args={[undefined, undefined, ICO_COUNT]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#00BFA6"
          emissive="#00BFA6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.2}
          wireframe
        />
      </instancedMesh>
      <instancedMesh ref={octRef} args={[undefined, undefined, OCT_COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#FF7A59"
          emissive="#FF7A59"
          emissiveIntensity={0.25}
          transparent
          opacity={0.15}
          wireframe
        />
      </instancedMesh>
    </>
  );
}
