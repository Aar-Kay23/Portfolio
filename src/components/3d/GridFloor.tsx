import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GridFloor({ progress }: { progress: number }) {
  const ref = useRef<THREE.GridHelper>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.y = -10;
    ref.current.position.z = -progress * 20;
    (ref.current.material as THREE.Material).opacity = THREE.MathUtils.lerp(
      0.02,
      0.06,
      Math.sin(progress * Math.PI) * 0.5 + 0.5
    );
  });

  return (
    <gridHelper
      ref={ref}
      args={[120, 120, "#00BFA6", "#00BFA6"]}
      position={[0, -10, -20]}
      material-transparent={true}
      material-opacity={0.02}
    />
  );
}
