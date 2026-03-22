import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowRight, Video, Download, Search, Filter } from "lucide-react";

import { getBlogPosts } from "../services/apiHandlers";
import { PageHero } from "../components/site/PageHero";
import { PageMeta } from "../components/site/PageMeta";
import { PageSection } from "../components/site/PageSection";
import { BlogCardSkeleton } from "../components/ui/Skeleton";
import { breadcrumbSchema } from "../utils/structuredData";
import { Blog as BlogPost } from "../types";

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);
  const PAGE_SIZE = 9;

  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const data = await getBlogPosts(page, PAGE_SIZE, searchQuery);
      
      if (Array.isArray(data)) {
        if (page === 0) {
          setPosts(data);
        } else {
          setPosts(prev => [...prev, ...data]);
        }
        setHasMore(data.length === PAGE_SIZE);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [page, searchQuery]);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setPage(0);
    // Search is handled by the useEffect dependency on searchQuery
  };

  return (
    <div className="relative overflow-hidden pb-20">
      <PageMeta
        title="Market Insights & Trading Analysis"
        description="Read IFXTrades research on forex, gold, macro structure, and execution workflows from the institutional analysis desk. Daily market insights."
        path="/blog"
        keywords={["trading blog", "forex market analysis", "gold market insights", "trading research", "market commentary"]}
        structuredData={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Market Insights", path: "/blog" },
        ])}
      />

      <PageHero
        eyebrow="Institutional Research"
        title={
          <>
            Market insights with <span className="site-title-gradient">execution relevance.</span>
          </>
        }
        description="Read analysis designed to help traders frame bias, risk, and market structure. The goal is not content volume. The goal is better decisions."
        metrics={[
          { label: "Cadence", value: "Daily", helper: "Fresh market context and trade framing" },
          { label: "Coverage", value: "Forex + Gold + Macro", helper: "Focused on tradable market structure" },
        ]}
        aside={
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-200" />
              <input
                type="text"
                placeholder="Search analysis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pr-4 pl-12 text-sm text-white outline-none focus:border-emerald-300/40"
              />
            </form>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:text-white">
              <Filter className="h-4 w-4 text-emerald-200" />
              All Topics
            </button>
          </div>
        }
      />

      <PageSection className="pt-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {posts.map((post: BlogPost, index: number) => (
              <motion.div
                key={post.id}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 3) * 0.1 }}
                layout
              >
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <div className="site-panel flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-video overflow-hidden bg-black">
                      <img
                        src={post.metadata?.cover_image || `https://picsum.photos/seed/${post.slug}/800/450`}
                        alt={post.title}
                        className="h-full w-full object-cover opacity-65 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {post.metadata?.video_url ? (
                          <div className="rounded-lg bg-emerald-300 p-1.5 text-slate-950 shadow-lg">
                            <Video className="h-4 w-4" />
                          </div>
                        ) : null}
                        {post.metadata?.download_url ? (
                          <div className="rounded-lg bg-sky-500 p-1.5 text-white shadow-lg">
                            <Download className="h-4 w-4" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-8">
                      <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-200/80">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <h3 className="mb-4 text-2xl font-semibold leading-tight text-white transition-colors group-hover:text-emerald-100">
                        {post.title}
                      </h3>
                      <p className="mb-8 flex-1 text-sm leading-7 text-slate-300 line-clamp-3">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-200">
                            <Clock className="h-3 w-3" />
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">5 min read</span>
                        </div>
                        <div className="text-emerald-200 transition-transform group-hover:translate-x-1">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {loading && posts.length === 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {['skel-1', 'skel-2', 'skel-3', 'skel-4', 'skel-5', 'skel-6'].map(key => (
              <BlogCardSkeleton key={key} />
            ))}
          </div>
        )}

        {loading && posts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-500">No analysis found matching your search.</p>
          </div>
        )}
      </PageSection>
    </div>
  );
};
