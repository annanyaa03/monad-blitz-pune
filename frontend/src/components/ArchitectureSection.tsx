"use client";

import { motion } from "framer-motion";
import { Server, Activity, ShieldCheck, Database } from "lucide-react";

const architectureNodes = [
  { id: 1, title: "Pyth Oracle", icon: <Activity size={24} />, description: "Live price feeds" },
  { id: 2, title: "Decision Engine", icon: <Server size={24} />, description: "Python backend" },
  { id: 3, title: "KillSwitch", icon: <ShieldCheck size={24} />, description: "On-chain safety" },
  { id: 4, title: "Monad Blockchain", icon: <Database size={24} />, description: "Fast execution" },
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="w-full py-32 px-6 bg-card border-t border-border">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">The Architecture.</h2>
          <p className="text-muted mt-6 text-lg max-w-2xl mx-auto font-light">
            A secure, high-performance trading pipeline connecting off-chain AI reasoning with on-chain execution on the Monad testnet.
          </p>
        </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-border/50 transform -translate-y-1/2 overflow-hidden rounded-full">
              <motion.div 
                className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#836EF9] to-transparent"
                animate={{ x: ["-100%", "400%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {architectureNodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center relative bg-transparent z-10"
                >
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      boxShadow: [
                        "0px 0px 0px rgba(131,110,249,0)",
                        "0px 0px 20px rgba(131,110,249,0.4)",
                        "0px 0px 0px rgba(131,110,249,0)"
                      ],
                      borderColor: [
                        "var(--border)",
                        "#836EF9",
                        "var(--border)"
                      ]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.4
                    }}
                    whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 rounded-2xl bg-background border flex items-center justify-center mb-6 text-foreground shadow-sm hover:text-[#836EF9] transition-all duration-300 cursor-pointer"
                  >
                    {node.icon}
                  </motion.div>
                  <motion.h4 
                    className="font-semibold text-lg mb-2"
                    whileHover={{ scale: 1.05, color: "#836EF9" }}
                  >
                    {node.title}
                  </motion.h4>
                  <p className="text-sm text-muted">{node.description}</p>
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
