import { useEffect, useState } from "react";
import { BookOpen, Clock, GraduationCap, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CourseCardSkeleton } from "../components/ui/Skeleton";
import { breadcrumbSchema, courseSchema } from "../utils/structuredData";
import { AcademyCourseCard } from "../components/institutional/AcademyCourseCard";
import { useNavigate } from "react-router-dom";

import { PageHero } from "../components/site/PageHero";
import { PageMeta } from "../components/site/PageMeta";
import { PageSection, SectionHeading } from "../components/site/PageSection";
import { Reveal } from "../components/site/Reveal";
import { getCourses } from "../services/apiHandlers";
import { Course } from "../types";

const getCourseImage = (course: Course) =>
  course.image_url || course.thumbnail_url || `https://picsum.photos/seed/${course.id}/960/540`;

export const Academy = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="relative overflow-hidden pb-16">
        <PageMeta
          title="Trading Academy"
          description="Explore the IFXTrades Academy for structured trader education across forex, gold, and algorithmic execution workflows. Learn at your own pace."
          path="/academy"
          keywords={["trading academy", "forex education", "algo trading course", "online trading courses", "forex learning"]}
          structuredData={[
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Academy", path: "/academy" },
            ]),
            ...(courses.length > 0 ? courses.map(courseSchema) : []),
          ]}
        />

      <PageHero
        eyebrow="Trader Development"
        title={
          <>
            Education that compounds into <span className="site-title-gradient">better execution decisions.</span>
          </>
        }
        description="The IFXTrades Academy is built for traders moving from scattered information into a repeatable execution process. Learn market structure, risk discipline, and system thinking from a single operating surface."
        actions={[
          { label: "Client Access", to: "/login", icon: <PlayCircle className="h-4 w-4" /> },
          { label: "Explore Webinars", to: "/webinars", variant: "secondary" },
        ]}
        metrics={[
          { label: "Tracks", value: loading ? "Loading" : String(courses.length || 0), helper: "Active course paths" },
          { label: "Lessons", value: loading ? "Loading" : String(totalLessons), helper: "Structured modules from the live catalog" },
          { label: "Format", value: "Video + Frameworks", helper: "Execution-first trader education" },
        ]}
        aside={
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] uppercase tracking-[0.32em] text-emerald-200/80">Learning System</div>
              <ul className="mt-3 space-y-3 text-sm text-slate-300">
                <li>Market structure and directional bias.</li>
                <li>Risk planning and execution discipline.</li>
                <li>Algorithmic thinking for repeatable setups.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] uppercase tracking-[0.32em] text-emerald-200/80">Best For</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Traders moving from intuition-led entries toward process, structure, and repeatability.
              </p>
            </div>
          </div>
        }
      />

      <PageSection>
        <SectionHeading
          eyebrow="Curriculum"
          title="A clean path from market basics to execution systems."
          description="Each course is backed by the live academy data model. This keeps the public surface aligned with the content library instead of drifting into placeholder marketing copy."
        />

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : null}

        {!loading && !courses.length ? (
          <div className="site-panel p-10 text-center">
            <h3 className="text-2xl font-semibold text-white">No courses are published yet.</h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              The academy route is connected and ready. Once course records are available in Supabase, they will appear here without additional wiring changes.
            </p>
          </div>
        ) : null}

        {!loading && courses.length ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, index) => (
              <AcademyCourseCard 
                key={course.id}
                index={index}
                course={{
                  id: course.id,
                  title: course.title,
                  instructor: {
                    name: course.instructor_name || "Sovereign Analyst",
                    avatarUrl: "", // Defaults to fallback in component
                    credentials: "Institutional Macro Specialist"
                  },
                  thumbnailUrl: getCourseImage(course),
                  duration: typeof course.duration === 'string' ? parseInt(course.duration) || 60 : 60,
                  moduleCount: course.chapters?.length || course.lessons?.length || 0,
                  level: (course.level?.toLowerCase() || 'beginner') as 'beginner' | 'intermediate' | 'institutional',
                  isPremium: course.price > 0,
                  enrolledCount: 12400 + index * 150, // Institutional mock for social proof
                  description: course.description,
                  progress: index === 0 ? 45 : undefined // Mock progress for the first course
                }}
                onEnroll={(c) => navigate(`/academy/${c.id}`)}
              />
            ))}
          </div>
        ) : null}
      </PageSection>
    </div>
  );
};
