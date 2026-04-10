import React, { useEffect, useState } from "react";
import { BookOpen, Clock, GraduationCap, PlayCircle, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { CourseCardSkeleton } from "../components/ui/Skeleton";
import { AcademyCourseCard } from "../components/institutional/AcademyCourseCard";
import { PageMeta } from "../components/site/PageMeta";
import { getCourses } from "../services/apiHandlers";
import { Course } from "../types";

const getCourseImage = (course: Course) =>
  course.image_url || course.thumbnail_url || `https://picsum.photos/seed/${course.id}/960/540`;

export const Academy = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        if (active) {
          setCourses(data || []);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      active = false;
    };
  }, []);

  const totalLessons = courses.reduce((sum, course) => sum + (course.chapters?.length || 0), 0);

  return (
    <>
      <PageMeta
        title="Sovereign Trading Academy"
        description="Explore the IFXTrades Academy for structured trader education across forex, gold, and algorithmic execution workflows."
        path="/academy"
        keywords={["trading academy", "forex education", "algo trading course"]}
      />

      <div className="space-y-16">
        {/* Terminal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.8] mb-2">
              Institutional <span className="text-emerald-500">Academy</span>
            </h1>
            <p className="text-sm text-white/40 max-w-2xl font-medium uppercase tracking-widest leading-relaxed">
              Curriculum engineered for traders moving from intuition-led entries toward systematic execution, risk discipline, and algorithmic repeatability.
            </p>
          </div>
          
          <div className="flex gap-8">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1 leading-none">Modules</span>
                <span className="text-xl font-black text-white font-mono">{loading ? "--" : courses.length}</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1 leading-none">Catalog</span>
                <span className="text-xl font-black text-white font-mono">v5.0</span>
             </div>
          </div>
        </div>

        {/* Course Matrix */}
        <section className="space-y-12">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {!courses.length ? (
                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-20 text-center">
                   <div className="text-xl font-black text-white/20 uppercase italic transition-colors">Course nodes offline</div>
                   <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em] mt-3">Re-synchronizing with the learning cluster.</p>
                </div>
              ) : (
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course, index) => (
                    <AcademyCourseCard 
                      key={course.id}
                      index={index}
                      course={{
                        id: course.id,
                        title: course.title,
                        instructor: {
                          name: course.instructor_name || "Sovereign Analyst",
                          avatarUrl: "",
                          credentials: "Institutional Macro Specialist"
                        },
                        thumbnailUrl: getCourseImage(course),
                        duration: typeof course.duration === 'string' ? parseInt(course.duration) || 60 : 60,
                        moduleCount: course.chapters?.length || course.lessons?.length || 0,
                        level: (course.level?.toLowerCase() || 'beginner') as 'beginner' | 'intermediate' | 'institutional',
                        isPremium: course.price > 0,
                        enrolledCount: 12400 + index * 150,
                        description: course.description,
                        progress: index === 0 ? 45 : undefined
                      }}
                      onEnroll={(c) => navigate(`/academy/${c.id}`)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Methodology Nodes */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 py-12 border-t border-white/5">
           <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4 hover:border-emerald-500/20 transition-all group">
              <div className="flex items-center gap-3">
                 <Zap className="w-5 h-5 text-emerald-500" />
                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Execution Methodology</h4>
              </div>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.15em] leading-relaxed">
                 Focused on market structure, directional bias, and the mechanical execution of high-probability trading models.
              </p>
           </div>
           <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4 hover:border-emerald-500/20 transition-all group">
              <div className="flex items-center gap-3">
                 <Shield className="w-5 h-5 text-emerald-500" />
                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Risk Governance</h4>
              </div>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.15em] leading-relaxed">
                 Deep-dives into trade management, portfolio survival metrics, and the psychological framework required for consistency.
              </p>
           </div>
        </section>
      </div>
    </>
  );
};
