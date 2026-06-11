import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";
import { Wallet } from "lucide-react";
import { USDT_NETWORKS } from "@/config/cryptoAddresses";

export const PaymentGateways = () => {
  const methods = [
    { name: "Visa", src: "/visa.png", alt: "Visa Card" },
    { name: "Mastercard", src: "/mastercard.jpg", alt: "Mastercard" },
    { name: "UPI", src: "/upi.png", alt: "UPI (Unified Payments Interface)" }
  ];

  const cryptoNetworks = USDT_NETWORKS.map((n) => ({
    id: n.id,
    name: n.name,
    fullName: n.fullName,
    color: n.color,
    bgColor: n.bgColor,
    borderColor: n.borderColor,
  }));

  return (
    <section className="py-12 bg-transparent relative overflow-hidden border-t border-b border-white/5">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-emerald-500/[0.015] blur-[80px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto"
        >
          {/* Traditional Payments */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 font-mono">
              We Accept Payments Via:
            </span>
            <div className="flex items-center gap-4">
              {methods.map((method) => (
                <div 
                  key={method.name}
                  className="px-4 py-2 rounded-xl bg-white/[0.01] border border-white/5 hover:border-emerald-500/20 hover:bg-white/[0.02] transition-all duration-300 flex items-center justify-center shrink-0 group relative overflow-hidden"
                >
                  <img 
                    src={method.src} 
                    alt={method.alt} 
                    className="h-5 w-auto object-contain rounded grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-85 transition-all"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vertical Divider for Desktop */}
          <div className="hidden md:block w-px h-8 bg-white/10" />

          {/* Crypto Acceptance */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Wallet className="w-3.5 h-3.5 text-amber-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 font-mono">
                USDT Accepted On:
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {cryptoNetworks.map((network) => (
                <div
                  key={network.id}
                  className={`px-3 py-1.5 rounded-lg bg-white/[0.01] border border-white/5 flex items-center gap-1.5 hover:border-emerald-500/20 transition-all duration-300 cursor-default`}
                >
                  <span className={`text-[8px] font-black uppercase tracking-widest ${network.color}`}>{network.name}</span>
                  <span className="text-[6px] text-white/20 font-bold uppercase tracking-wider">{network.fullName}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
