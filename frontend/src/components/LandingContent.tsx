"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { Brain, Cpu, Shield, Zap, LineChart, Lock, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// --- Number Counter Component ---
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const end = value;
      const stepTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += Math.ceil(end / 30);
        if (start > end) start = end;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, stepTime || 10);
      return () => clearInterval(timer);
    }
  }, [value, isInView]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// --- Features Section ---
const FEATURES = [
  { icon: Cpu, title: "10k TPS Execution", desc: "Harness the power of Monad's parallel execution to never miss a trade." },
  { icon: Brain, title: "MiniMax Reasoning", desc: "Advanced AI models constantly evaluate market conditions in real-time." },
  { icon: Shield, title: "Hardcoded Risk Limits", desc: "KillSwitch smart contracts enforce maximum loss and daily trading caps." },
  { icon: LineChart, title: "Predictive Analytics", desc: "Moving average crossovers (EMA) combined with sentiment analysis." },
  { icon: Zap, title: "Sub-second Oracles", desc: "Integrated directly with Pyth network for high-fidelity tick data." },
  { icon: Lock, title: "Non-Custodial", desc: "Connect via MetaMask or WalletConnect. Your keys, your crypto." },
];

export default function LandingContent() {
  const [activeStep, setActiveStep] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Auto-advance workflow steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full relative z-10 bg-background text-foreground">
      
      {/* Stats Bar */}
      <section className="border-b border-border py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
          {[
            { label: "Transactions/Sec", value: 10000, suffix: "+" },
            { label: "Uptime", value: 99, suffix: "%" },
            { label: "Latency", value: 400, suffix: "ms" },
            { label: "Non-Custodial", value: 100, suffix: "%" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-4">
              <h3 className="text-4xl md:text-5xl font-medium tracking-tight mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-sm text-muted font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-medium tracking-tight mb-4">Enterprise Grade Trading.</h2>
            <p className="text-lg text-muted max-w-xl">Built on the Monad blockchain for extreme performance, utilizing Pyth Oracles for precise data and MiniMax AI for robust decision making.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group p-8 bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300"
              >
                <motion.div
                  className="w-12 h-12 bg-muted/10 rounded-xl flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon size={24} className="text-foreground group-hover:text-accent transition-colors" />
                </motion.div>
                <h4 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">{feature.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Workflow Section */}
      <section className="py-32 px-6 bg-foreground text-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-medium tracking-tight mb-6">Transparent AI Workflow.</h2>
            <p className="text-background/70 text-lg mb-8 leading-relaxed">Unlike black-box AI tools, our agent exposes its entire thought process. You can view the real-time reasoning logs, confidence metrics, and technical indicators before every trade.</p>
            
            <div className="space-y-4">
              {[
                "Fetch live market data via Pyth Oracles",
                "Analyze technical indicators (9-EMA, 21-EMA)",
                "Evaluate market sentiment via MiniMax AI",
                "Validate constraints against KillSwitch Contract",
                "Execute secure transaction on Monad"
              ].map((step, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-xl transition-colors ${activeStep === i ? "bg-background/10" : "hover:bg-background/5"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${activeStep === i ? "bg-accent text-white" : "bg-background/20 text-background"}`}>
                    {i + 1}
                  </div>
                  <p className={`font-medium transition-colors ${activeStep === i ? "text-background" : "text-background/60"}`}>{step}</p>
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent blur-3xl rounded-full" />
            <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 relative z-10 font-mono text-sm shadow-2xl h-[340px] flex flex-col text-left">
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-danger" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-live" />
              </div>
              <div className="flex-1 space-y-3 overflow-hidden text-[#E5E7EB]">
                <AnimatePresence mode="popLayout">
                  {activeStep >= 0 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-live">$ Agent initialized</motion.p>}
                  {activeStep >= 1 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>&gt; Connecting to Pyth Oracle...</motion.p>}
                  {activeStep >= 1 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#3B82F6]">&gt; Data feed verified. Price: $2.45</motion.p>}
                  {activeStep >= 2 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>&gt; Checking conditions: 9-EMA &gt; 21-EMA</motion.p>}
                  {activeStep >= 3 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>&gt; MiniMax Sentiment: BULLISH</motion.p>}
                  {activeStep >= 4 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-black/50 border border-[#333] p-4 rounded-lg mt-4">
                      <p className="text-accent font-bold">EXECUTE_BUY | 89% CONFIDENCE</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-20 border-b border-border overflow-hidden bg-background">
        <div className="relative flex whitespace-nowrap mask-edges">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 items-center opacity-60 text-3xl font-bold tracking-tighter"
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 items-center px-8">
                <span>MONAD</span>
                <span>•</span>
                <span className="flex items-center gap-2"><Zap size={24}/> Pyth</span>
                <span>•</span>
                <span>MiniMax</span>
                <span>•</span>
                <span>Stripe</span>
                <span>•</span>
                <span>Next.js</span>
                <span>•</span>
                <span>RainbowKit</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-medium tracking-tight mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Do I have to deposit funds to use the platform?", a: "No, you can connect your Web3 wallet and trade directly from your own custody using our smart contracts." },
              { q: "How does the AI make decisions?", a: "It uses a combination of hardcoded technical indicators (like EMA crossovers) and MiniMax LLM reasoning to evaluate market sentiment." },
              { q: "What is the KillSwitch?", a: "The KillSwitch is a smart contract that enforces maximum daily trading limits and cooldown periods. Even if the AI malfunctions, it cannot exceed these limits." },
              { q: "Which networks are supported?", a: "We are currently deployed exclusively on the Monad Testnet." },
            ].map((faq, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
                <button 
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between font-semibold text-lg text-left"
                >
                  {faq.q}
                  <motion.div animate={{ rotate: faqOpen === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="text-muted" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-muted"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient Mask styles for Marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        .mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
    </div>
  );
}
