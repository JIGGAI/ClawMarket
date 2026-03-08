"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

function Steam() {
  const points = useRef<Mesh[]>([]);
  const seeds = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        x: (i % 4) * 0.14 - 0.22,
        z: Math.floor(i / 4) * 0.08 - 0.08,
        offset: ((i * 1.73) % 1) * Math.PI * 2,
      })),
    [],
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    points.current.forEach((mesh, i) => {
      if (!mesh) return;
      const seed = seeds[i];
      const phase = t * 1.6 + seed.offset;
      const y = 1.25 + (phase % 2.6) * 0.28;
      mesh.position.set(seed.x + Math.sin(phase) * 0.04, y, 0.5 + seed.z);
      const s = 0.04 + ((phase % 2.6) / 2.6) * 0.08;
      mesh.scale.setScalar(s);
      const mat = mesh.material as { opacity?: number };
      if (typeof mat.opacity === "number") {
        mat.opacity = 0.5 - ((phase % 2.6) / 2.6) * 0.45;
      }
    });
  });

  return (
    <group>
      {seeds.map((_, i) => (
        <mesh key={i} ref={(el) => {
          if (el) points.current[i] = el;
        }}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#dbeafe" transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function ChefModel() {
  const root = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const pan = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (root.current) root.current.rotation.y = Math.sin(t * 0.55) * 0.12;
    if (rightArm.current) rightArm.current.rotation.z = -0.65 + Math.sin(t * 3.1) * 0.28;
    if (leftArm.current) leftArm.current.rotation.z = 0.45 + Math.sin(t * 2.6 + 0.4) * 0.14;
    if (pan.current) {
      pan.current.rotation.z = Math.sin(t * 3.1 + 0.7) * 0.22;
      pan.current.position.y = 0.78 + Math.sin(t * 3.1) * 0.05;
    }
  });

  return (
    <group ref={root} position={[0, -1.2, 0]}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <capsuleGeometry args={[0.6, 1.15, 10, 18]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.45} metalness={0.05} />
      </mesh>

      <mesh position={[0, 1.25, 0.04]} castShadow>
        <sphereGeometry args={[0.45, 28, 28]} />
        <meshStandardMaterial color="#ffd7b5" roughness={0.65} />
      </mesh>

      <mesh position={[0, 1.73, 0.03]} castShadow>
        <cylinderGeometry args={[0.4, 0.48, 0.3, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.38} />
      </mesh>
      <mesh position={[0, 1.98, 0.03]} castShadow>
        <sphereGeometry args={[0.33, 24, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.38} />
      </mesh>

      <group ref={leftArm} position={[-0.62, 0.72, 0.06]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.65, 8, 16]} />
          <meshStandardMaterial color="#ffd7b5" roughness={0.65} />
        </mesh>
      </group>

      <group ref={rightArm} position={[0.58, 0.8, 0.18]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.72, 8, 16]} />
          <meshStandardMaterial color="#ffd7b5" roughness={0.65} />
        </mesh>
      </group>

      <group ref={pan} position={[0.95, 0.78, 0.45]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.36, 0.4, 0.1, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.26} />
        </mesh>
        <mesh position={[0.45, 0.03, 0]} castShadow>
          <boxGeometry args={[0.6, 0.05, 0.08]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.35} />
        </mesh>
      </group>

      <Steam />
    </group>
  );
}

export function Chef3D() {
  return (
    <div className="chef-3d-wrap" aria-label="3D chef cooking scene">
      <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 36 }}>
        <color attach="background" args={["#0b1624"]} />
        <fog attach="fog" args={["#0b1624", 6, 10]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <pointLight position={[-2, 2.5, 1]} intensity={0.75} color="#ff6b6b" />
        <pointLight position={[2, 2, 2]} intensity={0.5} color="#67e8f9" />

        <Float speed={1.25} rotationIntensity={0.08} floatIntensity={0.12}>
          <ChefModel />
        </Float>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
          <circleGeometry args={[3.2, 60]} />
          <meshStandardMaterial color="#0e1b2b" roughness={0.95} />
        </mesh>

        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.12} maxPolarAngle={1.5} />
      </Canvas>
    </div>
  );
}
