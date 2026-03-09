import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowRight, Video, Download, Search, Filter } from "lucide-react";

import { getBlogPosts } from "../services/apiHandlers";

export const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);
  const PAGE_SIZE = 9;

  const lastPostElementRef = useCallback((node: any) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    // Search is handled by the useEffect dependency on searchQuery
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] text-emerald-500 font-bold uppercase mb-4 tracking-widest"
          >
            Institutional Research
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter"
          >
            Market Insights
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl text-lg"
          >
            Expert analysis on Forex, Gold, and Global Macro markets. Updated daily by our institutional research desk.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search analysis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-zinc-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"
            />
          </form>
          <button className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all text-sm">
            <Filter className="w-4 h-4" />
            All Topics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {posts.map((post: any, index: number) => (
            <motion.div
              key={post.id}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 3) * 0.1 }}
              layout
            >
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col h-full shadow-2xl">
                  <div className="aspect-video bg-black overflow-hidden relative">
                    <img 
                      src={post.metadata?.cover_image || `https://picsum.photos/seed/${post.slug}/800/450`} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {post.metadata?.video_url && (
                        <div className="bg-emerald-500 text-black p-1.5 rounded-lg shadow-lg">
                          <Video className="w-4 h-4" />
                        </div>
                      )}
                      {post.metadata?.download_url && (
                        <div className="bg-blue-500 text-white p-1.5 rounded-lg shadow-lg">
                          <Download className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase mb-4 tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors leading-tight tracking-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-8 leading-relaxed flex-1">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <Clock className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">5 min read</span>
                      </div>
                      <div className="text-emerald-500 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="flex justify-center mt-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No analysis found matching your search.</p>
        </div>
      )}
    </div>
  );
};
