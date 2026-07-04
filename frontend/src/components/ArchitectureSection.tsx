"use client";

import { motion } from "framer-motion";
import { Server, Brain, Activity, ShieldCheck, Database } from "lucide-react";

const architectureNodes = [
  { id: 1, title: "Pyth Oracle", icon: <Activity size={24} />, description: "Live price feeds" },
  { id: 2, title: "MiniMax AI", icon: <Brain size={24} />, description: "Reasoning engine" },
  { id: 3, title: "Decision Engine", icon: <Server size={24} />, description: "Python backend" },
  { id: 4, title: "KillSwitch", icon: <ShieldCheck size={24} />, description: "On-chain safety" },
  { id: 5, title: "Monad Blockchain", icon: <Database size={24} />, description: "Fast execution" },
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="w-full py-32 px-6 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">The Architecture.</h2>
          <p className="text-[#6B7280] mt-6 text-lg max-w-2xl mx-auto font-light">
            A secure, high-performance trading pipeline connecting off-chain AI reasoning with on-chain execution on the Monad testnet.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#836EF9] to-transparent transform -translate-y-1/2 opacity-30" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {architectureNodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center relative bg-white z-10"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center mb-6 text-[#111111] shadow-sm hover:border-[#836EF9] transition-colors duration-300">
                  {node.icon}
                </div>
                <h4 className="font-semibold text-lg mb-2">{node.title}</h4>
                <p className="text-sm text-[#6B7280]">{node.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
