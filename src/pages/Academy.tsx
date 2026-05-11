import React from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Zap, Shield, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourseCardSkeleton } from "../components/ui/Skeleton";
import { AcademyCourseCard } from "../components/institutional/AcademyCourseCard";
import { PageMeta } from "../components/site/PageMeta";
import { getCourses } from "../services/apiHandlers";
import { Course } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { DashboardLayout } from "../components/institutional/DashboardLayout";

const getCourseImage = (course: Course) =>
  course.image_url || course.thumbnail_url || `https://picsum.photos/seed/${course.id}/960/540`;

// High-authority institutional mapping logic
const getInstitutionalPersona = (course: Course) => {
  if (course.title.toLowerCase().includes('gold') || course.title.toLowerCase().includes('algo')) {
    return {
      name: "Piyush Malviya",
      credentials: "Head of Quantitative Strategy",
      avatarUrl: "https://ifxtrades.com/piyush.jpg" // High-authority placeholder
    };
  }
  return {
    name: "IFX Quantitative Desk",
    credentials: "Institutional Macro Team",
    avatarUrl: ""
  };
};

export const Academy = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: courses = [], isLoading: loading } = useQuery({
    queryKey: ['institutional_academy_courses'],
    queryFn: () => getCourses(),
    staleTime: 600000,
  });

  const content = (
    <div className={user ? "pb-24" : "pt-32 pb-24 md:pt-48 md:pb-48"}>
      <PageMeta
        title="IFX Academy | Institutional Certification"
        description="Explore the IFX TRADES Academy for structured trader education across forex, gold, and algorithmic execution workflows."
        path="/academy"
        keywords={["trading academy", "forex education", "algo trading course"]}
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 space-y-16 md:space-y-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 md:gap-20">
          <div className="space-y-10 flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/[0.04] border border-emerald-500/[0.15] text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              Professional Education
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight leading-[0.9]">
              Elite <br />
              <span className="text-emerald-400">Curriculum.</span>
            </h1>
            <p className="text-base md:text-xl text-white/40 max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
              Curriculum engineered for traders moving from intuition-led entries toward systematic execution, risk discipline, and algorithmic repeatability.
            </p>
          </div>
          
          <div className="flex justify-center lg:justify-end gap-12 md:gap-16 border-t lg:border-t-0 lg:border-l border-white/5 pt-12 lg:pt-0 lg:pl-16">
             <div className="flex flex-col items-center lg:items-end">
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3 leading-none">Programmes</span>
                <span className="text-4xl md:text-6xl font-bold text-white tabular-nums">{loading ? "--" : courses.length}</span>
             </div>
             <div className="flex flex-col items-center lg:items-end">
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3 leading-none">Catalogue</span>
                <span className="text-4xl md:text-6xl font-bold text-emerald-500">2024</span>
             </div>
          </div>
        </div>

        <section className="space-y-12">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <CourseCardSkeleton key={`academy-skel-${i}`} />
              ))}
            </div>
          ) : (
            <>
              {courses.length === 0 ? (
                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-20 text-center">
                   <div className="text-xl font-bold text-white/30 uppercase tracking-widest">No Programmes Available</div>
                   <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em] mt-3">Please check back later or contact institutional support.</p>
                </div>
              ) : (
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                   {courses.map((course, index) => {
                    const persona = getInstitutionalPersona(course);
                    const courseLevel = course.level?.toLowerCase();
                    const institutionalLevel = courseLevel === 'advanced' ? 'institutional' : (courseLevel || 'beginner');

                    return (
                      <AcademyCourseCard 
                        key={course.id}
                        index={index}
                        course={{
                          id: course.id,
                          title: course.title,
                          instructor: persona,
                          thumbnailUrl: getCourseImage(course),
                          duration: typeof course.duration === 'string' ? Number.parseInt(course.duration, 10) || 60 : 60,
                          moduleCount: course.chapters?.length || course.lessons?.length || 0,
                          level: institutionalLevel as any,
                          isPremium: course.price > 0,
                          enrolledCount: 1420 + index * 85,
                          description: course.description,
                          progress: index === 0 && user ? 45 : undefined
                        }}
                        onEnroll={(c) => navigate(`/academy/${c.id}`)}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 py-12 border-t border-white/5">
           <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6 hover:border-emerald-500/20 transition-all group">
              <div className="flex items-center justify-between">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Zap className="w-6 h-6 text-emerald-400" />
                 </div>
                 <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">Execution Methodology</h4>
                 <p className="text-sm font-light text-white/40 leading-relaxed">
                    Focused on market structure, directional bias, and the mechanical execution of high-probability trading models within a systematic framework.
                 </p>
              </div>
           </div>
           <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6 hover:border-emerald-500/20 transition-all group">
              <div className="flex items-center justify-between">
                 <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Shield className="w-6 h-6 text-purple-400" />
                 </div>
                 <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-purple-500 transition-colors" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">Risk Governance</h4>
                 <p className="text-sm font-light text-white/40 leading-relaxed">
                    Advanced study into trade management, portfolio survival metrics, and the psychological governance required for institutional capital scaling.
                 </p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );

  if (user) {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  return content;
};
