import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Zap, Share2, Calendar, Clock, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";

import { PageMeta } from "../components/site/PageMeta";
import { WebinarPromoInline } from "../components/webinars/WebinarPromoInline";
import { getBlogPostBySlug } from "../services/apiHandlers";
import { Blog } from "../types";

export const BlogDetail = () => {
  const { pathname } = useLocation();
  const slug = pathname.split("/").pop();
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const data = await getBlogPostBySlug(slug);
      setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 text-center text-white">
        <PageMeta title="Market Insight" description="Loading IFXTrades market insight." path={pathname} />
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 text-center text-white">
        <PageMeta
          title="Insight Not Found"
          description="The requested IFXTrades market insight could not be found."
          path={pathname}
          robots="noindex,follow"
        />
        Post not found.
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
      <PageMeta
        title={post.title}
        description={(post.content || "").slice(0, 160)}
        path={pathname}
        type="article"
        keywords={["market insight", post.category || "market analysis", "IFXTrades blog"]}
      />

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/blog" className="text-emerald-500 text-sm font-bold flex items-center gap-2 mb-8 hover:translate-x-[-4px] transition-transform">
          <ArrowUpRight className="rotate-[225deg] w-4 h-4" /> Back to Insights
        </Link>
      </motion.div>

      <div className="mb-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-emerald-500 font-bold uppercase mb-4 tracking-widest">
          {post.category || "Market Analysis"}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter leading-tight">
          {post.title}
        </motion.h1>

        {post.bold_headline ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-xl md:text-2xl text-gray-400 font-medium mb-8 leading-relaxed italic border-l-4 border-emerald-500 pl-6"
          >
            {post.bold_headline}
          </motion.p>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/5"
        >
          <div className="flex items-center gap-4">
            { (post.author?.avatar_url || post.author_profile_url) ? (
              <img 
                src={post.author?.avatar_url || post.author_profile_url} 
                alt={post.author?.full_name || post.author_name || "Author"} 
                className="w-12 h-12 rounded-full object-cover border border-white/10" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold">
                {(post.author?.full_name || post.author_name || "A").charAt(0)}
              </div>
            )}
            <div>
              <div className="text-white font-bold text-sm">{post.author?.full_name || post.author_name || "IFXTrades Analyst"}</div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString()}</span>
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

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="mb-12 rounded-3xl overflow-hidden border border-white/10 bg-black aspect-video relative group">
        {post.video_url ? (
          <div className="w-full h-full">
            <iframe 
              src={post.video_url.includes("youtube.com") ? post.video_url.replace("watch?v=", "embed/") : post.video_url}
              className="w-full h-full"
              title="Blog post video material"
              allowFullScreen
            />
          </div>
        ) : (
          <img src={post.image_url || `https://picsum.photos/seed/${post.id}/1280/720`} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="prose prose-invert max-w-none">
            <div className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>

          {post.author_bio ? (
            <div className="mt-16 p-8 rounded-3xl bg-zinc-900 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <User className="text-emerald-500 w-5 h-5" />
                <h3 className="text-white font-bold">About the Author</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{post.author_bio}</p>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Zap className="text-emerald-500 w-5 h-5" />
              Key Insights
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Institutional order flow analysis.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Macroeconomic impact assessment.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Risk management protocols.</span>
              </li>
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
