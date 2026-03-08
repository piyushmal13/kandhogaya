import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { homeContent } from "../config/homeContent";

export const SuccessShowcase = () => {
  const { reviews } = homeContent;

  return (
    <section className="py-32 bg-black relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight"
          >
            Trusted by Professionals
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5 text-emerald-500 fill-emerald-500" />
              ))}
            </div>
            <span className="text-white font-medium ml-2">4.9/5</span>
            <span className="text-gray-500 ml-1">from 1,200+ traders</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors duration-300 flex flex-col h-full"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(rev.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                ))}
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-1 font-normal tracking-tight">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-medium">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{rev.name}</div>
                  <div className="text-gray-500 text-xs">{rev.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
