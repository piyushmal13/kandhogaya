import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Zap, Share2, Calendar, Clock, User, Shield, ExternalLink, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, useScroll, useSpring } from "motion/react";

import { PageMeta } from "../components/site/PageMeta";
import { WebinarPromoInline } from "../components/webinars/WebinarPromoInline";
import { getBlogPostBySlug } from "../services/apiHandlers";
import { Blog } from "../types";
import { KeyInsightsCard } from "../components/blog/KeyInsightsCard";
import { BrokerAdBanner } from "../components/blog/BrokerAdBanner";
import { resolveBlogImage } from "../utils/blogUtils";
import { articleSchema, breadcrumbSchema } from "../utils/structuredData";

export const BlogDetail = () => {
  const { pathname } = useLocation();
  const slug = pathname.split("/").pop();
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await getBlogPostBySlug(slug);
        setPost(data);
      } catch (err) {
        console.error("Fetch blog detail failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 min-h-screen bg-[#020202] text-center text-white">
        <PageMeta title="Market Insight | IFX Trades" description="Loading IFXTrades market insight." path={pathname} />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" 
        />
        <p className="mt-8 text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em]">
          Decrypting Institutional Order Flow...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-40 min-h-screen bg-[#020202] text-center text-white">
        <PageMeta
          title="Insight Not Found"
          description="The requested IFXTrades market insight could not be found."
          path={pathname}
          robots="noindex,follow"
        />
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Signal Lost (404)</h2>
        <Link to="/blog" className="text-emerald-500 font-bold hover:underline">Return to Radar</Link>
      </div>
    );
  }

  // Handle rich metadata (with fallbacks to legacy fields)
  const meta = post.metadata || {};
  const boldHeadline = meta.bold_headline || post.bold_headline;
  const authorName = meta.author_name || post.author?.full_name || post.author_name || "IFX Analyst";
  const authorAvatar = meta.author_profile_url || post.author?.avatar_url || post.author_profile_url;
  const authorBio = meta.author_bio || post.author_bio || "Expert market analyst at IFX Trades Institutional Desk.";
  const videoUrl = meta.video_url || post.video_url;
  const coverImage = resolveBlogImage(post);
  const keyInsights = meta.key_insights || ["Institutional liquidity zones.", "Order block identification.", "Macro-structure alignment."];

  return (
    <div className="bg-[#020202] min-h-screen overflow-hidden selection:bg-emerald-500 selection:text-black">
      <PageMeta
        title={`${post.title} | Market Insight`}
        description={boldHeadline || (post.content || "").slice(0, 160)}
        path={pathname}
        type="article"
        keywords={["market insight", post.category || "market analysis", "forex research"]}
        structuredData={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/blog" },
            { name: post.title, path: pathname },
          ])
        ]}
      />

      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 z-[100] origin-left" style={{ scaleX }} />

      {/* Hero Section */}
      <div className="relative pt-40 pb-20 px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#10b98133_0%,_transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Link to="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-12 hover:bg-white/10 transition-all hover:translate-x-[-4px]">
                <ArrowUpRight className="rotate-[225deg] w-3 h-3" /> 
                Institutional Feed
              </Link>
            </motion.div>

            <div className="space-y-6 mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex items-center gap-4 text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em]"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {post.category || "Research Note"}
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }} 
                className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] lg:max-w-4xl"
              >
                {post.title}
              </motion.h1>

              {boldHeadline && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-2xl md:text-3xl text-gray-400 font-medium leading-tight tracking-tight max-w-3xl border-l-4 border-emerald-500/50 pl-8 py-2"
                >
                  {boldHeadline}
                </motion.p>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-between gap-10 py-8 border-y border-white/5"
            >
              <div className="flex items-center gap-5">
                {authorAvatar ? (
                  <img 
                    src={authorAvatar} 
                    alt={authorName} 
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/10" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-emerald-500 text-xl font-black">
                    {authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-white font-black text-xs uppercase tracking-widest">{authorName}</div>
                  <div className="flex items-center gap-4 text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] mt-1.5">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-emerald-500/50" /> {new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-emerald-500/50" /> 5 Min Discovery</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-white/10 transition-all text-[10px] font-black uppercase tracking-widest">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </motion.div>
          </div>

          <aside className="lg:col-span-4 hidden lg:block">
            <KeyInsightsCard insights={keyInsights} />
          </aside>
        </div>
      </div>

      {/* Media Block */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.3 }} 
          className="rounded-[40px] overflow-hidden border border-white/10 bg-black aspect-video relative group shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
          {videoUrl ? (
            <div className="w-full h-full">
              <iframe 
                src={videoUrl.includes("youtube.com") ? videoUrl.replace("watch?v=", "embed/") : videoUrl}
                className="w-full h-full"
                title="Institutional Analysis Media"
                allowFullScreen
              />
            </div>
          ) : (
            <img 
              src={coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[2s]" 
              referrerPolicy="no-referrer" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span className="text-white text-xs font-black uppercase tracking-widest">Verified Multi-Asset Coverage</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            {/* Content Container */}
            <div className="prose prose-invert prose-p:text-gray-300 prose-p:text-lg prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-h2:text-3xl prose-h3:text-xl prose-span:text-emerald-400 max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* In-content Broker Ad */}
            {meta.broker_ad ? (
              <BrokerAdBanner 
                name={meta.broker_ad.name}
                logoUrl={meta.broker_ad.logo_url}
                referralUrl={meta.broker_ad.referral_url}
                tagline={meta.broker_ad.tagline}
                description={meta.broker_ad.description}
              />
            ) : (
              <BrokerAdBanner 
                name="Binance Institutional" 
                logoUrl="https://upload.wikimedia.org/wikipedia/commons/4/4c/Binance_Logo.png" 
                referralUrl="https://accounts.binance.com/register?ref=IFXTRADES"
                tagline="Institutional Liquidity Partner"
                description="Leverage the world's deepest liquidity pools and institutional trading workflows."
              />
            )}

            {/* Author Bio Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 p-12 rounded-[40px] bg-white/5 border border-white/5 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 p-8 opacity-[0.03] pointer-events-none">
                <Globe className="w-40 h-40 text-emerald-500" />
              </div>
              
              <div className="w-24 h-24 rounded-3xl bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                {authorAvatar ? (
                  <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-10 h-10 text-emerald-500" />
                )}
              </div>
              
              <div className="relative z-10 text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{authorName}</h3>
                  <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest">
                    Verified Analyst
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xl italic">
                  "{authorBio}"
                </p>
                <div className="flex items-center gap-6 mt-8 justify-center md:justify-start">
                  <button className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Institutional Profile
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                     View All Research
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <div className="lg:hidden">
              <KeyInsightsCard insights={keyInsights} />
            </div>

            <div className="sticky top-24 space-y-12">
              {/* Telegram Promo */}
              <div className="p-[1px] bg-gradient-to-br from-emerald-500/20 via-white/5 to-transparent rounded-[40px] border border-white/5">
                <div className="bg-[#050505] p-10 rounded-[39px] relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                      <Zap className="w-20 h-20 text-emerald-500" />
                   </div>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                      Live Pulse <br/><span className="text-emerald-500 text-lg">Signal Channel</span>
                   </h3>
                   <p className="text-gray-500 text-xs leading-relaxed mb-8">
                      Institutional trade flow and macro adjustments delivered instantly to your device.
                   </p>
                   <a 
                     href="https://t.me/ifxtrades" 
                     target="_blank" 
                     className="block w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-center font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl transition-all"
                   >
                      Enter Signal Intelligence
                   </a>
                </div>
              </div>

              {/* Related Ads or Content */}
              <div className="bg-zinc-900/30 p-10 rounded-[40px] border border-white/5">
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-8 flex items-center gap-3">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Transparency Desk
                </h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                     <p className="text-[11px] text-gray-500 font-medium">All analysis is provided for educational purposes and institutional framing.</p>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                     <p className="text-[11px] text-gray-500 font-medium">Verified data sources include MT4, TradingView, and BloomBerg Terminal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Promo */}
      <div className="bg-white/5 pt-32 pb-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <WebinarPromoInline />
        </div>
      </div>
    </div>
  );
};

