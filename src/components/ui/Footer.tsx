import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShieldCheck,
  Star,
  Instagram,
  Linkedin
} from "lucide-react";

import { BRANDING } from "../../constants/branding";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/5 pt-32 bg-[#020202]">
    {/* --- Institutional Backdrop --- */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)]" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      {/* --- Optimized SEO Sitemapping --- */}
      <div className="grid gap-12 lg:grid-cols-4 mb-16">
        {/* --- Column 1: Brand & Identity --- */}
        <div>
          <Link to="/" className="flex items-center gap-6 group mb-10">
            <div className="flex items-center justify-center transition-all duration-700 h-10 w-10 sm:h-14 sm:w-14 rounded-xl overflow-hidden group-hover:scale-105">
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-[14px] font-bold tracking-[0.5em] text-white uppercase opacity-90 group-hover:opacity-100 transition-opacity">{BRANDING.name}</div>
          </Link>
          <p className="text-[12px] leading-relaxed text-gray-500 font-sans font-medium opacity-80 max-w-xs mb-6">
            The global benchmark for **Best Forex Signals**, **Gold Trading Algorithms**, and Institutional Market Intelligence. Engineered for elite education & execution.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
             <div className="flex items-center gap-1">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />)}
             </div>
             <span className="text-[9px] font-black text-white uppercase tracking-widest italic border-l border-white/20 pl-2">
               Rated 4.9/5 by 10k+ Traders
             </span>
          </div>
          <div className="flex flex-col gap-2 text-[10px] font-bold text-emerald-500/80 uppercase tracking-[0.2em]">
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4" /> Est. 2018
             </div>
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4" /> 10k+ Graduates
             </div>
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4" /> Dubai HQ & Greater Noida Roots
             </div>
          </div>
          
          <div className="flex items-center gap-4 mt-8">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-[var(--brand)]/10 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-[var(--brand)]/10 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* --- Column 2: Market Operations (SEO Optimized) --- */}
        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Market Operations</h4>
          <ul className="space-y-4 text-[11px] text-gray-400 font-sans font-bold uppercase tracking-[0.2em]">
            <li><Link to="/signals" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between group">Best Gold Signals <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            <li><Link to="/marketplace" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between group">Custom Trading Bots <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            <li><Link to="/results" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between group">Strategy Backtesting <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            <li><Link to="/login" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between group">Trading Education <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
          </ul>
        </div>

        {/* --- Column 3: Trading Academy (New SEO Column) --- */}
        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Trading Academy</h4>
          <ul className="space-y-4 text-[11px] text-gray-400 font-sans font-bold uppercase tracking-[0.2em]">
            <li><Link to="/academy" className="hover:text-[var(--brand)] transition-colors">Forex School</Link></li>
            <li><Link to="/blog" className="hover:text-[var(--brand)] transition-colors">Market Analysis</Link></li>
            <li><Link to="/academy" className="hover:text-[var(--brand)] transition-colors">Risk Management</Link></li>
            <li><Link to="/webinars" className="hover:text-[var(--brand)] transition-colors">Live Trading Sessions</Link></li>
          </ul>
        </div>

        {/* --- Column 4: Client Services --- */}
        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Services</h4>
          <ul className="space-y-4 text-[11px] text-gray-400 font-sans font-bold uppercase tracking-[0.2em]">
            <li><Link to="/about" className="hover:text-[var(--brand)] transition-colors">Our Mission</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--brand)] transition-colors">Compliance Desk</Link></li>
            <li><Link to="/hiring" className="hover:text-[var(--brand)] transition-colors">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--brand)] transition-colors">Global Support</Link></li>
          </ul>
        </div>
      </div>

      {/* --- Minimalist Footer Base --- */}
      <div className="pt-12 pb-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} {BRANDING.name}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] opacity-60">
           <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
           <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
           <Link to="/risk" className="hover:text-white transition-colors text-red-500/40">Risk Disclosure</Link>
           <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>
    </div>
    
    {/* Phase 2: Natively embedded red compliance banner */}
    <div className="w-full bg-[#991b1b] text-white text-center p-3 text-sm font-medium">
      <strong>CRITICAL NOTICE:</strong> IFX Trades is education & research only. We license algos, deliver courses, signals & macro analysis.
      <strong> We are NOT a broker</strong> – no deposits, no client funds. Trading involves risk.
    </div>
  </footer>
);
