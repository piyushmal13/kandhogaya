import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Zap, Video, Download, Play, FileText, Share2, Calendar, Clock } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { motion } from "motion/react";

import { WebinarPromoInline } from "../components/webinars/WebinarPromoInline";

import { supabase } from "../lib/supabase";

export const BlogDetail = () => {
  const { pathname } = useLocation();
  const slug = pathname.split("/").pop() as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('content_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div className="pt-32 text-center text-white">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
  </div>;
  
  if (!post) return <div className="pt-32 text-center text-white">Post not found.</div>;

  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link to="/blog" className="text-emerald-500 text-sm font-bold flex items-center gap-2 mb-8 hover:translate-x-[-4px] transition-transform">
          <ArrowUpRight className="rotate-[225deg] w-4 h-4" /> Back to Insights
        </Link>
      </motion.div>

      <div className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-emerald-500 font-bold uppercase mb-4 tracking-widest"
        >
          {post.content_type || "Market Analysis"}
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter leading-tight"
        >
          {post.title}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold">
              IFX
            </div>
            <div>
              <div className="text-white font-bold text-sm">IFXTrades Analyst Team</div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.published_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Featured Image or Video */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12 rounded-3xl overflow-hidden border border-white/10 bg-black aspect-video relative group"
      >
        {post.data?.video_url ? (
          <div className="w-full h-full flex items-center justify-center relative">
            <img 
              src={post.data?.cover_image || `https://picsum.photos/seed/${post.slug}/1280/720`} 
              alt="Cover" 
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <button className="w-20 h-20 bg-emerald-500 text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.4)] relative z-10">
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          </div>
        ) : (
          <img 
            src={post.data?.cover_image || `https://picsum.photos/seed/${post.slug}/1280/720`} 
            alt={post.title} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
          />
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="prose prose-invert max-w-none">
            <div className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              <ReactMarkdown>
                {post.body}
              </ReactMarkdown>
            </div>
          </div>

          {/* Downloadable Resources */}
          {post.data?.download_url && (
            <div className="mt-12 p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Download Analysis Report</h3>
                  <p className="text-gray-400 text-sm">Get the full technical breakdown in PDF format.</p>
                </div>
              </div>
              <a 
                href={post.data.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all"
              >
                <FileText className="w-5 h-5" />
                Download PDF Report (2.4 MB)
              </a>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Zap className="text-emerald-500 w-5 h-5" />
              Key Takeaways
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              {post.data?.takeaways?.map((t: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{t}</span>
                </li>
              )) || (
                <>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>Monitor XAUUSD support at 2150.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>Weekly trend remains bullish on H4 timeframe.</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8 rounded-3xl border border-emerald-500/20">
            <h3 className="text-white font-bold mb-4">Want Live Updates?</h3>
            <p className="text-gray-400 text-sm mb-6">Join our private Telegram channel for real-time market alerts and institutional signals.</p>
            <button className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all">
              Join Telegram
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-24 pt-24 border-t border-white/5">
        <WebinarPromoInline />
      </div>
    </div>
  );
};
