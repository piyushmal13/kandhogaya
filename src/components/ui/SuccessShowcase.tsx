import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import { Star } from "lucide-react";
import { fetchReviews } from "../../services/reviewService";

export const SuccessShowcase = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const x = useMotionValue(0);

  useEffect(() => {
    fetchReviews().then(setReviews);
  }, []);

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
        </div>

        <motion.div 
          className="flex gap-6 cursor-grab"
          drag="x"
          dragConstraints={{ right: 0, left: -1000 }}
          style={{ x }}
        >
          {reviews.map((rev, i) => (
            <motion.div 
              key={i}
              className="p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 transition-colors duration-300 flex flex-col h-full min-w-[300px] md:min-w-[400px]"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(rev.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                ))}
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-1 font-normal tracking-tight">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
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
        </motion.div>
      </div>
    </section>
  );
};
