import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";
import { ShieldCheck, Cpu, Zap, Lock } from "lucide-react";

export const PaymentGateways = () => {
  const methods = [
    { name: "Visa", src: "/visa.png", alt: "Visa Card" },
    { name: "Mastercard", src: "/mastercard.jpg", alt: "Mastercard" },
    { name: "UPI", src: "/upi.png", alt: "UPI (Unified Payments Interface)" }
  ];

  const trustBadges = [
    { 
      icon: <Lock className="w-4 h-4 text-emerald-400" />, 
      title: "Secure Clearing", 
      desc: "Direct cryptographic settlement" 
    },
    { 
      icon: <Cpu className="w-4 h-4 text-cyan-400" />, 
      title: "Direct Ingress", 
      desc: "Low-latency server routing" 
    },
    { 
      icon: <Zap className="w-4 h-4 text-amber-400" />, 
      title: "Real-time Settlement", 
      desc: "Zero-slippage account funding" 
    }
  ];

  return (
    <section className="py-20 bg-[#020304] border-t border-white/5 relative overflow-hidden">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-emerald-500/[0.015] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/[0.01] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-12 max-w-5xl mx-auto p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-[#0c0f13]/90 to-[#05070a]/95 border border-white/5 shadow-2xl relative backdrop-blur-xl"
        >
          {/* Inner border glow highlight */}
          <div className="absolute inset-0 rounded-[2.5rem] border border-emerald-500/10 pointer-events-none mask-image-gradient" />

          {/* Top Section: Header & Compact Logos */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Direct institutional message */}
            <motion.div variants={itemVariants} className="text-center lg:text-left space-y-3 max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.25em] w-fit">
                Secured Settlement Ingress
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider italic leading-none">
                We Accept Payments Via:
              </h3>
              <p className="text-[11px] sm:text-xs text-white/40 font-medium leading-relaxed">
                Direct institutional clearing channels. Funds are synchronized directly into your secure execution dashboard with maximum speed and zero intermediate friction.
              </p>
            </motion.div>

            {/* Compact Payment Method Logos with glowing micro-animations */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 select-none"
            >
              {methods.map((method) => (
                <div 
                  key={method.name}
                  className="px-6 py-4 rounded-2xl bg-white/[0.01] border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition-all duration-500 flex items-center justify-center shadow-2xl hover:scale-105 shrink-0 group relative overflow-hidden"
                >
                  {/* Subtle hover background highlight */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <img 
                    src={method.src} 
                    alt={method.alt} 
                    className="h-6 sm:h-7 w-auto object-contain transition-all duration-300 rounded grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Bottom Section: Institutional Security Trust Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {trustBadges.map((badge, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#090b0e]/50 border border-white/[0.03] hover:border-white/10 transition-all duration-500 flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0">
                  {badge.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-white/35 font-bold uppercase tracking-widest font-sans">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
