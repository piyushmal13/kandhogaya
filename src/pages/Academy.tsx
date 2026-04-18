import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourseCardSkeleton } from "../components/ui/Skeleton";
import { AcademyCourseCard } from "../components/institutional/AcademyCourseCard";
import { PageMeta } from "../components/site/PageMeta";
import { getCourses } from "../services/apiHandlers";
import { Course } from "../types";
import { DashboardLayout } from "@/components/institutional/DashboardLayout";

const getCourseImage = (course: Course) =>
  course.image_url || course.thumbnail_url || `https://picsum.photos/seed/${course.id}/960/540`;

export const Academy = () => {
  const navigate = useNavigate();

  const { data: courses = [], isLoading: loading } = useQuery({
    queryKey: ['institutional_academy_courses'],
    queryFn: () => getCourses(),
    staleTime: 600000,
  });

  return (
    <div className="pt-32 pb-24 md:pt-64 md:pb-48">
      <PageMeta
        title="Sovereign Academy | Institutional Certification"
        description="Explore the IFXTrades Academy for structured trader education across forex, gold, and algorithmic execution workflows."
        path="/academy"
        keywords={["trading academy", "forex education", "algo trading course"]}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16 md:space-y-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 md:gap-20">
          <div className="space-y-10 flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]"
            >
              Academic Sovereign Network
            </motion.div>
            <h1 className="text-shimmer mb-6">
              Elite <br />
              <span className="italic font-serif text-gradient-emerald">Curriculum.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              Curriculum engineered for traders moving from intuition-led entries toward systematic execution, risk discipline, and algorithmic repeatability.
            </p>
          </div>
          
          <div className="flex justify-center lg:justify-end gap-12 md:gap-16 border-t lg:border-t-0 lg:border-l border-white/5 pt-12 lg:pt-0 lg:pl-16">
             <div className="flex flex-col items-center lg:items-end">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-3 leading-none">Modules</span>
                <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter">{loading ? "--" : courses.length}</span>
             </div>
             <div className="flex flex-col items-center lg:items-end">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-3 leading-none">Catalog</span>
                <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter italic text-emerald-500">v6.0</span>
             </div>
          </div>
        </div>

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

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 py-12 border-t border-white/5">
           <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4 hover:border-[#58F2B6]/20 transition-all group">
              <div className="flex items-center gap-3">
                 <Zap className="w-5 h-5 text-[#58F2B6]" />
                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Execution Methodology</h4>
              </div>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.15em] leading-relaxed">
                 Focused on market structure, directional bias, and the mechanical execution of high-probability trading models.
              </p>
           </div>
           <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4 hover:border-[#58F2B6]/20 transition-all group">
              <div className="flex items-center gap-3">
                 <Shield className="w-5 h-5 text-[#58F2B6]" />
                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Risk Governance</h4>
              </div>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.15em] leading-relaxed">
                 Deep-dives into trade management, portfolio survival metrics, and the psychological framework required for consistency.
              </p>
           </div>
        </section>
      </div>
    </div>
  );
};
