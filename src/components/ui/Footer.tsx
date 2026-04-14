import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShieldCheck,
  Star,
} from "lucide-react";

import { BRANDING } from "../../constants/branding";
import { InstagramIcon, LinkedinIcon } from "./Icons";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/[0.04] pt-32 bg-[#020202]">
    {/* Ambient bg */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(16,185,129,0.025),transparent)]" />
    </div>

    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      {/* --- Optimized SEO Sitemapping --- */}
      <div 
        className="grid gap-12 lg:grid-cols-4 mb-20 md:mb-32"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <meta itemProp="url" content="https://ifxtrades.com" />
        <meta itemProp="logo" content="https://ifxtrades.com/logo.png" />
        
        {/* --- Column 1: Brand & Identity --- */}
        <div>
          <Link to="/" className="flex items-center gap-4 group mb-10" aria-label="Go to Home">
            <div className="flex items-center justify-center transition-all duration-700 h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden group-hover:scale-110 border border-white/10 bg-[#080B12]">
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="h-full w-full object-contain p-1"
                itemProp="image"
              />
            </div>
            <div className="text-[10px] font-black tracking-[0.4em] text-emerald-500/50 uppercase">Institutional DNA</div>
          </Link>
          <p className="text-sm leading-[1.8] text-gray-500 font-medium max-w-xs mb-8" itemProp="description">
            The global benchmark for Institutional Market Intelligence and algorithmic execution. Engineered for elite education in Dubai, India, and globally.
          </p>

          <div 
            className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/[0.05] rounded-full mb-8 hover:bg-white/[0.05] transition-colors cursor-default"
            itemProp="aggregateRating"
            itemScope
            itemType="https://schema.org/AggregateRating"
          >
             <meta itemProp="ratingValue" content="4.9" />
             <meta itemProp="reviewCount" content="12400" />
             <div className="flex items-center gap-0.5">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-emerald-400 fill-emerald-400" aria-hidden="true" />)}
             </div>
             <span className="text-[9px] font-black text-white/80 uppercase tracking-widest italic border-l border-white/20 pl-3">
               Rated 4.9/5
             </span>
          </div>

          <div className="flex flex-col gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-10">
             <div className="flex items-start gap-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
               <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
               <span className="leading-relaxed">Dubai Desk: <span className="text-white/60" itemProp="addressLocality">Bussiness Bay</span>, <span itemProp="addressCountry">UAE</span></span>
             </div>
             <div className="flex items-start gap-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
               <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
               <span className="leading-relaxed">India Desk: <span className="text-white/60" itemProp="addressLocality">Greater Noida</span>, <span itemProp="addressRegion">UP</span></span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            {[
              { Icon: InstagramIcon, url: `https://instagram.com/${BRANDING.name}` },
              { Icon: LinkedinIcon, url: `https://linkedin.com/company/${BRANDING.name}` }
            ].map((social) => (
              <a 
                key={social.url} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 border border-white/5 rounded-xl bg-white/[0.02] text-gray-400 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/10 transition-all"
                itemProp="sameAs"
              >
                <social.Icon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {/* --- Column 2: Market Operations --- */}
        <div>
          <h4 className="mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-white">Market Operations</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/travel" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">Traders Travel <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
            <li><Link to="/marketplace" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">Execution Algos <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
            <li><Link to="/results" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">System Backtesting <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
          </ul>
        </div>

        {/* --- Column 3: Trading Academy --- */}
        <div>
          <h4 className="mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-white">Trading Academy</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/academy" className="hover:text-emerald-400 transition-colors">Forex School</Link></li>
            <li><Link to="/blog" className="hover:text-emerald-400 transition-colors">Macro Intelligence</Link></li>
            <li><Link to="/webinars" className="hover:text-emerald-400 transition-colors">Live Desk Sessions</Link></li>
          </ul>
        </div>

        {/* --- Column 4: Client Services --- */}
        <div>
          <h4 className="mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-white">Administration</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Corporate Headquarters</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Compliance Control</Link></li>
            <li><Link to="/hiring" className="hover:text-emerald-400 transition-colors">Executive Careers</Link></li>
          </ul>
        </div>
      </div>

      {/* --- Minimalist Footer Base --- */}
      <div className="pt-8 pb-10 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em]">
          &copy; {new Date().getFullYear()} {BRANDING.name} · Institutional Grid · v2.4
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
           <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
           <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
           <Link to="/risk" className="hover:text-red-400 text-red-500/50 transition-colors">Risk Protocol</Link>
        </div>
      </div>
    </div>
  </footer>
);
