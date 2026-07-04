"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  Bot, 
  Activity, 
  Lock, 
  Sliders, 
  TrendingUp, 
  CheckCircle2,
  RefreshCw,
  Cpu,
  Eye,
  BarChart3
} from "lucide-react";

interface TradingModeSelectionProps {
  onSelectMode: (mode: "copilot" | "autopilot") => void;
  currentMode?: "selection" | "copilot" | "autopilot";
}

export default function TradingModeSelection({
  onSelectMode,
  currentMode = "selection"
}: TradingModeSelectionProps) {
  const [hoveredMode, setHoveredMode] = useState<"copilot" | "autopilot" | null>(null);

  const copilotCapabilities = [
    { text: "Manual BUY / SELL execution", icon: <UserCheck size={16} className="text-blue-500" /> },
    { text: "AI-powered market analysis", icon: <Sparkles size={16} className="text-blue-500" /> },
    { text: "Confidence score", icon: <BarChart3 size={16} className="text-blue-500" /> },
    { text: "Risk assessment", icon: <Shield size={16} className="text-blue-500" /> },
    { text: "Suggested position size", icon: <Sliders size={16} className="text-blue-500" /> },
    { text: "Stop-loss & take-profit recommendations", icon: <TrendingUp size={16} className="text-blue-500" /> },
    { text: "Human approval required before execution", icon: <Lock size={16} className="text-blue-500" /> },
  ];

  const autopilotCapabilities = [
    { text: "Continuous market monitoring", icon: <Eye size={16} className="text-[#836EF9]" /> },
    { text: "Autonomous BUY / SELL execution", icon: <Bot size={16} className="text-[#836EF9]" /> },
    { text: "Live AI reasoning", icon: <Cpu size={16} className="text-[#836EF9]" /> },
    { text: "Daily Limit protection", icon: <Shield size={16} className="text-[#836EF9]" /> },
    { text: "Portfolio optimization", icon: <Activity size={16} className="text-[#836EF9]" /> },
    { text: "Strategy selection", icon: <Sliders size={16} className="text-[#836EF9]" /> },
    { text: "Real-time decision timeline", icon: <RefreshCw size={16} className="text-[#836EF9]" /> },
  ];

  return (
    <section className="w-full mb-12 relative z-10">
      {/* Editorial Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-border/40 pb-6"
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#836EF9] animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted font-semibold">
            Operating Modes // Monad Engine
          </span>
        </div>
        <div className="max-w-3xl">
          <h3 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
            Select Your Trading Experience
          </h3>
          <p className="text-sm md:text-base text-muted font-light mt-1">
            Choose your desired level of autonomy. Both modes share your active Monad testnet wallet, real-time portfolio balances, and blockchain infrastructure.
          </p>
        </div>
      </motion.div>

      {/* Main 50/50 Split Canvas */}
      <div className="relative rounded-3xl border border-border/60 bg-card/40 dark:bg-[#111318]/60 backdrop-blur-3xl shadow-2xl overflow-hidden transition-all duration-500">
        
        {/* Ambient Gradient Glows based on Hover */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out opacity-0 ${
            hoveredMode === "copilot" ? "opacity-100" : ""
          }`}
          style={{
            background: "radial-gradient(circle at 25% 50%, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.03) 50%, transparent 100%)"
          }}
        />
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out opacity-0 ${
            hoveredMode === "autopilot" ? "opacity-100" : ""
          }`}
          style={{
            background: "radial-gradient(circle at 75% 50%, rgba(131, 110, 249, 0.12) 0%, rgba(168, 85, 247, 0.04) 50%, transparent 100%)"
          }}
        />

        {/* Top Animated Border Highlights */}
        <div className="absolute top-0 left-0 right-0 h-[2px] flex z-30 pointer-events-none">
          <div className={`w-1/2 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent transition-opacity duration-500 ${hoveredMode === "copilot" ? "opacity-100" : "opacity-0"}`} />
          <div className={`w-1/2 h-full bg-gradient-to-l from-[#836EF9] via-fuchsia-500 to-transparent transition-opacity duration-500 ${hoveredMode === "autopilot" ? "opacity-100" : "opacity-0"}`} />
        </div>

        {/* 50/50 Split Layout Container */}
        <div className="flex flex-col lg:flex-row relative items-stretch">
          
          {/* ==========================================
              LEFT SIDE — AI COPILOT
             ========================================== */}
          <motion.div
            onMouseEnter={() => setHoveredMode("copilot")}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => onSelectMode("copilot")}
            className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-between relative group cursor-pointer transition-all duration-500 hover:bg-white/[0.02] dark:hover:bg-white/[0.015]"
          >
            {/* Top Header Badge */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-mono font-medium tracking-wide">
                  <Shield size={13} className="fill-blue-500/20" />
                  <span>HUMAN-IN-THE-LOOP</span>
                </div>
                <span className="text-xs font-mono text-muted/60 tracking-wider">MODE // 01</span>
              </div>

              {/* Headline & Subtitle */}
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 flex items-center gap-3">
                AI Copilot
              </h2>
              <p className="text-base md:text-lg text-muted/90 font-light leading-relaxed mt-4 max-w-lg">
                &ldquo;You stay in control. AI provides intelligent recommendations before every trade.&rdquo;
              </p>

              {/* Key Capabilities List */}
              <div className="mt-8 pt-8 border-t border-border/40">
                <p className="text-[11px] font-mono uppercase tracking-widest text-muted mb-5 font-semibold">
                  Key Capabilities
                </p>
                <ul className="space-y-3.5">
                  {copilotCapabilities.map((cap, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 text-sm md:text-base text-foreground/80 group-hover:text-foreground transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform">
                        {cap.icon}
                      </div>
                      <span className="font-light tracking-wide">{cap.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 pt-8 border-t border-border/40">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode("copilot");
                }}
                className="w-full py-4 px-8 rounded-2xl bg-foreground text-background font-medium text-base tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-black/5 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-500/25 transition-all duration-300 active:scale-[0.99]"
              >
                <span>Launch AI Copilot</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
              <p className="text-xs text-muted/80 font-light text-center mt-3 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                <span>Best for traders who want full control with AI assistance.</span>
              </p>
            </div>
          </motion.div>

          {/* ==========================================
              CENTER DIVIDER (Animated & Glassmorphic)
             ========================================== */}
          <div className="w-full h-auto lg:w-24 lg:h-auto self-stretch py-10 lg:py-0 relative flex items-center justify-center z-20 shrink-0">
            {/* The hairline divider */}
            <div className="absolute inset-x-0 lg:inset-y-0 lg:inset-x-auto lg:w-px h-px lg:h-full bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-border/80 to-transparent" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center justify-center px-5 py-5 bg-card dark:bg-[#151921] backdrop-blur-2xl border border-border/80 rounded-3xl shadow-2xl shadow-black/30 text-center w-52 md:w-60 hover:border-[#836EF9]/60 transition-all duration-300 group/divider"
            >
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-muted group-hover/divider:text-[#836EF9] transition-colors mb-1 font-mono text-sm"
              >
                ↓
              </motion.div>
              
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-foreground font-semibold px-2 py-0.5 leading-tight">
                Choose Your Trading Experience
              </span>
              
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="text-muted group-hover/divider:text-[#836EF9] transition-colors my-1 font-mono text-sm"
              >
                ↓
              </motion.div>
              
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#836EF9] font-medium bg-[#836EF9]/10 px-3 py-1 rounded-full border border-[#836EF9]/20 mt-0.5 group-hover/divider:bg-[#836EF9] group-hover/divider:text-white transition-all">
                Switch Anytime
              </span>
            </motion.div>
          </div>

          {/* ==========================================
              RIGHT SIDE — AI AUTOPILOT
             ========================================== */}
          <motion.div
            onMouseEnter={() => setHoveredMode("autopilot")}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => onSelectMode("autopilot")}
            className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-between relative group cursor-pointer transition-all duration-500 hover:bg-white/[0.02] dark:hover:bg-white/[0.015]"
          >
            {/* Top Header Badge */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#836EF9]/10 border border-[#836EF9]/20 text-[#836EF9] text-xs font-mono font-medium tracking-wide">
                  <Zap size={13} className="fill-[#836EF9]/20" />
                  <span>AUTONOMOUS EXECUTION</span>
                </div>
                <span className="text-xs font-mono text-muted/60 tracking-wider">MODE // 02</span>
              </div>

              {/* Headline & Subtitle */}
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground group-hover:text-[#836EF9] transition-colors duration-300 flex items-center gap-3">
                AI Autopilot
              </h2>
              <p className="text-base md:text-lg text-muted/90 font-light leading-relaxed mt-4 max-w-lg">
                &ldquo;Let your AI monitor markets, analyze opportunities, and execute trades automatically within your configured risk limits.&rdquo;
              </p>

              {/* Key Capabilities List */}
              <div className="mt-8 pt-8 border-t border-border/40">
                <p className="text-[11px] font-mono uppercase tracking-widest text-muted mb-5 font-semibold">
                  Key Capabilities
                </p>
                <ul className="space-y-3.5">
                  {autopilotCapabilities.map((cap, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 text-sm md:text-base text-foreground/80 group-hover:text-foreground transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#836EF9]/10 flex items-center justify-center shrink-0 border border-[#836EF9]/20 group-hover:scale-110 transition-transform">
                        {cap.icon}
                      </div>
                      <span className="font-light tracking-wide">{cap.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 pt-8 border-t border-border/40">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode("autopilot");
                }}
                className="w-full py-4 px-8 rounded-2xl bg-[#836EF9] text-white font-medium text-base tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-[#836EF9]/20 hover:bg-[#725cf0] hover:shadow-[#836EF9]/40 transition-all duration-300 active:scale-[0.99]"
              >
                <span>Launch AI Autopilot</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
              <p className="text-xs text-muted/80 font-light text-center mt-3 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#836EF9] shrink-0" />
                <span>Best for users who want fully autonomous portfolio management.</span>
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Shared Infrastructure Banner */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-card/20 border border-border/40 backdrop-blur-md text-xs text-muted">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-medium text-foreground">Monad Testnet Connected</span>
          <span className="hidden sm:inline">• Shared Portfolio, Wallets & Activity History</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>EXECUTION: <strong className="text-foreground">0.4s Finality</strong></span>
          <span>ORACLE: <strong className="text-foreground">Pyth Live</strong></span>
          <span>RISK ENGINE: <strong className="text-foreground">Active</strong></span>
        </div>
      </div>
    </section>
  );
}
