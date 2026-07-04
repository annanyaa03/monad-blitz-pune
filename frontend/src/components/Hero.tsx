"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color="#836EF9"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <AnimatedSphere />
          <Environment preset="city" />
        </Canvas>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9]">
            Autonomous<br />Trading.<br />
            <span className="text-[#836EF9]">Built for Monad.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6B7280] max-w-md mt-4 font-light">
            An advanced AI-powered trading agent that uses MiniMax reasoning, Pyth Oracles, and hardcoded risk management to execute trades securely on-chain.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
