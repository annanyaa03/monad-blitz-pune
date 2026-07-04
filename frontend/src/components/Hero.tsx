"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import Link from "next/link";

function MonadCoin() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [spinVelocity, setSpinVelocity] = useState(0);
  const previousX = useRef(0);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    
    const t = state.clock.getElapsedTime();
    
    // Auto-spin (1.5 rad/s) + flick velocity
    if (!isDragging) {
      meshRef.current.rotation.y += 1.5 * state.clock.getDelta() + spinVelocity;
      // Damping the flick velocity
      setSpinVelocity((v) => v * 0.95);
    }

    // Breath-scale pulse ±1.5%
    const scale = 1 + Math.sin(t * 2) * 0.015;
    meshRef.current.scale.set(scale, scale, scale);
    glowRef.current.scale.set(scale * 1.2, scale * 1.2, scale * 1.2);

    // Mouse-tilt via lerp
    if (!isDragging) {
      targetRotation.current.x = (state.pointer.y * Math.PI) / 6;
      targetRotation.current.y = (state.pointer.x * Math.PI) / 6;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotation.current.x,
        0.1
      );
      // We don't lerp Y completely because of the auto-spin, we just add a slight offset if needed
      // but auto-spin is on Y. Let's just lerp X for tilt.
    }
    
    glowRef.current.position.copy(meshRef.current.position);
    glowRef.current.rotation.copy(meshRef.current.rotation);
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    previousX.current = e.clientX;
  };

  const handlePointerMove = (e: any) => {
    if (isDragging && meshRef.current) {
      const deltaX = e.clientX - previousX.current;
      meshRef.current.rotation.y += deltaX * 0.01;
      setSpinVelocity(deltaX * 0.002);
      previousX.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      {/* Glow Halo */}
      <mesh ref={glowRef}>
        <cylinderGeometry args={[1.6, 1.6, 0.1, 64]} />
        <meshBasicMaterial color="#836EF9" transparent opacity={0.2} />
      </mesh>
      
      {/* Coin */}
      <mesh 
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[1.5, 1.5, 0.2, 64]} />
        <meshStandardMaterial 
          color="#836EF9" 
          metalness={0.7} 
          roughness={0.2} 
        />
      </mesh>
    </Float>
  );
}

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-background">
      {/* Radial gradient tracking mouse */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(131, 110, 249, 0.15), transparent 80%)`
        }}
      />

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#836EF9" />
          <pointLight position={[0, 5, 5]} intensity={1} color="#836EF9" />
          <pointLight position={[5, -5, 5]} intensity={0.8} color="#ffffff" />
          
          <group position={[3, 0, 0]}>
            <MonadCoin />
          </group>
          
          <Sparkles count={800} scale={12} size={1.5} speed={0.4} opacity={0.6} color="#836EF9" />
          <Environment preset="city" />
        </Canvas>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
          <div className="flex flex-col gap-6 pt-20 md:pt-0 pointer-events-auto">
            
            {/* Live Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 bg-muted/10 w-fit px-3 py-1.5 rounded-full border border-border"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-muted">Monad Testnet Live</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] text-foreground"
            >
              Autonomous AI Trading.<br />
              <span className="text-accent">Built on Monad.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-lg md:text-xl text-muted max-w-lg font-light leading-relaxed"
            >
              An advanced AI-powered trading agent utilizing MiniMax reasoning, Pyth Oracles, and hardcoded risk management to execute trades securely on-chain.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-4"
            >
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto px-8 py-3.5 bg-foreground text-background rounded-full font-medium hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Launch Dashboard <span>→</span>
              </Link>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-border text-foreground rounded-full font-medium hover:bg-muted/10 transition-colors flex items-center justify-center"
              >
                View GitHub
              </a>
            </motion.div>
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-end h-full pb-20 pointer-events-none">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="text-muted text-sm font-medium ml-24"
            >
              drag or click the coin ↗
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
