import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
} from "lucide-react";

import { BRANDING } from "../../constants/branding";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/5 pt-32 pb-12 bg-[#020202]">
    {/* --- Institutional Backdrop --- */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)]" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      {/* --- Optimized SEO Sitemapping --- */}
      <div className="grid gap-12 lg:grid-cols-4 mb-24">
        {/* --- Column 1: Brand & Identity --- */}
        <div>
          <Link to="/" className="flex items-center gap-6 group mb-10">
            <div className="flex items-center justify-center overflow-hidden rounded-xl bg-white p-2.5 transition-all duration-700 h-14 w-14 border-2 border-[var(--brand)]/10 group-hover:border-[var(--brand)]/30 group-hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-[14px] font-bold tracking-[0.5em] text-white uppercase opacity-90 group-hover:opacity-100 transition-opacity">{BRANDING.name}</div>
          </Link>
          <p className="text-[12px] leading-relaxed text-gray-500 font-sans font-medium opacity-80 max-w-xs">
            The global benchmark for **Best Forex Signals**, **Gold Trading Algorithms**, and Institutional Market Intelligence. Engineered for elite execution.
          </p>
        </div>

        {/* --- Column 2: Market Operations (SEO Optimized) --- */}
        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Market Operations</h4>
          <ul className="space-y-4 text-[11px] text-gray-400 font-sans font-bold uppercase tracking-[0.2em]">
            <li><Link to="/signals" className="hover:text-emerald-500 transition-colors flex items-center justify-between group">Best Gold Signals <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            <li><Link to="/marketplace" className="hover:text-emerald-500 transition-colors flex items-center justify-between group">Custom Trading Bots <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            <li><Link to="/results" className="hover:text-emerald-500 transition-colors flex items-center justify-between group">Strategy Backtesting <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            <li><Link to="/login" className="hover:text-emerald-500 transition-colors flex items-center justify-between group">HFT Dashboard <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
          </ul>
        </div>

        {/* --- Column 3: Trading Academy (New SEO Column) --- */}
        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Trading Academy</h4>
          <ul className="space-y-4 text-[11px] text-gray-400 font-sans font-bold uppercase tracking-[0.2em]">
            <li><Link to="/academy" className="hover:text-emerald-500 transition-colors">Forex School</Link></li>
            <li><Link to="/blog" className="hover:text-emerald-500 transition-colors">Market Analysis</Link></li>
            <li><Link to="/academy" className="hover:text-emerald-500 transition-colors">Risk Management</Link></li>
            <li><Link to="/webinars" className="hover:text-emerald-500 transition-colors">Live Trading Sessions</Link></li>
          </ul>
        </div>

        {/* --- Column 4: Client Services --- */}
        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Services</h4>
          <ul className="space-y-4 text-[11px] text-gray-400 font-sans font-bold uppercase tracking-[0.2em]">
            <li><Link to="/about" className="hover:text-emerald-500 transition-colors">Our Mission</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-500 transition-colors">Compliance Desk</Link></li>
            <li><Link to="/hiring" className="hover:text-emerald-500 transition-colors">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-500 transition-colors">Global Support</Link></li>
          </ul>
        </div>
      </div>

      {/* --- Minimalist Footer Base --- */}
      <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
          &copy; 2026 {BRANDING.name} SYSTEMS AG
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] opacity-60">
           <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
           <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
           <Link to="/risk" className="hover:text-white transition-colors text-red-500/40">Risk Disclosure</Link>
           <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>
    </div>
  </footer>
);
