import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShieldCheck,
  Star,
  Activity,
  TerminalSquare
} from "lucide-react";

import { BRANDING } from "../../constants/branding";
import { InstagramIcon, LinkedinIcon } from "./Icons";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/[0.03] pt-32 lg:pt-48 pb-12 bg-[#010203]">
    {/* Deep Void Ambient background */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.03),transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </div>

    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
      {/* --- Master Terminal SEO Sitemapping --- */}
      <div 
        className="grid gap-16 lg:grid-cols-12 mb-24 md:mb-32"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <meta itemProp="url" content="https://ifxtrades.com" />
        <meta itemProp="logo" content="https://ifxtrades.com/logo.png" />
        
        {/* --- Column 1: Brand & Identity (Spans more columns) --- */}
        <div className="lg:col-span-5 pr-0 lg:pr-12">
          <Link to="/" className="flex items-center gap-4 group mb-10" aria-label="Go to Home">
            <div className="flex items-center justify-center transition-all duration-700 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden group-hover:scale-105 border border-white/5 bg-[#030406] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="h-full w-full object-contain p-1.5"
                itemProp="image"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-[10px] font-black tracking-[0.4em] text-white uppercase leading-tight mb-1">IFX TRADES</div>
            </div>
          </Link>
          <p className="text-[13px] leading-[2] text-[#8A9AAB] font-light max-w-sm mb-10" itemProp="description">
            The global benchmark for systematic CFD intelligence and algorithmic forex execution. Engineered for elite capital scaling across the world's primary financial hubs.
          </p>

          <div 
            className="inline-flex items-center gap-3 px-4 py-2 bg-[#050505] border border-white/10 rounded-xl mb-10 hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all cursor-default shadow-[0_0_20px_rgba(16,185,129,0.05)]"
            itemProp="aggregateRating"
            itemScope
            itemType="https://schema.org/AggregateRating"
          >
             <meta itemProp="ratingValue" content="4.9" />
             <meta itemProp="reviewCount" content="12400" />
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-[#58F2B6]" />
               <span className="text-[9px] font-black text-white uppercase tracking-widest">Institutional Grade</span>
             </div>
             <span className="text-[8px] font-black text-[#58F2B6] uppercase tracking-[0.2em] border-l border-white/20 pl-3 py-0.5">
               Verified Alpha
             </span>
          </div>

          <div className="flex flex-col gap-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-12">
             <div className="flex items-center gap-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
               <Activity className="w-3.5 h-3.5 text-emerald-500/80" />
               <span>Global Presence: <span className="text-white/80 font-black">Institutional Network</span></span>
             </div>
             <div className="flex items-center gap-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
               <TerminalSquare className="w-3.5 h-3.5 text-emerald-500/80" />
               <span>Operational Hubs: <span className="text-white/80 font-black">Multi-Asset Execution</span></span>
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
                className="p-2 border border-white/10 rounded-lg bg-white/5 text-gray-400 hover:text-[#58F2B6] hover:border-[#58F2B6]/30 hover:bg-[#58F2B6]/10 transition-all duration-300"
                itemProp="sameAs"
                aria-label="Social Link"
              >
                <social.Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* --- Navigation Columns --- */}
        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
          {/* --- Column 2: Master Terminal --- */}
          <div>
            <h4 className="mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
              <TerminalSquare className="w-3.5 h-3.5 text-emerald-500/50" /> Protocol
            </h4>
            <ul className="space-y-5 text-[13px] text-[#8A9AAB] font-light">
              <li><Link to="/marketplace" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">Execution Desk <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" /></Link></li>
              <li><Link to="/results" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">Audit Logs <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" /></Link></li>
            </ul>
          </div>

          {/* --- Column 3: Quantitative Edge --- */}
          <div>
            <h4 className="mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-white">Knowledge</h4>
            <ul className="space-y-5 text-[13px] text-[#8A9AAB] font-light">
              <li><Link to="/academy" className="hover:text-emerald-400 transition-colors">Quant Curriculum</Link></li>
              <li><Link to="/blog" className="hover:text-emerald-400 transition-colors">Macro Intelligence</Link></li>
              <li><Link to="/webinars" className="hover:text-emerald-400 transition-colors">Desk Sessions</Link></li>
            </ul>
          </div>

          {/* --- Column 4: Infrastructure --- */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-white">Infrastructure</h4>
            <ul className="space-y-5 text-[13px] text-[#8A9AAB] font-light">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Operations</Link></li>
              <li><Link to="/hiring" className="hover:text-emerald-400 transition-colors">Desk Recruiting</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Support Portal</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- Minimalist Master Base --- */}
      <div className="pt-8 pb-4 border-t border-white/[0.04] flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-[9px] font-black text-[#4F5A69] uppercase tracking-[0.3em] text-center lg:text-left">
          &copy; {new Date().getFullYear()} {BRANDING.name}.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-[9px] font-black text-[#4F5A69] uppercase tracking-[0.25em]">
           <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
           <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
           <Link to="/risk" className="hover:text-red-400/80 text-red-500/50 transition-colors">Risk Protocol</Link>
        </div>
      </div>
    </div>
  </footer>
);
