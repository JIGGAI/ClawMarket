"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
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
  const { scene, animations } = useGLTF("/models/chef-ant.glb");
  const { actions } = useAnimations(animations, root);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    const first = Object.values(actions)[0];
    if (first) {
      first.reset().fadeIn(0.25).play();
    }
    return () => {
      first?.fadeOut(0.2);
    };
  }, [actions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (root.current) root.current.rotation.y = Math.sin(t * 0.55) * 0.14;
  });

  return (
    <group ref={root} position={[0, -1.42, 0]} scale={1.95}>
      <primitive object={scene} />
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

useGLTF.preload("/models/chef-ant.glb");
