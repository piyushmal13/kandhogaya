import React from "react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/lib/motion";

export const PaymentGateways = () => {
  const methods = [
    { name: "Visa", src: "/visa.png", alt: "Visa Card" },
    { name: "Mastercard", src: "/mastercard.jpg", alt: "Mastercard" },
    { name: "UPI", src: "/upi.png", alt: "UPI (Unified Payments Interface)" }
  ];

  return (
    <section className="py-12 bg-[#020202] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto p-6 md:p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 shadow-2xl"
        >
          {/* Plain, direct title */}
          <motion.div variants={itemVariants} className="text-center md:text-left space-y-1">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">We Accept Payments Via:</h3>
            <p className="text-[10px] text-white/35 font-bold uppercase tracking-wider">Direct institutional clearing channels</p>
          </motion.div>

          {/* Compact Payment Method Logos */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 select-none"
          >
            {methods.map((method) => (
              <div 
                key={method.name}
                className="px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl bg-white/[0.01] border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-105 shrink-0"
              >
                <img 
                  src={method.src} 
                  alt={method.alt} 
                  className="h-6 sm:h-8 w-auto object-contain transition-all duration-300 rounded"
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
