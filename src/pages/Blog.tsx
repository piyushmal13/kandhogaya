import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowRight, Search, Filter } from "lucide-react";

import { getBlogPosts } from "../services/apiHandlers";
import { PageHero } from "../components/site/PageHero";
import { PageMeta } from "../components/site/PageMeta";
import { PageSection } from "../components/site/PageSection";
import { BlogCardSkeleton } from "../components/ui/Skeleton";
import { breadcrumbSchema } from "../utils/structuredData";
import { Blog as BlogPost } from "../types";
import { resolveBlogImage } from "../utils/blogUtils";

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
                className="group"
              >
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <div className="relative h-full flex flex-col bg-[#0a0a0a] border border-white/5 rounded-[32px] overflow-hidden hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                    {/* Image Section */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={resolveBlogImage(post, "thumb")}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                      
                      {/* Floating Category Tag */}
                      <div className="absolute top-6 left-6">
                        <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                          {post.category || "Research"}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-1 flex-col p-8 pt-4">
                      {/* Date & Read Time */}
                      <div className="mb-6 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                           <Calendar className="h-3 w-3 text-emerald-500/50" />
                           {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                         </div>
                         <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-gray-500/50 bg-white/5 px-2 py-0.5 rounded-md">
                           <Clock className="h-2.5 w-2.5" />
                           5 MIN
                         </div>
                      </div>

                      {/* Title */}
                      <h3 className="mb-4 text-2xl font-black leading-tight text-white group-hover:text-emerald-400 transition-colors tracking-tighter">
                        {post.title}
                      </h3>

                      {/* Content Snippet */}
                      <p className="mb-8 flex-1 text-[13px] leading-6 text-gray-400 line-clamp-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                        {post.metadata?.bold_headline || post.content}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-emerald-500 font-black text-[10px]">
                              {(post.metadata?.author_name || (post as any).author?.full_name || "A").charAt(0)}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                             {post.metadata?.author_name || (post as any).author?.full_name || "IFX ANALYST"}
                           </span>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 text-gray-600 group-hover:text-black transition-all duration-300 transform group-hover:rotate-45">
                          <ArrowRight className="h-4 w-4" />
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
