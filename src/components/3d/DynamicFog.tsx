import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function DynamicFog({ progress }: { progress: number }) {
  const { scene } = useThree();

  useFrame(() => {
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      // Fog gets closer as you dive deeper - enhances depth perception
      const depth = Math.sin(progress * Math.PI);
      const nearTarget = THREE.MathUtils.lerp(15, 2, depth * 0.7);
      const farTarget = THREE.MathUtils.lerp(50, 15, depth * 0.5);
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, nearTarget, 0.03);
      scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, farTarget, 0.03);
    }
  });

  return null;
}
