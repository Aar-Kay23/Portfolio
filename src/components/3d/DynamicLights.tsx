import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DynamicLights({ progress }: { progress: number }) {
  const keyRef = useRef<THREE.PointLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const warmRef = useRef<THREE.PointLight>(null);
  const depthRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.15;

    if (keyRef.current) {
      keyRef.current.intensity = THREE.MathUtils.lerp(0.6, 2.0, Math.sin(progress * Math.PI) * 0.5 + 0.5);
      keyRef.current.position.set(
        Math.sin(t * 0.3 + progress * 4) * 10,
        5 + Math.sin(progress * Math.PI) * 3,
        -progress * 20 + Math.cos(t * 0.2) * 6
      );
    }
    if (fillRef.current) {
      fillRef.current.intensity = THREE.MathUtils.lerp(0.15, 0.5, progress);
      fillRef.current.position.set(-8, -2 + Math.sin(t * 0.4) * 2, -progress * 15);
    }
    if (rimRef.current) {
      rimRef.current.intensity = THREE.MathUtils.lerp(0.1, 0.6, Math.sin(progress * Math.PI * 1.5) * 0.5 + 0.5);
      rimRef.current.position.set(Math.cos(t * 0.2) * 6, 4, -progress * 18 - 6);
    }
    if (warmRef.current) {
      const warmth = progress > 0.4 && progress < 0.8 ? (progress - 0.4) / 0.4 : progress >= 0.8 ? 1 - (progress - 0.8) / 0.2 : 0;
      warmRef.current.intensity = THREE.MathUtils.lerp(0, 1.0, Math.max(0, warmth));
      warmRef.current.position.set(Math.sin(t * 0.5) * 5, -1, -progress * 12 + 5);
    }
    // Depth beacon - a light that's always ahead of camera, drawing you in
    if (depthRef.current) {
      depthRef.current.position.set(0, 0, -progress * 25 - 10);
      depthRef.current.intensity = THREE.MathUtils.lerp(0.3, 1.2, progress);
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} color="#1a2a40" />
      <pointLight ref={keyRef} color="#00BFA6" distance={30} decay={2} />
      <pointLight ref={fillRef} color="#4dd0e1" distance={22} decay={2} />
      <pointLight ref={rimRef} color="#80cbc4" distance={24} decay={2} />
      <pointLight ref={warmRef} color="#FF7A59" distance={20} decay={2} />
      <pointLight ref={depthRef} color="#00BFA6" distance={40} decay={1.5} />
    </>
  );
}
