import React from "react";
import { motion } from "motion/react";
import { BookOpen, ArrowRight, Star, GraduationCap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "../../services/apiHandlers";

export const AcademyPromo = () => {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['home_academy_promo'],
    queryFn: () => getCourses(), // Get top 3 courses
    staleTime: 600000,
  });

  return (
    <section className="py-24 md:py-48 bg-[#010203] relative overflow-hidden border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              <GraduationCap className="w-4 h-4" />
              Educational Infrastructure
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.95]"
            >
              Upgrade Your <br />
              <span className="text-emerald-500">Execution Skills.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/40 leading-relaxed font-medium max-w-xl"
            >
              Access our private repository of institutional knowledge. From market structure deep-dives to advanced algorithmic logic, we provide the blueprints used by the top 1% of traders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/academy"
                className="px-10 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.05] transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.1)] italic flex items-center gap-3"
              >
                Access Academy <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <div className="relative">
            {/* Visual Representation of Academy */}
            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full opacity-20" />
            <div className="relative grid grid-cols-1 gap-6">
              {isLoading ? (
                [1, 2].map(i => (
                  <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
                ))
              ) : (
                courses.slice(0, 2).map((course: any, i: number) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:border-emerald-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                        <span className="text-[10px] font-black text-white/60">Institutional</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 italic group-hover:text-emerald-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-white/30 line-clamp-2 mb-6 font-medium leading-relaxed">
                      {course.description}
                    </p>
                    <Link to={`/academy/${course.id}`} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/60 group-hover:text-emerald-500 transition-colors">
                      Begin Protocol <ChevronRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="pt-20 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Active Scholars", value: "8,500+" },
            { label: "Hours of Content", value: "450+" },
            { label: "Execution Logic", value: "Verified" },
            { label: "Knowledge Grade", value: "Level 4" }
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.5 }}
            >
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">{m.label}</div>
              <div className="text-2xl font-black text-white tracking-tighter italic">{m.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
