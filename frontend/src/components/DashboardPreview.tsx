"use client";

import { motion } from "framer-motion";
import AIReasoning from "./dashboard/AIReasoning";
import TradingChart from "./dashboard/TradingChart";
import MonadTradingChart from "./dashboard/MonadTradingChart";
import KillSwitch from "./dashboard/KillSwitch";
import Portfolio from "./dashboard/Portfolio";
import OracleWidget from "./dashboard/OracleWidget";
import ManualTrading from "./dashboard/ManualTrading";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSession } from "next-auth/react";

import { useDashboardState } from "@/hooks/useDashboardState";

export default function DashboardPreview() {
  const { data: state, isLoading } = useDashboardState();
  const { data: session } = useSession();

  return (
    <section id="dashboard" className="w-full min-h-screen py-24 px-6 relative z-10 bg-[#FAFAFA]">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Intelligence at Work.</h2>
              <p className="text-[#6B7280] mt-4 text-lg max-w-xl font-light">
                An immersive view into the agent&apos;s thought process, real-time market data, and active risk constraints.
              </p>
            </div>
            <div className="flex items-center gap-4">
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
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
                  />
                </div>
              )}
              {isLoading && (
                <div className="text-sm font-medium text-[#836EF9] animate-pulse">Syncing Secure Data...</div>
              )}
              <div className="scale-90 origin-right">
                <ConnectButton showBalance={false} />
              </div>
              <Link href="/funding" className="bg-[#111111] hover:bg-black text-white px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                <Plus size={18} /> Deposit Funds
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(280px,auto)] gap-6">
          
          {/* ETH/USDC Chart */}
          <div className="md:col-span-4 md:row-span-2 bg-white rounded-3xl border border-[#E5E7EB] p-1 shadow-sm overflow-hidden relative">
            <TradingChart state={state} />
          </div>

          {/* MON/USD Chart */}
          <div className="md:col-span-4 md:row-span-2 bg-white rounded-3xl border border-[#E5E7EB] p-1 shadow-sm overflow-hidden relative">
            <MonadTradingChart />
          </div>

          {/* AI Reasoning - Taller column on the right */}
          <div className="md:col-span-4 md:row-span-2 bg-[#111111] rounded-3xl p-8 shadow-sm flex flex-col relative overflow-hidden">
            <AIReasoning state={state} />
          </div>

          {/* Portfolio summary */}
          <div className="md:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-sm">
            <Portfolio state={state} />
          </div>

          {/* Manual Trading */}
          <div className="md:col-span-4">
            <ManualTrading state={state} />
          </div>



          {/* Risk Control */}
          <div className="md:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-sm">
            <KillSwitch state={state} />
          </div>

          {/* Network / Oracle visualization */}
          <div className="md:col-span-12 bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-sm">
            <OracleWidget state={state} />
          </div>
        </div>
      </div>
    </section>
  );
}
