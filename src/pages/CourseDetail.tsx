import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Lock, CheckCircle2, Clock, BookOpen, ShieldCheck } from "lucide-react";
import { getCourseById, checkUserAccess } from "../services/apiHandlers";
import { Course, Chapter } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  const videoUrl = useMemo(() => {
    if (!activeChapter?.video_url) return "";
    const url = activeChapter.video_url;
    if (url.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${url.split('/').pop()?.split('?')[0]}`;
    }
    if (url.includes('youtube.com')) {
      return url.replace('watch?v=', 'embed/').split('&')[0];
    }
    return url;
  }, [activeChapter]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
        
        if (courseData?.chapters?.length > 0) {
          setActiveChapter(courseData.chapters[0]);
        }

        if (user) {
          const access = await checkUserAccess(user.id, courseId);
          setHasAccess(access);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user]);

  const handleEnrollClick = () => {
    if (!user) {
      info("Please sign in to enroll in this course.");
      navigate("/login");
      return;
    }
    // In a real app, this would trigger a payment flow
    info(`Redirecting to payment for ${course?.title}...`);
  };

  if (loading) return (
    <div className="pt-32 min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="pt-32 min-h-screen text-center text-white">
      <h2 className="text-2xl font-bold">Course not found</h2>
      <Link to="/academy" className="text-emerald-500 mt-4 inline-block">Back to Academy</Link>
    </div>
  );

  const isChapterLocked = (chapter: Chapter) => {
    if (chapter.is_free) return false;
    return !hasAccess;
  };



  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <Link to="/academy" className="inline-flex items-center gap-2 text-emerald-500 font-bold mb-8 hover:translate-x-[-4px] transition-transform">
        <ArrowLeft className="w-4 h-4" /> Back to Academy
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Video Player & Content */}
        <div className="lg:col-span-8">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 relative mb-8 group">
            {(() => {
              if (!activeChapter) {
                return (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Select a module to start watching
                  </div>
                );
              }

              if (isChapterLocked(activeChapter)) {
                return (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm p-8 text-center">
                    <Lock className="w-16 h-16 text-emerald-500 mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">This module is locked</h3>
                    <p className="text-gray-400 mb-8 max-w-md">Enroll in this course to unlock all premium chapters and institutional trading strategies.</p>
                    <button 
                      onClick={handleEnrollClick}
                      className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      Enroll in Course {course.price > 0 ? `($${course.price})` : ""}
                    </button>
                  </div>
                );
              }

              return (
                <iframe 
                  src={videoUrl} 
                  title={`IFX Academy Masterclass: ${activeChapter.title}`}
                  className="w-full h-full"
                  allowFullScreen
                />
              );
            })()}
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
            <div className="flex items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {course.duration || "Self-paced"}</div>
              <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course.chapters?.length || 0} Modules</div>
              <div className="flex items-center gap-2 text-emerald-500"><ShieldCheck className="w-4 h-4" /> Verified Content</div>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Right: Curriculum */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden sticky top-32">
            <div className="p-6 border-b border-white/5 bg-white/5">
              <h3 className="text-white font-bold">Course Curriculum</h3>
              <p className="text-gray-500 text-xs mt-1">{course.chapters?.length || 0} Modules • Progressive Learning</p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {course.chapters?.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => setActiveChapter(chapter)}
                  className={`w-full p-6 flex items-start gap-4 text-left transition-all border-b border-white/5 last:border-0 ${
                    activeChapter?.id === chapter.id ? 'bg-emerald-500/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`mt-1 shrink-0 ${activeChapter?.id === chapter.id ? 'text-emerald-500' : 'text-gray-600'}`}>
                    {isChapterLocked(chapter) ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-bold ${activeChapter?.id === chapter.id ? 'text-emerald-500' : 'text-white'}`}>
                        {index + 1}. {chapter.title}
                      </span>
                      {chapter.is_free && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-500 rounded font-bold uppercase tracking-widest">
                          Free
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> {chapter.duration || "15:00"}
                    </div>
                  </div>
                  {hasAccess && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
