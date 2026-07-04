"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { Brain, Cpu, Shield, Zap, LineChart, Lock, ChevronDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// Animated counter hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
        <span ref={ref}>{count.toLocaleString()}</span>{suffix}
      </p>
      <p className="text-sm text-muted mt-2 uppercase tracking-widest">{label}</p>
    </div>
  );
}

const features = [
  { icon: Cpu,       title: "10k TPS Execution",     desc: "Harness the power of Monad's parallel execution to never miss a trade." },
  { icon: Brain,     title: "MiniMax Reasoning",      desc: "Advanced AI models constantly evaluate market conditions in real-time." },
  { icon: Shield,    title: "Hardcoded Risk Limits",  desc: "KillSwitch smart contracts enforce maximum loss and daily trading caps." },
  { icon: LineChart, title: "Predictive Analytics",   desc: "Moving average crossovers (EMA) combined with sentiment analysis." },
  { icon: Zap,       title: "Sub-second Oracles",     desc: "Integrated directly with Pyth network for high-fidelity tick data." },
  { icon: Lock,      title: "Non-Custodial",           desc: "Connect via MetaMask or WalletConnect. Your keys, your crypto." },
];

const steps = [
  "Fetch live market data via Pyth Oracles",
  "Analyze technical indicators (9-EMA, 21-EMA)",
  "Evaluate market sentiment via MiniMax AI",
  "Validate constraints against KillSwitch Contract",
  "Execute secure transaction on Monad",
];

const faqs = [
  { q: "Do I have to deposit funds to use the platform?", a: "No, you can connect your Web3 wallet and trade directly from your own custody using our smart contracts. Alternatively, fund an internal account via Stripe." },
  { q: "How does the AI make decisions?", a: "It uses a combination of hardcoded technical indicators (like EMA crossovers) and MiniMax LLM reasoning to evaluate market sentiment in real-time." },
  { q: "What is the KillSwitch?", a: "The KillSwitch is a smart contract that enforces maximum daily trading limits and cooldown periods. Even if the AI malfunctions, it cannot exceed these predefined limits." },
  { q: "Which networks are supported?", a: "We are currently deployed exclusively on the Monad Testnet for high-frequency, low-latency trading." },
];

const techStack = ["MONAD", "Pyth", "MiniMax", "Stripe", "Next.js", "RainbowKit"];

export default function LandingContent() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const workflowRef = useRef<HTMLDivElement>(null);
  const workflowInView = useInView(workflowRef, { once: true });

  // Auto-advance workflow steps when in view
  useEffect(() => {
    if (!workflowInView) return;
    const timer = setInterval(() => {
      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(timer);
  }, [workflowInView]);

  return (
    <div className="w-full relative z-10 bg-background">

      {/* Stats bar */}
      <section className="py-16 px-8 border-b border-border/60 bg-card">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 items-center">
          <StatCounter value={10000} suffix="+" label="Trades Per Second" />
          <StatCounter value={99} suffix="%" label="Uptime" />
          <StatCounter value={400} suffix="ms" label="Oracle Latency" />
          <StatCounter value={100} suffix="%" label="Non-Custodial" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-8 border-b border-border/50">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-24 md:w-2/3"
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-foreground">Enterprise Grade Trading.</h2>
            <p className="text-xl text-muted font-light leading-relaxed">Built on the Monad blockchain for extreme performance, utilizing Pyth Oracles for precise data and MiniMax AI for robust decision making.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group cursor-default"
              >
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    boxShadow: [
                      "0px 0px 0px rgba(131,110,249,0)",
                      "0px 0px 15px rgba(131,110,249,0.3)",
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
                    delay: i * 0.3
                  }}
                  whileHover={{ scale: 1.15, rotate: [0, -6, 6, 0] }}
                  className="w-12 h-12 rounded-2xl bg-background border flex items-center justify-center text-foreground mb-6 group-hover:text-[#836EF9] group-hover:bg-[#836EF9]/5 transition-colors"
                >
                  <feature.icon size={20} />
                </motion.div>
                <h4 className="font-semibold text-lg mb-3 text-foreground group-hover:text-[#836EF9] transition-colors">{feature.title}</h4>
                <p className="text-base text-muted leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Workflow */}
      <section className="py-32 px-8 bg-foreground text-background overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">Transparent AI Workflow.</h2>
            <p className="text-[#9CA3AF] text-xl mb-12 font-light leading-relaxed">Unlike black-box AI tools, our agent exposes its entire thought process. View real-time reasoning logs, confidence metrics, and technical indicators before every trade.</p>

            <div ref={workflowRef} className="space-y-5">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="flex items-start gap-5 cursor-pointer group"
                  onClick={() => setActiveStep(i)}
                >
                  <motion.div
                    animate={{ backgroundColor: activeStep >= i ? "#836EF9" : "#222222", scale: activeStep === i ? 1.15 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-background shrink-0 border border-[#333]"
                  >
                    {activeStep > i ? "✓" : `0${i + 1}`}
                  </motion.div>
                  <p className={`text-lg font-light transition-colors duration-300 ${activeStep >= i ? "text-background" : "text-[#555]"}`}>{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#836EF9]/20 to-transparent blur-[100px] rounded-full" />
            <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#333] rounded-[2rem] p-10 relative z-10 w-full shadow-2xl">
              <div className="flex gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>

              <div className="space-y-4 font-mono text-sm">
                <motion.p animate={{ opacity: activeStep >= 0 ? 1 : 0.2 }} transition={{ duration: 0.3 }} className="text-muted">
                  Connecting to Pyth Oracle <span className="text-[#10B981]">OK</span>
                </motion.p>
                <motion.p animate={{ opacity: activeStep >= 1 ? 1 : 0.2 }} transition={{ duration: 0.3 }} className="text-muted">
                  9-EMA: <span className="text-background">2.48</span> / 21-EMA: <span className="text-background">2.41</span> <span className="text-[#10B981]">↑ CROSS</span>
                </motion.p>
                <motion.p animate={{ opacity: activeStep >= 2 ? 1 : 0.2 }} transition={{ duration: 0.3 }} className="text-[#836EF9] italic">
                  "Strong bullish momentum. RSI not overbought. Executing long."
                </motion.p>
                <motion.p animate={{ opacity: activeStep >= 3 ? 1 : 0.2 }} transition={{ duration: 0.3 }} className="text-muted">
                  KillSwitch: Daily limit <span className="text-[#10B981]">within bounds</span>
                </motion.p>
                <div className="h-px w-full bg-[#333] my-2" />
                <motion.div
                  animate={{ opacity: activeStep >= 4 ? 1 : 0.2, scale: activeStep >= 4 ? 1 : 0.97 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-between bg-foreground p-4 rounded-xl border border-[#333]"
                >
                  <span className="text-background font-semibold tracking-wide">EXECUTE_BUY</span>
                  <motion.span
                    animate={{ color: activeStep >= 4 ? "#10B981" : "#555" }}
                    className="font-bold"
                  >
                    89% CONFIDENCE
                  </motion.span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack — scrolling marquee */}
      <section id="technology" className="py-20 border-b border-border/50 overflow-hidden">
        <p className="text-center text-xs font-semibold text-[#836EF9] tracking-widest uppercase mb-10">Powered By</p>
        <div className="relative flex gap-20 overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#FAFAFA] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#FAFAFA] to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-20 items-center shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {[...techStack, ...techStack].map((tech, i) => (
              <span key={i} className="text-2xl font-bold tracking-tighter text-foreground opacity-30 hover:opacity-90 transition-opacity whitespace-nowrap cursor-default">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ — accordion */}
      <section className="py-32 px-8">
        <div className="max-w-[760px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-medium tracking-tight mb-16 text-center text-foreground"
          >
            Questions & Answers
          </motion.h2>
          <div className="divide-y divide-[#E5E7EB]">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <h4 className={`font-semibold text-lg transition-colors ${openFaq === i ? "text-[#836EF9]" : "text-foreground group-hover:text-[#836EF9]"}`}>
                    {faq.q}
                  </h4>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={20} className={`shrink-0 ml-4 ${openFaq === i ? "text-[#836EF9]" : "text-muted"}`} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-muted font-light leading-relaxed text-lg">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
