"use client";

import { motion } from "framer-motion";
import { Brain, Cpu, Shield, Zap, LineChart, Lock } from "lucide-react";

export default function LandingContent() {
  return (
    <div className="w-full relative z-10 bg-[#FAFAFA]">
      
      {/* Features Section */}
      <section className="py-24 px-6 border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-medium tracking-tight mb-4">Enterprise Grade Trading.</h2>
            <p className="text-lg text-[#6B7280] max-w-xl">Built on the Monad blockchain for extreme performance, utilizing Pyth Oracles for precise data and MiniMax AI for robust decision making.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: "10k TPS Execution", desc: "Harness the power of Monad's parallel execution to never miss a trade." },
              { icon: Brain, title: "MiniMax Reasoning", desc: "Advanced AI models constantly evaluate market conditions in real-time." },
              { icon: Shield, title: "Hardcoded Risk Limits", desc: "KillSwitch smart contracts enforce maximum loss and daily trading caps." },
              { icon: LineChart, title: "Predictive Analytics", desc: "Moving average crossovers (EMA) combined with sentiment analysis." },
              { icon: Zap, title: "Sub-second Oracles", desc: "Integrated directly with Pyth network for high-fidelity tick data." },
              { icon: Lock, title: "Non-Custodial", desc: "Connect via MetaMask or WalletConnect. Your keys, your crypto." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-3xl border border-[#E5E7EB] hover:shadow-md transition-shadow"
              >
                <feature.icon size={24} className="text-[#836EF9] mb-4" />
                <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works & AI Workflow */}
      <section className="py-32 px-6 bg-[#111111] text-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-medium tracking-tight mb-6">Transparent AI Workflow.</h2>
            <p className="text-[#9CA3AF] text-lg mb-8 leading-relaxed">Unlike black-box AI tools, our agent exposes its entire thought process. You can view the real-time reasoning logs, confidence metrics, and technical indicators before every trade.</p>
            
            <div className="space-y-6">
              {[
                "Fetch live market data via Pyth Oracles",
                "Analyze technical indicators (9-EMA, 21-EMA)",
                "Evaluate market sentiment via MiniMax AI",
                "Validate constraints against KillSwitch Contract",
                "Execute secure transaction on Monad"
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#836EF9]/20 flex items-center justify-center text-[#836EF9] font-semibold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-[#E5E7EB] font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#836EF9]/20 to-transparent blur-3xl rounded-full" />
            <div className="bg-[#1A1A1A] border border-[#333] rounded-3xl p-8 relative z-10 font-mono text-sm shadow-2xl">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              </div>
              <p className="text-[#10B981] mb-2">$ Agent initialized</p>
              <p className="text-[#6B7280] mb-2">&gt; Loading state from shared_state.json...</p>
              <p className="text-[#6B7280] mb-2">&gt; Connecting to Pyth Oracle...</p>
              <p className="text-[#3B82F6] mb-2">&gt; Data feed verified. Price: $2.45</p>
              <p className="text-[#E5E7EB] mb-4">&gt; Checking conditions: 9-EMA &gt; 21-EMA</p>
              <div className="bg-[#111111] border border-[#333] p-4 rounded-xl mt-4">
                <p className="text-[#836EF9] font-bold">EXECUTE_BUY (Confidence: 89%)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 px-6 border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-3xl font-medium tracking-tight mb-12">Powered by the Best</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            {/* Logos represented by text for simplicity, in a real app these would be SVG logos */}
            <span className="text-2xl font-bold tracking-tighter">MONAD</span>
            <span className="text-2xl font-bold tracking-tighter flex items-center gap-2"><Zap size={24}/> Pyth</span>
            <span className="text-2xl font-bold tracking-tighter">MiniMax</span>
            <span className="text-2xl font-bold tracking-tighter">Stripe</span>
            <span className="text-2xl font-bold tracking-tighter">Next.js</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-3xl font-medium tracking-tight mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Do I have to deposit funds to use the platform?", a: "No, you can connect your Web3 wallet and trade directly from your own custody using our smart contracts." },
              { q: "How does the AI make decisions?", a: "It uses a combination of hardcoded technical indicators (like EMA crossovers) and MiniMax LLM reasoning to evaluate market sentiment." },
              { q: "What is the KillSwitch?", a: "The KillSwitch is a smart contract that enforces maximum daily trading limits and cooldown periods. Even if the AI malfunctions, it cannot exceed these limits." },
              { q: "Which networks are supported?", a: "We are currently deployed exclusively on the Monad Testnet." },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#E5E7EB]">
                <h4 className="font-semibold text-lg mb-2">{faq.q}</h4>
                <p className="text-[#6B7280]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
