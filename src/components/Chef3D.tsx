"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Color, MeshStandardMaterial } from "three";
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
  const toolRig = useRef<Group>(null);
  const { scene, animations } = useGLTF("/models/chef-ant.glb");
  const { actions } = useAnimations(animations, root);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) {
        const paletteMaterial = new MeshStandardMaterial({
          roughness: 0.56,
          metalness: 0.08,
        });
        paletteMaterial.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            "void main() {",
            "varying vec3 vLocalPos;\nvoid main() {\n  vLocalPos = position;",
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 diffuseColor = vec4( diffuse, opacity );",
            `
              varying vec3 vLocalPos;
              vec3 redBody = vec3(0.86, 0.16, 0.20);
              vec3 whiteCloth = vec3(0.95, 0.97, 1.0);
              vec3 darkTool = vec3(0.12, 0.16, 0.22);

              bool hat = vLocalPos.y > 0.56;
              bool coat = vLocalPos.y > -0.14 && vLocalPos.y < 0.38 && abs(vLocalPos.x) < 0.62;
              bool toolSide = (vLocalPos.x > 0.52 && vLocalPos.y < 0.2) || (vLocalPos.z > 0.38 && vLocalPos.y < 0.12);

              vec3 zoneColor = redBody;
              if (coat || hat) zoneColor = whiteCloth;
              if (toolSide) zoneColor = darkTool;
              vec4 diffuseColor = vec4(zoneColor, opacity);
            `,
          );
        };
        mesh.material = paletteMaterial;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    const first = Object.values(actions)[0];
    if (first) {
      first.timeScale = 1.15;
      first.reset().fadeIn(0.25).play();
    }
    return () => {
      first?.fadeOut(0.2);
    };
  }, [actions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (root.current) {
      root.current.rotation.y = Math.sin(t * 1.05) * 0.2;
      root.current.rotation.z = Math.sin(t * 2.8) * 0.05;
      root.current.position.y = -1.42 + Math.sin(t * 2.5) * 0.03;
    }
    if (toolRig.current) {
      toolRig.current.rotation.z = -0.2 + Math.sin(t * 3.8) * 0.32;
      toolRig.current.rotation.x = Math.sin(t * 4.2) * 0.1;
      toolRig.current.position.y = 0.62 + Math.sin(t * 3.8) * 0.06;
    }
  });

  return (
    <group ref={root} position={[0, -1.42, 0]} scale={1.95}>
      <primitive object={scene} />
      <group ref={toolRig} position={[0.72, 0.62, 0.46]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.19, 0.24, 0.08, 28]} />
          <meshStandardMaterial color={new Color("#1a2434")} metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0.28, 0.03, 0]} castShadow>
          <boxGeometry args={[0.34, 0.04, 0.07]} />
          <meshStandardMaterial color={new Color("#111827")} metalness={0.55} roughness={0.3} />
        </mesh>
      </group>
      <Steam />
    </group>
  );
}

export function Chef3D() {
  return (
    <div className="chef-3d-wrap" aria-label="3D chef cooking scene">
      <Canvas shadows camera={{ position: [0.2, 1.65, 4.15], fov: 33 }}>
        <color attach="background" args={["#0b1624"]} />
        <fog attach="fog" args={["#0b1624", 6, 10]} />
        <ambientLight intensity={0.48} />
        <directionalLight position={[3, 5, 2]} intensity={1.35} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <pointLight position={[-2, 2.5, 1]} intensity={1.05} color="#ef4444" />
        <pointLight position={[2, 2, 2]} intensity={0.35} color="#67e8f9" />

        <Float speed={1.4} rotationIntensity={0.07} floatIntensity={0.08}>
          <ChefModel />
        </Float>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
          <circleGeometry args={[3.2, 60]} />
          <meshStandardMaterial color="#0e1b2b" roughness={0.95} />
        </mesh>

        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.1} maxPolarAngle={1.46} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/chef-ant.glb");
