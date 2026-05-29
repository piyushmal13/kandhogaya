import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/motion";

const VisaIcon = () => (
  <svg className="w-16 h-8 text-white group-hover:text-blue-400 transition-colors duration-500" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.436 0L4.862 8H3.21L1.636 1.73C1.536 1.34 1.258 0.95 0.814 0.72V0.54H3.504C3.99 0.54 4.412 0.88 4.512 1.39L5.344 5.91L7.844 0H7.436ZM14.152 5.43C14.164 3.49 11.516 3.39 11.53 2.45C11.536 2.16 11.816 1.86 12.392 1.79C12.678 1.75 13.468 1.71 14.164 2.04L14.456 0.65C14.054 0.5 13.52 0.38 12.87 0.38C11.236 0.38 10.076 1.25 10.064 2.49C10.048 4.41 12.674 4.52 12.656 5.48C12.648 5.77 12.348 6.07 11.724 6.13C11.368 6.17 10.592 6.13 9.878 5.75L9.584 7.18C10.008 7.37 10.638 7.52 11.346 7.52C13.048 7.52 14.136 6.66 14.152 5.43ZM18.232 5.04C18.232 5.04 19.342 1.95 19.39 1.83C19.418 1.75 19.436 1.67 19.436 1.58C19.436 1.4 19.324 1.3 19.144 1.3H16.29C15.938 1.3 15.632 1.53 15.534 1.87L13.882 8H15.534L15.864 7.02H17.898L18.09 8H19.584L18.232 5.04ZM16.29 5.74L16.966 3.73L17.514 5.74H16.29ZM23.414 0.54H21.996C21.6 0.54 21.282 0.77 21.134 1.13L18.662 8H20.314L20.644 7.02H22.752L22.956 8H24.45L23.414 0.54Z" fill="currentColor"/>
  </svg>
);

const MastercardIcon = () => (
  <svg className="w-16 h-10 select-none group-hover:scale-105 transition-transform duration-500" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="#EB001B"/>
    <circle cx="16" cy="8" r="8" fill="#F79E1B" fillOpacity="0.8"/>
  </svg>
);

const UpiIcon = () => (
  <svg className="w-16 h-8 text-white group-hover:text-cyan-400 transition-colors duration-500" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 1v7a3 3 0 006 0V1H8v7a1 1 0 01-2 0V1H4z" fill="currentColor"/>
    <path d="M12 1h4a3 3 0 010 6h-2v4h-2V1zm4 4a1 1 0 000-2h-2v2h2z" fill="currentColor"/>
    <path d="M22 1h2v10h-2V1z" fill="currentColor"/>
    <path d="M1 11.5l14-6 16 6" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const BitcoinIcon = () => (
  <svg className="w-12 h-12 text-[#F7931A] group-hover:text-[#f8a536] group-hover:rotate-12 transition-all duration-500" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#F7931A" fillOpacity="0.1" stroke="#F7931A" strokeWidth="1"/>
    <path d="M19.006 14.398c.37-.247.653-.568.847-.962.193-.397.29-.877.29-1.442 0-.585-.12-1.077-.358-1.478-.24-.399-.583-.71-.1-.933-.448-.223-.976-.37-1.583-.44-.316-.035-.747-.058-1.293-.069V7h-1.637v2.01c-.415.006-.86.017-1.336.035V7H12.3v2.072H9.86v1.542h1.411c.219 0 .393.052.52.155.127.104.19.26.19.467v7.528c0 .208-.063.364-.19.468-.127.104-.301.156-.52.156H9.86v1.542h2.44v2.073h1.637v-2.012c.49.012.946.02 1.37.025v1.987h1.636v-1.988c.844-.012 1.564-.069 2.162-.173.71-.127 1.282-.364 1.716-.71.433-.347.747-.791.942-1.333.197-.542.295-1.166.295-1.872 0-.825-.196-1.488-.588-1.987a3.023 3.023 0 00-1.096-.95zm-4.706-3.483h1.86c.647 0 1.134.12 1.46.363.328.243.492.613.492 1.109 0 .473-.167.83-.502 1.07-.335.24-.823.36-1.465.36h-1.845V10.915zm2.445 7.62h-2.445v-3.238h2.445c.704 0 1.229.138 1.573.415.344.277.516.687.516 1.229 0 .52-.165.918-.496 1.196-.33.277-.84.415-1.53.415l-.063-.017z" fill="currentColor"/>
  </svg>
);

export const PaymentGateways = () => {
  const gateways = [
    { 
      name: "Visa", 
      icon: <VisaIcon />, 
      category: "Sovereign Settlement", 
      badge: "Credit/Debit", 
      color: "hover:border-blue-500/20 hover:bg-blue-500/[0.02]" 
    },
    { 
      name: "Mastercard", 
      icon: <MastercardIcon />, 
      category: "Global Processing", 
      badge: "Credit/Debit", 
      color: "hover:border-red-500/20 hover:bg-red-500/[0.02]" 
    },
    { 
      name: "UPI", 
      icon: <UpiIcon />, 
      category: "Real-time Mobile Ingress", 
      badge: "Instant Transfer", 
      color: "hover:border-cyan-500/20 hover:bg-cyan-500/[0.02]" 
    },
    { 
      name: "Bitcoin & Crypto", 
      icon: <BitcoinIcon />, 
      category: "Decentralized Liquidity", 
      badge: "BTC, USDT, Crypto", 
      color: "hover:border-amber-500/20 hover:bg-amber-500/[0.02]" 
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-[#020202] border-t border-white/5 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.015] blur-[150px] rounded-full" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-16"
        >
          {/* Executive Header */}
          <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.25em] w-fit mx-auto">
              <ShieldCheck className="w-2.5 h-2.5" /> SECURE DEPOSIT METRICS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase italic leading-none">
              Secure <span className="text-emerald-400">Settlement.</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/40 leading-relaxed max-w-xl mx-auto">
              Sovereign B2B allocations require secure execution rails. We fully integrate directly with premier institutional processors, real-time banking nodes, and crypto clearing lanes.
            </p>
          </motion.div>

          {/* Gateways Showcase Grid */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto w-full"
          >
            {gateways.map((gate) => (
              <div 
                key={gate.name}
                className={`p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 transition-all duration-500 flex flex-col justify-between items-center text-center gap-6 shadow-2xl hover:-translate-y-1.5 group ${gate.color}`}
              >
                {/* Gateway Icon Wrapper */}
                <div className="h-16 flex items-center justify-center text-white/50 group-hover:text-white transition-colors duration-500">
                  {gate.icon}
                </div>

                {/* Info */}
                <div className="space-y-2 mt-4">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest block w-fit mx-auto group-hover:border-emerald-500/30 group-hover:text-emerald-400 group-hover:bg-emerald-500/5 transition-all">
                    {gate.badge}
                  </span>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-emerald-400 transition-colors">
                    {gate.name}
                  </h3>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider leading-relaxed">
                    {gate.category}
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
