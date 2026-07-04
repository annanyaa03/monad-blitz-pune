"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AIReasoning from "./dashboard/AIReasoning";
import TradingChart from "./dashboard/TradingChart";
import MonadTradingChart from "./dashboard/MonadTradingChart";
import KillSwitch from "./dashboard/KillSwitch";
import Portfolio from "./dashboard/Portfolio";
import OracleWidget from "./dashboard/OracleWidget";
import ManualTrading from "./dashboard/ManualTrading";
import TradingModeSelection from "./dashboard/TradingModeSelection";
import { Shield, Zap, ArrowRight, Bot, UserCheck, Layers } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSession } from "next-auth/react";

import { useDashboardState } from "@/hooks/useDashboardState";

export default function DashboardPreview() {
  const { data: state, isLoading } = useDashboardState();
  const { data: session } = useSession();
  const [tradingMode, setTradingMode] = useState<"selection" | "copilot" | "autopilot">("selection");

  return (
    <section id="dashboard" className="w-full min-h-screen pt-32 pb-24 px-8 relative z-10 bg-background">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 border-b border-border pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">Intelligence at Work.</h2>
            <p className="text-muted mt-2 text-base max-w-xl font-light">
              Real-time agent reasoning, market data, and risk execution on Monad Testnet.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {session && (
              <div className="hidden md:flex items-center gap-3 mr-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={session.user?.image || "https://ui-avatars.com/api/?name=" + session.user?.name} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border border-border" 
                />
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#836EF9]/5 text-[#836EF9] rounded-full text-xs font-medium border border-[#836EF9]/20">
                <div className="w-1.5 h-1.5 bg-[#836EF9] rounded-full animate-pulse" />
                Syncing Data
              </div>
            )}
            
            <div className="scale-90 origin-right">
              <ConnectButton showBalance={false} />
            </div>
          </div>
        </motion.div>

        {/* Operating Mode Switcher Pill Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 bg-card p-1.5 rounded-2xl border border-border/60 shadow-sm flex-wrap">
            <button
              onClick={() => setTradingMode("selection")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                tradingMode === "selection"
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>⚡ Mode Selection</span>
            </button>
            <button
              onClick={() => setTradingMode("copilot")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                tradingMode === "copilot"
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 md:hidden" />
              <span>🛡️ AI Copilot</span>
              <span className="hidden md:inline-block text-[10px] font-mono opacity-80 px-1.5 py-0.5 rounded bg-white/20">Manual</span>
            </button>
            <button
              onClick={() => setTradingMode("autopilot")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                tradingMode === "autopilot"
                  ? "bg-[#836EF9] text-white shadow-md shadow-[#836EF9]/20"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#836EF9] md:hidden" />
              <span>🤖 AI Autopilot</span>
              <span className="hidden md:inline-block text-[10px] font-mono opacity-80 px-1.5 py-0.5 rounded bg-white/20">Autonomous</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs text-muted font-mono bg-card/40 px-4 py-2 rounded-xl border border-border/40">
            <span className="flex items-center gap-1.5">
              <Layers size={13} className="text-[#836EF9]" />
              <span>SHARED INFRA:</span>
            </span>
            <span className="text-green-500 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Monad Testnet
            </span>
          </div>
        </div>

        {/* HERO SECTION: Trading Mode Selection */}
        <AnimatePresence mode="wait">
          {tradingMode === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <TradingModeSelection 
                onSelectMode={(mode) => setTradingMode(mode)} 
                currentMode={tradingMode} 
              />
            </motion.div>
          )}

          {tradingMode === "copilot" && (
            <motion.div
              key="copilot"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* AI Copilot Workspace Banner */}
              <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-blue-500/5">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0 shadow-inner">
                    <UserCheck size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl md:text-2xl font-light tracking-tight text-foreground">Manual Trading Workspace</h3>
                      <span className="text-xs font-mono bg-blue-500 text-white px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1.5">
                        <Shield size={12} /> AI Copilot Active
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-muted/90 mt-1.5 font-light max-w-2xl leading-relaxed">
                      You stay in full control. AI reasoning provides real-time position sizing, confidence scores, and risk assessment before your approval.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
                  <button
                    onClick={() => setTradingMode("autopilot")}
                    className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:border-[#836EF9]/50 text-xs font-medium text-muted hover:text-foreground transition-all flex items-center gap-2 shadow-sm group cursor-pointer"
                  >
                    <span>Switch to Autopilot</span>
                    <ArrowRight size={14} className="text-[#836EF9] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {tradingMode === "autopilot" && (
            <motion.div
              key="autopilot"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* AI Autopilot Workspace Banner */}
              <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#836EF9]/10 via-purple-500/5 to-transparent border border-[#836EF9]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-[#836EF9]/5">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#836EF9]/10 border border-[#836EF9]/30 flex items-center justify-center text-[#836EF9] shrink-0 shadow-inner">
                    <Bot size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl md:text-2xl font-light tracking-tight text-foreground">Autonomous Trading Workspace</h3>
                      <span className="text-xs font-mono bg-[#836EF9] text-white px-3 py-1 rounded-full font-medium shadow-sm flex items-center gap-1.5">
                        <Zap size={12} className="fill-white" /> AI Autopilot Active
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-muted/90 mt-1.5 font-light max-w-2xl leading-relaxed">
                      Autonomous execution engine enabled. AI monitors Monad markets 24/7, selects strategies, and executes trades within your daily risk limits.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
                  <button
                    onClick={() => setTradingMode("copilot")}
                    className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:border-blue-500/50 text-xs font-medium text-muted hover:text-foreground transition-all flex items-center gap-2 shadow-sm group cursor-pointer"
                  >
                    <span>Switch to Copilot</span>
                    <ArrowRight size={14} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shared Workspace Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (Charts & AI) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* If in Autopilot mode, prioritize AI Reasoning at the top! */}
            {tradingMode === "autopilot" && (
              <div className="bg-foreground h-auto min-h-[300px] rounded-2xl overflow-hidden shadow-xl border border-border/20">
                <AIReasoning state={state} />
              </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-4 border border-border h-[450px] rounded-2xl shadow-sm overflow-hidden">
                <TradingChart state={state} />
              </div>
              <div className="bg-card p-4 border border-border h-[450px] rounded-2xl shadow-sm overflow-hidden">
                <MonadTradingChart />
              </div>
            </div>

            {/* If in Selection or Copilot mode, AI Reasoning is here */}
            {tradingMode !== "autopilot" && (
              <div className="bg-foreground h-auto min-h-[300px] rounded-2xl overflow-hidden shadow-xl border border-border/20">
                <AIReasoning state={state} />
              </div>
            )}

            {/* Oracle Panel */}
            <div className="bg-card p-6 border border-border rounded-2xl shadow-sm">
              <OracleWidget state={state} />
            </div>
            
          </div>

          {/* Right Column (Controls, Portfolio, Risk) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Portfolio Status (Always shared!) */}
            <div className="bg-card p-8 border border-border rounded-2xl shadow-sm">
              <Portfolio state={state} />
            </div>

            {/* If in Autopilot mode, prioritize Risk Control (KillSwitch) over Manual Trading */}
            {tradingMode === "autopilot" ? (
              <>
                <div className="bg-card p-6 border border-[#836EF9]/30 rounded-2xl shadow-md bg-gradient-to-br from-card to-[#836EF9]/[0.02] flex-1">
                  <KillSwitch state={state} />
                </div>
                <div className="bg-card p-6 border border-border rounded-2xl shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                  <ManualTrading state={state} />
                </div>
              </>
            ) : (
              <>
                <div className="bg-card p-6 border border-blue-500/30 rounded-2xl shadow-md bg-gradient-to-br from-card to-blue-500/[0.02]">
                  <ManualTrading state={state} />
                </div>
                <div className="bg-card p-6 border border-border rounded-2xl shadow-sm flex-1">
                  <KillSwitch state={state} />
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
