"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Programmatic texture generator to create circular glowing bokeh dots
const createBokehTexture = () => {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  
  if (ctx) {
    // Radial gradient from solid white center to transparent edge
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

export const Scene: React.FC = () => {
  const dustRef = useRef<THREE.Points>(null);
  const bokehRef = useRef<THREE.Points>(null);
  const centralMeshRef = useRef<THREE.Mesh>(null);

  // Detect mobile device width dynamically on client-side
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Track mouse coordinates for parallax drift via mutable ref to prevent React rerenders on every movement
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate warm orange dust particles positions
  const dustData = useMemo(() => {
    const count = isMobile ? 120 : 350;
    const positions = new Float32Array(count * 3);
    const randomSpeed = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 10;     // X
      positions[idx + 1] = (Math.random() - 0.5) * 10; // Y
      positions[idx + 2] = (Math.random() - 0.5) * 4;  // Z
      randomSpeed[i] = Math.random() * 0.2 + 0.05;     // Individual vertical speed
    }

    return { positions, randomSpeed, count };
  }, [isMobile]);

  // Generate white glowing bokeh positions
  const bokehData = useMemo(() => {
    const count = isMobile ? 25 : 75;
    const positions = new Float32Array(count * 3);
    const randomSpeed = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 8;      // X
      positions[idx + 1] = (Math.random() - 0.5) * 8;  // Y
      positions[idx + 2] = (Math.random() - 0.5) * 3;  // Z
      randomSpeed[i] = Math.random() * 0.15 + 0.02;    // Slower speed for bigger bokeh
    }

    return { positions, randomSpeed, count };
  }, [isMobile]);

  // Generate textures
  const bokehTexture = useMemo(() => createBokehTexture(), []);

  // Frame Loop (optimized requestAnimationFrame wrapper via R3F)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Soft Sine Floating movement & mouse parallax on Orange Dust
    if (dustRef.current) {
      const p = dustRef.current.geometry.attributes.position;
      if (p) {
        const positions = p.array as Float32Array;
        for (let i = 0; i < dustData.count; i++) {
          const idx = i * 3;
          positions[idx + 1] += dustData.randomSpeed[i] * 0.003;
          positions[idx] += Math.sin(time * 0.5 + i) * 0.001;

          if (positions[idx + 1] > 5) {
            positions[idx + 1] = -5;
          }
        }
        p.needsUpdate = true;
      }

      // Parallax mouse drag
      const targetX = mouseRef.current.x * 0.4;
      const targetY = mouseRef.current.y * 0.4;
      dustRef.current.position.x += (targetX - dustRef.current.position.x) * 0.02;
      dustRef.current.position.y += (targetY - dustRef.current.position.y) * 0.02;
    }

    // 2. Dreamy floating movements for White Bokeh
    if (bokehRef.current) {
      const p = bokehRef.current.geometry.attributes.position;
      if (p) {
        const positions = p.array as Float32Array;
        for (let i = 0; i < bokehData.count; i++) {
          const idx = i * 3;
          positions[idx + 1] += bokehData.randomSpeed[i] * 0.002;
          positions[idx] += Math.cos(time * 0.3 + i) * 0.0015;

          if (positions[idx + 1] > 4) {
            positions[idx + 1] = -4;
          }
        }
        p.needsUpdate = true;
      }

      const targetX = mouseRef.current.x * 0.7;
      const targetY = mouseRef.current.y * 0.7;
      bokehRef.current.position.x += (targetX - bokehRef.current.position.x) * 0.015;
      bokehRef.current.position.y += (targetY - bokehRef.current.position.y) * 0.015;
    }

    // 3. Central Morphing mesh rotations
    if (centralMeshRef.current) {
      centralMeshRef.current.rotation.y = time * 0.08;
      centralMeshRef.current.rotation.z = time * 0.05;
      const breatheScale = 1 + Math.sin(time * 0.8) * 0.04;
      centralMeshRef.current.scale.set(breatheScale, breatheScale, breatheScale);
    }
  });

  // Clean WebGL resources (textures, geometries, materials) when unmounting to prevent memory leaks
  useEffect(() => {
    const currentDust = dustRef.current;
    const currentBokeh = bokehRef.current;
    const currentCentral = centralMeshRef.current;

    return () => {
      if (bokehTexture) bokehTexture.dispose();
      
      if (currentDust) {
        currentDust.geometry.dispose();
        if (Array.isArray(currentDust.material)) {
          currentDust.material.forEach((m) => m.dispose());
        } else {
          currentDust.material.dispose();
        }
      }
      if (currentBokeh) {
        currentBokeh.geometry.dispose();
        if (Array.isArray(currentBokeh.material)) {
          currentBokeh.material.forEach((m) => m.dispose());
        } else {
          currentBokeh.material.dispose();
        }
      }
      if (currentCentral) {
        currentCentral.geometry.dispose();
        if (Array.isArray(currentCentral.material)) {
          currentCentral.material.forEach((m) => m.dispose());
        } else {
          currentCentral.material.dispose();
        }
      }
    };
  }, [bokehTexture]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1.5} color="#c5a880" />
      <pointLight position={[-4, -4, 2]} intensity={1.0} color="#3b82f6" />

      {/* Central Abstract Premium Frame Core */}
      {!isMobile && (
        <mesh ref={centralMeshRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.6, 1]} />
          <meshStandardMaterial
            color="#08080a"
            roughness={0.15}
            metalness={0.9}
            wireframe={true}
            transparent={true}
            opacity={0.15}
          />
        </mesh>
      )}

      {/* 1. Warm Orange Dust Points */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.035 : 0.05}
          color="#c5a880"
          transparent={true}
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={bokehTexture}
        />
      </points>

      {/* 2. White Glowing Bokeh Points */}
      <points ref={bokehRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bokehData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.18 : 0.32}
          color="#fbf5eb"
          transparent={true}
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={bokehTexture}
        />
      </points>
    </>
  );
};
export default Scene;
