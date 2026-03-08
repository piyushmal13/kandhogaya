import React from "react";
import { motion } from "motion/react";
import { Clock, BookOpen } from "lucide-react";

export const Academy = () => {
  const courses = [
    { id: 1, title: "Forex Mastery 101", level: "Beginner", duration: "12 Hours", lessons: 24, image: "https://picsum.photos/seed/forex/800/450" },
    { id: 2, title: "Gold Scalping Secrets", level: "Advanced", duration: "8 Hours", lessons: 15, image: "https://picsum.photos/seed/gold/800/450" },
    { id: 3, title: "Algo Trading with MT5", level: "Intermediate", duration: "15 Hours", lessons: 30, image: "https://picsum.photos/seed/algo/800/450" },
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] mb-4 inline-block">Education</span>
        <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">IFXTrades Academy</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Master the markets with our structured learning paths. From basic pips to advanced algorithmic strategies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.map((course, i) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/50 transition-all"
          >
            <div className="aspect-video relative overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-emerald-500 text-[10px] font-bold rounded-full border border-white/10 uppercase tracking-widest">
                  {course.level}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-500 transition-colors">{course.title}</h3>
              <div className="flex items-center gap-6 mb-8 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {course.duration}</div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course.lessons} Lessons</div>
              </div>
              <button type="button" onClick={() => alert("Course module opening...")} className="w-full py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all">
                Start Learning
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
