import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Dramatically enhanced Z-depth camera dolly.
 * Scroll takes you FROM far away (z:12) deep INTO the scene (z:-4).
 * This creates the "traveling inside" feeling.
 */
export default function ScrollCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 2, z: 12, rotX: 0, rotY: 0 });

  useFrame(() => {
    const p = progress;
    const t = target.current;

    if (p < 0.15) {
      // Hero: wide establishing shot, very far out
      const s = p / 0.15;
      t.z = THREE.MathUtils.lerp(12, 8, s);
      t.y = THREE.MathUtils.lerp(2.0, 1.5, s);
      t.x = THREE.MathUtils.lerp(0, 0.4, s);
      t.rotY = THREE.MathUtils.lerp(0, 0.02, s);
      t.rotX = 0;
    } else if (p < 0.25) {
      // About: push forward dramatically
      const s = (p - 0.15) / 0.1;
      t.z = THREE.MathUtils.lerp(8, 4, s);
      t.y = THREE.MathUtils.lerp(1.5, 1.0, s);
      t.x = THREE.MathUtils.lerp(0.4, -0.5, s);
      t.rotY = THREE.MathUtils.lerp(0.02, -0.04, s);
      t.rotX = THREE.MathUtils.lerp(0, 0.015, s);
    } else if (p < 0.42) {
      // Skills: deep dive - camera goes INTO the particle field
      const s = (p - 0.25) / 0.17;
      t.z = THREE.MathUtils.lerp(4, 0.5, s);
      t.y = THREE.MathUtils.lerp(1.0, 0.2, s);
      t.x = THREE.MathUtils.lerp(-0.5, 0.8, s);
      t.rotY = THREE.MathUtils.lerp(-0.04, -0.12, s);
      t.rotX = THREE.MathUtils.lerp(0.015, 0.04, s);
    } else if (p < 0.58) {
      // Experience: orbit through tunnel, dramatic close-up
      const s = (p - 0.42) / 0.16;
      t.z = THREE.MathUtils.lerp(0.5, -2, s);
      t.y = THREE.MathUtils.lerp(0.2, 0.8, s);
      t.x = THREE.MathUtils.lerp(0.8, -0.6, s);
      t.rotY = THREE.MathUtils.lerp(-0.12, 0.06, s);
      t.rotX = THREE.MathUtils.lerp(0.04, -0.02, s);
    } else if (p < 0.75) {
      // Projects: pull back slightly for overview
      const s = (p - 0.58) / 0.17;
      t.z = THREE.MathUtils.lerp(-2, -4, s);
      t.y = THREE.MathUtils.lerp(0.8, 1.5, s);
      t.x = THREE.MathUtils.lerp(-0.6, 0.3, s);
      t.rotY = THREE.MathUtils.lerp(0.06, -0.03, s);
      t.rotX = THREE.MathUtils.lerp(-0.02, 0.02, s);
    } else if (p < 0.88) {
      // Education: settle deeper
      const s = (p - 0.75) / 0.13;
      t.z = THREE.MathUtils.lerp(-4, -6, s);
      t.y = THREE.MathUtils.lerp(1.5, 0.6, s);
      t.x = THREE.MathUtils.lerp(0.3, 0, s);
      t.rotY = THREE.MathUtils.lerp(-0.03, 0, s);
      t.rotX = THREE.MathUtils.lerp(0.02, 0, s);
    } else {
      // Contact: deepest point - you've arrived
      const s = (p - 0.88) / 0.12;
      t.z = THREE.MathUtils.lerp(-6, -8, s);
      t.y = THREE.MathUtils.lerp(0.6, 0.3, s);
      t.x = 0;
      t.rotY = 0;
      t.rotX = 0;
    }

    // Smooth cinematic interpolation
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, t.x, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, t.y, 0.035);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, t.z, 0.035);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, t.rotX, 0.025);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, t.rotY, 0.025);
  });

  return null;
}
