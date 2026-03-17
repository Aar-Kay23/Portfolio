import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Curved data streams flowing along the Z corridor */
export default function DataRibbons({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const RIBBON_COUNT = 80;

  const ribbonGeo = useMemo(() => {
    const allPoints: THREE.Vector3[] = [];
    for (let r = 0; r < RIBBON_COUNT; r++) {
      const baseX = (Math.random() - 0.5) * 40;
      const baseY = (Math.random() - 0.5) * 30;
      const baseZ = -Math.random() * 50 - 5;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j < 12; j++) {
        pts.push(
          new THREE.Vector3(
            baseX + j * (Math.random() * 2 - 1),
            baseY + j * (Math.random() * 1.2 - 0.6),
            baseZ - j * 1.5 // ribbons flow INTO Z depth
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const cPts = curve.getPoints(24);
      for (let k = 0; k < cPts.length - 1; k++) {
        allPoints.push(cPts[k], cPts[k + 1]);
      }
    }
    return new THREE.BufferGeometry().setFromPoints(allPoints);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Subtle rotation to add life
    groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.05) * 0.01;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={ribbonGeo}>
        <lineBasicMaterial color="#00BFA6" transparent opacity={0.035} />
      </lineSegments>
    </group>
  );
}
