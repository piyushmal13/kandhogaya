import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Share2, Calendar, Clock, User, Shield, ExternalLink, Globe } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";

import { PageMeta } from "../components/site/PageMeta";
import { WebinarPromoInline } from "../components/webinars/WebinarPromoInline";
import { getBlogPostBySlug } from "../services/apiHandlers";
import { bannerService, Banner } from "../services/bannerService";
import { Blog } from "../types";
import { KeyInsightsCard } from "../components/blog/KeyInsightsCard";
import { BrokerAdBanner } from "../components/blog/BrokerAdBanner";
import { resolveBlogImage } from "../utils/blogUtils";
import { articleSchema, breadcrumbSchema } from "../utils/structuredData";

// DYNAMIC PARTNER BRANDS FOR PAGE-SPECIFIC PROMOTION
const DYNAMIC_PARTNERS: Record<string, {
  name: string;
  logoUrl: string;
  referralUrl: string;
  tagline: string;
  description: string;
}> = {
  "retail-vs-institutional-forex": {
    name: "Binance Institutional",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Binance_Logo.png",
    referralUrl: "https://accounts.binance.com/register?ref=IFXTRADES",
    tagline: "Liquidity Node Partner",
    description: "Access the world's deepest liquidity pools, sovereign OTC desks, and institutional-grade digital asset execution corridors."
  },
  "master-trading-psychology-gym": {
    name: "TradingView Premium",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/TradingView_Logo.svg",
    referralUrl: "https://www.tradingview.com",
    tagline: "Institutional Charting Enclave",
    description: "Map institutional order blocks, visualize advanced volume profiles, and deploy multi-timeframe market indicators with the gold-standard charting console."
  },
  "algorithmic-trading-software-forex": {
    name: "MetaQuotes MT5",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/MetaTrader_5_logo.png",
    referralUrl: "https://www.metatrader5.com",
    tagline: "Execution Bridge Architect",
    description: "Deploy high-performance quantitative algorithms built on optimized C++ and Python cores directly on the world's most stable execution client."
  },
  "decoding-global-macroeconomic-analysis": {
    name: "Bloomberg Professional",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Bloomberg_logo.svg",
    referralUrl: "https://www.bloomberg.com",
    tagline: "Macro Intelligence Sovereign",
    description: "Analyze real-time geopolitical trends, central bank monetary policy updates, sovereign bond curves, and high-frequency news feeds."
  },
  "institutional-order-flow-analysis": {
    name: "Interactive Brokers",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Interactive_Brokers_Logo.svg",
    referralUrl: "https://www.interactivebrokers.com",
    tagline: "Direct Market Access (DMA) Desk",
    description: "Execute trades directly inside deep bank ECN order books, enjoying tight institutional spreads and sub-millisecond execution synchronization."
  },
  "overcome-trading-anxiety": {
    name: "Cortex Performance",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Cognizant_logo_2022.svg",
    referralUrl: "https://www.headspace.com",
    tagline: "Elite Mindset Partner",
    description: "Rewire emotional anxiety, revenge trading impulses, and FOMO using clinically certified behavioral modification and stress-reduction protocols."
  },
  "pro-trading-infrastructure-home": {
    name: "Equinix NY4 Enclave",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/Equinix_logo.svg",
    referralUrl: "https://www.equinix.com",
    tagline: "Low-Latency Infrastructure Node",
    description: "Eliminate network latency by hosting your algorithms inside private server racks co-located adjacent to major tier-1 liquidity matching engines."
  },
  "speculative-to-institutional-consistency": {
    name: "Swissquote Bank",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Swissquote_logo.svg",
    referralUrl: "https://www.swissquote.com",
    tagline: "Swiss Custody & Settlement",
    description: "Experience the ultimate standard of capital preservation, Swiss banking privacy, and multi-asset margin optimization desks."
  },
  "future-fintech-forex-markets": {
    name: "Stripe Connect",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    referralUrl: "https://stripe.com",
    tagline: "API Payment Engine",
    description: "Process lightning-fast cross-border billing and fund custom algorithmic subscription desks through the industry standard transaction API."
  },
  "hedge-fund-risk-management-protocols": {
    name: "Coinbase Prime",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Coinbase_Logo_2019.svg",
    referralUrl: "https://www.coinbase.com/prime",
    tagline: "Capital Protection Vault",
    description: "Protect large quant reserves with offline cold-storage custody, high-volume OTC execution terminals, and audited capital security protocols."
  }
};

export const BlogDetail = () => {
  const { pathname } = useLocation();
  const slug = pathname.split("/").pop() || "";
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [incontentBanner, setIncontentBanner] = useState<Banner | null>(null);
  const [sidebarBanner, setSidebarBanner] = useState<Banner | null>(null);

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

    const fetchBanners = async () => {
      try {
        const incontent = await bannerService.getBanners("blog_incontent");
        if (incontent && incontent.length > 0) setIncontentBanner(incontent[0]);

        const sidebar = await bannerService.getBanners("blog_sidebar");
        if (sidebar && sidebar.length > 0) setSidebarBanner(sidebar[0]);
      } catch (e) {
        console.error("Banner fetch failed", e);
      }
    };

    fetchPost();
    fetchBanners();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 min-h-screen bg-[#010203] text-center text-white">
        <PageMeta title="Market Insight | IFX Trades" description="Loading IFXTrades market insight." path={pathname} />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" 
        />
        <p className="mt-8 text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em]">
          Decrypting Institutional Order Flow...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-40 min-h-screen bg-[#010203] text-center text-white">
        <PageMeta
          title="Insight Not Found"
          description="The requested IFXTrades market insight could not be found."
          path={pathname}
          robots="noindex,follow"
        />
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Signal Lost (404)</h2>
        <Link to="/blog" className="text-blue-500 font-bold hover:underline font-mono text-xs uppercase tracking-widest">Return to Radar</Link>
      </div>
    );
  }

  // Handle rich metadata
  const meta = post.metadata || {};
  const boldHeadline = meta.bold_headline || post.bold_headline;
  const authorName = meta.author_name || post.author?.full_name || post.author_name || "IFX Analyst";
  const authorAvatar = meta.author_profile_url || post.author?.avatar_url || post.author_profile_url;
  const authorBio = meta.author_bio || post.author_bio || "Expert market analyst at IFX Trades Institutional Desk.";
  const videoUrl = meta.video_url || post.video_url;
  const coverImage = resolveBlogImage(post);
  const keyInsights = meta.key_insights || ["Institutional liquidity zones.", "Order block identification.", "Macro-structure alignment."];

  // Resolve dynamic page-specific partner brand
  const activePartner = DYNAMIC_PARTNERS[post.slug] || DYNAMIC_PARTNERS["retail-vs-institutional-forex"];

  // Pick a completely different brand for the sidebar
  const partnerKeys = Object.keys(DYNAMIC_PARTNERS);
  const currentKeyIndex = partnerKeys.indexOf(post.slug);
  const sidebarKey = partnerKeys[currentKeyIndex === -1 ? 1 : (currentKeyIndex + 1) % partnerKeys.length];
  const sidebarPartner = DYNAMIC_PARTNERS[sidebarKey];

  return (
    <div className="bg-[#010203] min-h-screen overflow-hidden selection:bg-blue-500/30 selection:text-white">
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
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 z-[100] origin-left" style={{ scaleX }} />

      {/* Hero Section */}
      <div className="relative pt-40 pb-20 px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.1)_0%,_transparent_60%)]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Link to="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] mb-12 hover:bg-white/10 transition-all hover:translate-x-[-4px] font-mono">
                <ArrowUpRight className="rotate-[225deg] w-3 h-3" /> 
                Institutional Feed
              </Link>
            </motion.div>

            <div className="space-y-6 mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex items-center gap-4 text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] font-mono"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                {post.category || "Research Note"}
              </motion.div>
 
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }} 
                className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1] md:leading-[0.9] lg:max-w-4xl uppercase italic"
              >
                {post.title}
              </motion.h1>
 
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="text-lg md:text-2xl text-cyan-400 font-bold tracking-tight uppercase font-mono"
              >
                {post.metadata?.subtitle || `Institutional Analysis: ${post.category || "Market Insight"}`}
              </motion.p>
 
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-lg md:text-2xl text-gray-400 font-medium leading-relaxed tracking-tight max-w-3xl border-l-4 border-blue-500/50 pl-4 md:pl-8 py-2 font-sans"
              >
                {boldHeadline || `Decrypting institutional order flow and macro capital adjustments for ${post.title}.`}
              </motion.p>
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
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/10" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-blue-400 text-xl font-black font-mono">
                    {authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-white font-black text-xs uppercase tracking-widest">{authorName}</div>
                  <div className="flex items-center gap-4 text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] mt-1.5 font-mono">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-blue-500/50" /> {new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-cyan-500/50" /> {post.category === "Trader Gym" ? "8 Min Drill" : "5 Min Discovery"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-white/10 transition-all text-[10px] font-black uppercase tracking-widest font-mono">
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
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-white text-xs font-black uppercase tracking-widest font-mono">Verified Multi-Asset Coverage</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            {/* Content Container */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="prose-institutional selection:bg-blue-500/30 text-white/80"
            >
              <div 
                dangerouslySetInnerHTML={{ __html: post.body || post.content }} 
                className="max-w-none text-sm leading-relaxed"
              />

              {/* Gallery Block (Related photographs / dynamic analysis charts) */}
              {Array.isArray(meta.additional_images) && meta.additional_images.length > 0 && (
                <div className="mt-16 space-y-6">
                  <h4 className="text-white font-black text-xs uppercase tracking-widest font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Technical Analysis & Telemetry Charts
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {meta.additional_images.map((img: string, idx: number) => (
                      <div key={idx} className="rounded-3xl overflow-hidden border border-white/5 aspect-[16/10] bg-white/[0.02] hover:border-blue-500/20 transition-all duration-300">
                        <img src={img} alt={`Analysis Chart ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>

            {/* In-content Dynamic Broker Ad Banner (Pushed dynamically from Supabase if present) */}
            {incontentBanner ? (
              <BrokerAdBanner 
                name={incontentBanner.title}
                logoUrl={incontentBanner.image_url || activePartner.logoUrl}
                referralUrl={incontentBanner.link_url || activePartner.referralUrl}
                tagline={incontentBanner.metadata?.tagline || activePartner.tagline}
                description={incontentBanner.description || activePartner.description}
              />
            ) : (
              <BrokerAdBanner 
                name={activePartner.name}
                logoUrl={activePartner.logoUrl}
                referralUrl={activePartner.referralUrl}
                tagline={activePartner.tagline}
                description={activePartner.description}
              />
            )}

            {/* Author Bio Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 p-12 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 p-8 opacity-[0.03] pointer-events-none">
                <Globe className="w-40 h-40 text-blue-500" />
              </div>
              
              <div className="w-24 h-24 rounded-3xl bg-zinc-900 flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                {authorAvatar ? (
                  <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-10 h-10 text-blue-500" />
                )}
              </div>
              
              <div className="relative z-10 text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight font-sans">{authorName}</h3>
                  <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest font-mono">
                    Verified Analyst
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xl italic">
                  "{authorBio}"
                </p>
                <div className="flex items-center gap-6 mt-8 justify-center md:justify-start">
                  <button className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors font-mono">
                    <ExternalLink className="w-3.5 h-3.5" /> Institutional Profile
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors font-mono">
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
              
              {/* Dynamic Mapped Sidebar Brand Promo Card (Pushed dynamically from Supabase if present) */}
              <div className="p-[1px] bg-gradient-to-br from-blue-500/20 via-white/5 to-transparent rounded-[40px] border border-white/5">
                <div className="bg-[#080B12]/80 backdrop-blur-xl p-10 rounded-[39px] relative overflow-hidden text-center">
                  <div className="h-10 flex items-center justify-center mb-6">
                    <img 
                      src={sidebarBanner ? (sidebarBanner.image_url || sidebarPartner.logoUrl) : sidebarPartner.logoUrl} 
                      className="h-8 max-w-[120px] object-contain grayscale opacity-60 filter brightness-0 invert" 
                      alt={sidebarBanner ? sidebarBanner.title : sidebarPartner.name} 
                    />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                    {sidebarBanner ? sidebarBanner.title : sidebarPartner.name}
                  </h3>
                  <p className="text-gray-500 text-[10px] leading-relaxed mb-8 uppercase tracking-widest font-mono">
                    {sidebarBanner ? (sidebarBanner.metadata?.tagline || sidebarPartner.tagline) : sidebarPartner.tagline}
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-8 px-2 font-medium">
                    {sidebarBanner ? (sidebarBanner.description || sidebarPartner.description) : sidebarPartner.description}
                  </p>
                  <a 
                    href={sidebarBanner ? (sidebarBanner.link_url || sidebarPartner.referralUrl) : sidebarPartner.referralUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full py-4 bg-blue-500 hover:bg-blue-400 text-black text-center font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl transition-all font-mono"
                  >
                    Launch Node
                  </a>
                </div>
              </div>

              {/* Related Ads or Content */}
              <div className="bg-zinc-900/30 backdrop-blur-md p-10 rounded-[40px] border border-white/5">
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-8 flex items-center gap-3 font-mono">
                  <Shield className="w-4 h-4 text-blue-500" />
                  Transparency Desk
                </h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 animate-ping" />
                     <p className="text-[11px] text-gray-500 font-medium">All analysis is provided for educational purposes and institutional framing.</p>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
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
