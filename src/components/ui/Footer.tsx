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
      <div className="grid gap-12 lg:grid-cols-4 mb-20 md:mb-32">
        {/* --- Column 1: Brand & Identity --- */}
        <div>
          <Link to="/" className="flex items-center gap-4 group mb-10">
            <div className="flex items-center justify-center transition-all duration-700 h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden group-hover:scale-110 border border-white/10 bg-[#080B12]">
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="h-full w-full object-contain p-1"
              />
            </div>
            <div className="text-[10px] font-black tracking-[0.4em] text-emerald-500/50 uppercase">Institutional DNA</div>
          </Link>
          <p className="text-sm leading-[1.8] text-gray-500 font-medium max-w-xs mb-8">
            The global benchmark for Institutional Market Intelligence and algorithmic execution. Engineered for elite education.
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/[0.05] rounded-full mb-8 hover:bg-white/[0.05] transition-colors cursor-default">
             <div className="flex items-center gap-0.5">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-emerald-400 fill-emerald-400" />)}
             </div>
             <span className="text-[9px] font-black text-white/80 uppercase tracking-widest italic border-l border-white/20 pl-3">
               Rated 4.9/5
             </span>
          </div>
          <div className="flex flex-col gap-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-emerald-500 border border-emerald-500/20 rounded-md p-0.5" /> Est. 2018
             </div>
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-emerald-500 border border-emerald-500/20 rounded-md p-0.5" /> 10k+ Graduates
             </div>
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-emerald-500 border border-emerald-500/20 rounded-md p-0.5" /> Global Infrastructure
             </div>
          </div>
          
          <div className="flex items-center gap-3 mt-10">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 border border-white/5 rounded-xl bg-white/[0.02] text-gray-400 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/10 transition-all">
              <InstagramIcon className="w-[18px] h-[18px]" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 border border-white/5 rounded-xl bg-white/[0.02] text-gray-400 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/10 transition-all">
              <LinkedinIcon className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>

        {/* --- Column 2: Market Operations --- */}
        <div>
          <h4 className="mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-white">Market Operations</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/travel" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">Traders Travel <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
            <li><Link to="/marketplace" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">Execution Algos <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
            <li><Link to="/results" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">System Backtesting <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
            <li><Link to="/login" className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">Terminal Access <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
          </ul>
        </div>

        {/* --- Column 3: Trading Academy --- */}
        <div>
          <h4 className="mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-white">Trading Academy</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/academy" className="hover:text-emerald-400 transition-colors">Forex School</Link></li>
            <li><Link to="/blog" className="hover:text-emerald-400 transition-colors">Macro Intelligence</Link></li>
            <li><Link to="/academy" className="hover:text-emerald-400 transition-colors">Risk Development</Link></li>
            <li><Link to="/webinars" className="hover:text-emerald-400 transition-colors">Live Desk Sessions</Link></li>
          </ul>
        </div>

        {/* --- Column 4: Client Services --- */}
        <div>
          <h4 className="mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-white">Administration</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Corporate Headquarters</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Compliance Control</Link></li>
            <li><Link to="/webinars" className="hover:text-emerald-400 transition-colors">Institutional Media</Link></li>
            <li><Link to="/hiring" className="hover:text-emerald-400 transition-colors">Executive Careers</Link></li>
          </ul>
        </div>
      </div>

      {/* --- Minimalist Footer Base --- */}
      <div className="pt-8 pb-10 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em]">
          &copy; {new Date().getFullYear()} {BRANDING.name} · All rights reserved.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
           <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
           <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
           <Link to="/risk" className="hover:text-red-400 text-red-500/50 transition-colors">Risk Protocol</Link>
           <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>
    </div>
  </footer>
);
