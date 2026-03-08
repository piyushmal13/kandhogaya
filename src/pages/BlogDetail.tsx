import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Zap } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export const BlogDetail = () => {
  const { pathname } = useLocation();
  const slug = pathname.split("/").pop() as string;
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/content?type=blog`)
      .then(r => r.json())
      .then(posts => {
        if (Array.isArray(posts)) {
          const p = posts.find((x: any) => x.slug === slug);
          setPost(p || null);
        } else {
          console.error("Failed to load posts:", posts);
          setPost(null);
        }
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
        setPost(null);
      });
  }, [slug]);

  if (!post) return <div className="pt-32 text-center text-white">Loading...</div>;

  return (
    <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
      <Link to="/blog" className="text-emerald-500 text-sm font-bold flex items-center gap-2 mb-8 hover:translate-x-[-4px] transition-transform">
        <ArrowUpRight className="rotate-[225deg] w-4 h-4" /> Back to Insights
      </Link>
      <div className="text-[10px] text-emerald-500 font-bold uppercase mb-4 tracking-widest">Market Analysis</div>
      <h1 className="text-5xl font-bold text-white mb-8 tracking-tight leading-tight">{post.title}</h1>
      <div className="flex items-center gap-4 mb-12 pb-12 border-b border-white/10">
        <div className="w-10 h-10 bg-emerald-500 rounded-full" />
        <div>
          <div className="text-white font-bold text-sm">IFXTrades Analyst Team</div>
          <div className="text-xs text-gray-500">{new Date(post.published_at).toLocaleDateString()} • 5 min read</div>
        </div>
      </div>
      <div className="prose prose-invert max-w-none">
        <div className="text-xl text-gray-300 leading-relaxed mb-8">
          <ReactMarkdown>
            {post.body}
          </ReactMarkdown>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 mb-8">
          <h3 className="text-white font-bold mb-4">Key Takeaways</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-start gap-2"><Zap className="text-emerald-500 w-4 h-4 mt-1 flex-shrink-0" /> Monitor XAUUSD support at 2150.</li>
            <li className="flex items-start gap-2"><Zap className="text-emerald-500 w-4 h-4 mt-1 flex-shrink-0" /> Weekly trend remains bullish on H4 timeframe.</li>
            <li className="flex items-start gap-2"><Zap className="text-emerald-500 w-4 h-4 mt-1 flex-shrink-0" /> Macro volatility expected after NFP release.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
