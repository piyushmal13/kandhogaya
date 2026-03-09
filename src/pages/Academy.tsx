import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, BookOpen, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getCourses } from "../services/apiHandlers";
import { Course } from "../types";

export const Academy = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return (
    <div className="pt-32 min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

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
            className="bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/50 transition-all flex flex-col"
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={course.image_url || `https://picsum.photos/seed/${course.id}/800/450`} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-emerald-500 text-[10px] font-bold rounded-full border border-white/10 uppercase tracking-widest">
                  {course.level || "Beginner"}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  <PlayCircle className="w-8 h-8" />
                </div>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{course.title}</h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-6 mb-8 text-gray-500 text-xs font-bold uppercase tracking-widest mt-auto">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {course.duration || "Self-paced"}</div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course.chapters?.length || 0} Modules</div>
              </div>
              <Link 
                to={`/academy/${course.id}`}
                className="w-full py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all text-center"
              >
                Start Learning
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {!loading && courses.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No courses available at the moment. Check back soon!
        </div>
      )}
    </div>
  );
};
