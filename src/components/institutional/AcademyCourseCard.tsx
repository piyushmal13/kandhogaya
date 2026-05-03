import React from 'react';
import { motion } from 'motion/react';
import { Clock, Layers, GraduationCap, CheckCircle, ShieldCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Button } from '../ui/Button';

// ── TYPES ──
export interface Course {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatarUrl: string;
    credentials: string; // e.g., "Ex-Goldman Sachs Quant"
  };
  thumbnailUrl: string;
  duration: number; // minutes
  moduleCount: number;
  level: 'beginner' | 'intermediate' | 'institutional';
  progress?: number; // 0-100, undefined if not enrolled
  isPremium: boolean;
  enrolledCount: number; // social proof: "12,400+ enrolled"
  description?: string;
}

interface AcademyCourseCardProps {
  course: Course;
  index: number;
  onEnroll?: (course: Course) => void;
}

// ── COMPONENT ──

export const AcademyCourseCard: React.FC<AcademyCourseCardProps> = ({ course, index, onEnroll }) => {
  const { isEnabled: academyPremiumLock } = useFeatureFlag('academy_premium_lock', true);

  // Staggered entrance transition
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1, 
        ease: [0.23, 1, 0.32, 1] as const 
      }
    }
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.02 }}
      className="group relative flex flex-col h-full overflow-hidden rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 z-10"
      itemScope
      itemType="https://schema.org/Course"
    >
      {/* ── Metadata for Schema.org ── */}
      <meta itemProp="courseMode" content="Online" />
      <meta itemProp="educationalLevel" content={course.level} />
      <div itemProp="provider" itemScope itemType="https://schema.org/Organization">
        <meta itemProp="name" content="IFX Trades" />
      </div>

      {/* ── Thumbnail Section ── */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          itemProp="image"
          loading="lazy"
        />
        
        {/* Institutional Overlay for Premium */}
        {course.isPremium && academyPremiumLock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-amber-500" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Elite Access Required</span>
            </div>
          </div>
        )}

        {/* Level Badge */}
        <div className="absolute top-4 left-4">
          <div className={cn(
            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
            course.level === 'institutional' 
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" 
              : "bg-white/10 border-white/20 text-white"
          )}>
            {course.level}
          </div>
        </div>

        {/* Social Proof Badge */}
        <div className="absolute bottom-4 right-4">
           <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">
                {course.enrolledCount.toLocaleString()}+ Analysts Trained
              </span>
           </div>
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="flex flex-1 flex-col p-8">
        {/* Instructor Meta */}
        <address className="flex items-center gap-4 mb-6 not-italic" itemProp="author" itemScope itemType="https://schema.org/Person">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500/30">
            {course.instructor.avatarUrl ? (
              <img 
                src={course.instructor.avatarUrl} 
                alt={course.instructor.name} 
                className="h-full w-full object-cover"
                itemProp="image"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/10">
                <User className="h-6 w-6 text-white/50" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-white uppercase tracking-wider" itemProp="name">
              {course.instructor.name}
            </span>
            <span className="text-[9px] font-medium text-gray-500 uppercase tracking-[0.15em]">
              {course.instructor.credentials}
            </span>
          </div>
        </address>

        <h3 
          className="text-2xl font-black text-white leading-tight uppercase italic tracking-tighter mb-4 group-hover:text-emerald-400 transition-colors"
          itemProp="name"
        >
          {course.title}
        </h3>

        {/* Metadata Row */}
        <div className="flex items-center gap-6 mb-8 py-4 border-y border-white/5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {course.duration} Min
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {course.moduleCount} Modules
            </span>
          </div>
        </div>

        {/* Progress Bar (Visible if enrolled) */}
        {course.progress !== undefined && (
          <div className="mb-8 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Path Progress</span>
              <span className="text-[9px] font-black text-emerald-500 font-mono">{course.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={course.progress}
              />
            </div>
          </div>
        )}

        {/* Action Node */}
        <div className="mt-auto">
          <Button
            variant="elite"
            fluid
            size="md"
            className="rounded-2xl"
            onClick={() => onEnroll?.(course)}
            trackingEvent={`academy_enroll_${course.id}`}
            aria-label={`Enroll in Course: ${course.title}, ${course.duration} minutes, by ${course.instructor.name}`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4" />
              <span>Initialize Syllabus</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Background Ambient Glow */}
      <div className="absolute -inset-2 bg-emerald-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />
    </motion.article>
  );
};
