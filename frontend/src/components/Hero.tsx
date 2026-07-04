"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Build the Monad logo canvas texture once
function buildCoinTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Purple background circle
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#836EF9";
  ctx.fill();

  // Draw rounded square helper
  const drawRoundedSquare = (cx: number, cy: number, w: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(cx - w / 2 + r, cy - w / 2);
    ctx.lineTo(cx + w / 2 - r, cy - w / 2);
    ctx.quadraticCurveTo(cx + w / 2, cy - w / 2, cx + w / 2, cy - w / 2 + r);
    ctx.lineTo(cx + w / 2, cy + w / 2 - r);
    ctx.quadraticCurveTo(cx + w / 2, cy + w / 2, cx + w / 2 - r, cy + w / 2);
    ctx.lineTo(cx - w / 2 + r, cy + w / 2);
    ctx.quadraticCurveTo(cx - w / 2, cy + w / 2, cx - w / 2, cy + w / 2 - r);
    ctx.lineTo(cx - w / 2, cy - w / 2 + r);
    ctx.quadraticCurveTo(cx - w / 2, cy - w / 2, cx - w / 2 + r, cy - w / 2);
    ctx.closePath();
  };

  // Rotate 45° (diamond orientation) for the logo
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(Math.PI / 4);
  ctx.translate(-size / 2, -size / 2);

  // White outer ring
  drawRoundedSquare(size / 2, size / 2, 320, 85);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // Purple inner cutout (creates the ring/donut look)
  drawRoundedSquare(size / 2, size / 2, 200, 58);
  ctx.fillStyle = "#836EF9";
  ctx.fill();

  ctx.restore();

  return new THREE.CanvasTexture(canvas);
}

function ParticleField({ mouseX, mouseY }: { mouseX: React.MutableRefObject<number>; mouseY: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      // Drift slowly
      ref.current.rotation.x -= delta / 80;
      ref.current.rotation.y -= delta / 100;
      // Nudge toward mouse
      ref.current.rotation.y += mouseX.current * delta * 0.03;
      ref.current.rotation.x -= mouseY.current * delta * 0.03;
    }
  });

  return (
    <group ref={ref}>
      <Sparkles 
        count={800} 
        scale={[25, 25, 15]} 
        size={6} 
        speed={0.05} 
        noise={0.2}
        opacity={0.8} 
        color="#836EF9" 
      />
    </group>
  );
}

function MonadCoin({ mouseX, mouseY }: { mouseX: React.MutableRefObject<number>; mouseY: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetTilt = useRef({ x: 0, y: 0 });
  const autoSpin = useRef(0);
  const flickVelocity = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragSpinStart = useRef(0);

  const texture = useMemo(() => buildCoinTexture(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth tilt toward mouse
    targetTilt.current.x += (mouseY.current * 0.35 - targetTilt.current.x) * 0.06;
    targetTilt.current.y += (mouseX.current * 0.35 - targetTilt.current.y) * 0.06;

    // Auto spin continuously
    autoSpin.current += delta * 1.5;

    groupRef.current.rotation.y = autoSpin.current;
    groupRef.current.rotation.x = targetTilt.current.x * 0.3;
    groupRef.current.rotation.z = 0;

    // Floating bob and responsive X position
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.85) * 0.18;
    const targetX = window.innerWidth >= 768 ? 1.4 : 0;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.08;

    // Breath-scale
    const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 1.2) * 0.015;
    groupRef.current.scale.setScalar(pulse);
  });

  return (
    <group
      ref={groupRef}
      // @ts-ignore
      onPointerDown={(e: any) => {
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragSpinStart.current = autoSpin.current;
      }}
      // @ts-ignore
      onPointerMove={(e: any) => {
        mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY.current = -(e.clientY / window.innerHeight - 0.5) * 2;
        if (isDragging.current) {
          const dx = (e.clientX - dragStartX.current) / window.innerWidth * Math.PI * 4;
          autoSpin.current = dragSpinStart.current + dx;
        }
      }}
      // @ts-ignore
      onPointerUp={(e: any) => {
        if (isDragging.current) {
          flickVelocity.current = (e.clientX - dragStartX.current) / window.innerWidth * 5;
          isDragging.current = false;
        }
      }}
      // @ts-ignore
      onClick={() => { flickVelocity.current = 3; }}
    >
      {/* Coin body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.14, 128]} />
        <meshStandardMaterial color="#6d55e8" roughness={0.12} metalness={0.7} />
      </mesh>

      {/* Front face */}
      <mesh position={[0, 0, 0.072]}>
        <circleGeometry args={[1.4, 128]} />
        <meshStandardMaterial map={texture} roughness={0.08} metalness={0.25} />
      </mesh>

      {/* Back face */}
      <mesh position={[0, 0, -0.072]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[1.4, 128]} />
        <meshStandardMaterial map={texture} roughness={0.08} metalness={0.25} />
      </mesh>

      {/* Glow halo */}
      <mesh position={[0, 0, -0.5]}>
        <circleGeometry args={[2.1, 64]} />
        <meshBasicMaterial color="#836EF9" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export default function Hero() {
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const [clicked, setClicked] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY.current = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex items-center overflow-hidden pt-20 pb-12"
      onMouseMove={handleMouseMove}
    >
      {/* Radial gradient that tracks mouse */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          background: "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), #836EF920, transparent 60%)",
        }}
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 48 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 4]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-6, -4, -4]} intensity={1.8} color="#836EF9" />
          <pointLight position={[0, 3, 4]} intensity={1.5} color="#c4b5fd" />
          <pointLight position={[2, -2, 2]} intensity={0.8} color="#ffffff" />

          <MonadCoin mouseX={mouseX} mouseY={mouseY} />
          <ParticleField mouseX={mouseX} mouseY={mouseY} />
        </Canvas>
      </div>

      {/* Hint text for interactivity */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 right-8 z-10 text-xs text-[#836EF9] tracking-widest uppercase hidden md:block"
      >
        drag or click the coin ↗
      </motion.p>

      {/* Text content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 w-full flex flex-col md:flex-row items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col gap-8 md:w-1/2 pointer-events-auto xl:-ml-12 lg:-ml-8 md:-ml-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#836EF9]/10 border border-[#836EF9]/20 w-fit"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#836EF9] animate-pulse" />
            <span className="text-xs font-medium text-[#836EF9] uppercase tracking-wider">Monad Testnet Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-6xl md:text-[5.5rem] font-medium tracking-[-0.03em] leading-[1.05] text-foreground"
          >
            Autonomous AI<br />Trading.{" "}
            <span className="text-[#836EF9]">Built on Monad.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg md:text-xl text-muted max-w-[480px] font-normal leading-relaxed"
          >
            An advanced AI-powered trading agent utilizing MiniMax reasoning, Pyth Oracles, and hardcoded risk management to execute trades securely on-chain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium text-sm transition-all flex items-center gap-2 hover:scale-[1.03] hover:shadow-lg hover:shadow-foreground/20"
            >
              Launch Dashboard <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
