import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Mail,
  MessageSquare,
  Shield,
  Globe,
  Database,
  Cpu,
} from "lucide-react";

import { BRANDING } from "../../constants/branding";
import { ResizedImage } from "./ResizedImage";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/5 pt-32 pb-12 bg-[#020202]">
    {/* --- Institutional Backdrop --- */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)]" />
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      {/* --- Core Infrastructure Grid --- */}
      <div className="grid gap-16 lg:grid-cols-5 mb-24">
        {/* --- Column 1: Brand --- */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-5 group mb-10">
            <div className="flex items-center justify-center overflow-hidden rounded-[1.25rem] bg-white/[0.04] p-0 transition-all duration-700 group-hover:bg-white/[0.08] group-hover:scale-105 border border-white/5 group-hover:border-emerald-500/20 shadow-2xl h-12 w-12">
              <ResizedImage
                src={BRANDING.logoUrl}
                alt={`${BRANDING.name} Logo`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-bold tracking-[0.5em] text-white uppercase">{BRANDING.name}</div>
              <div className="text-[9px] text-emerald-500/60 uppercase tracking-[0.4em] font-medium mt-1">Quantitative Global Registry</div>
            </div>
          </Link>

          <p className="text-[13px] leading-relaxed text-gray-500 font-sans font-light opacity-80 mb-12 max-w-md">
            {BRANDING.description}. Engineered for the highest levels of execution efficiency and institutional data integrity.
          </p>

          <div className="grid grid-cols-2 gap-8 mb-12">
             <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
               <Shield className="w-4 h-4 text-emerald-500" />
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-white tracking-widest uppercase">SSL SECURE</span>
                 <span className="text-[8px] text-gray-600 font-medium">AES-256 BANK GRADE</span>
               </div>
             </div>
             <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
               <Activity className="w-4 h-4 text-emerald-500" />
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-white tracking-widest uppercase">ISO 27001</span>
                 <span className="text-[8px] text-gray-600 font-medium">AUDITED INFRASTRUCTURE</span>
               </div>
             </div>
          </div>
        </div>

        {/* --- Column 2: Markets --- */}
        <div>
          <h4 className="mb-10 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Market Ops</h4>
          <ul className="space-y-6 text-[12px] text-gray-400 font-sans font-medium uppercase tracking-[0.15em]">
            <li><Link to="/signals" className="hover:text-emerald-500 transition-colors flex items-center justify-between group">Live Intelligence <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            <li><Link to="/marketplace" className="hover:text-emerald-500 transition-colors flex items-center justify-between group">Alchemy Algos <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            <li><Link to="/results" className="hover:text-emerald-500 transition-colors flex items-center justify-between group">Transparency Hub <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            <li><Link to="/login" className="hover:text-emerald-500 transition-colors flex items-center justify-between group">Client Portal <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
          </ul>
        </div>

        {/* --- Column 3: Enterprise --- */}
        <div>
          <h4 className="mb-10 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Enterprise</h4>
          <ul className="space-y-6 text-[12px] text-gray-400 font-sans font-medium uppercase tracking-[0.15em]">
            <li><Link to="/about" className="hover:text-emerald-500 transition-colors">Our Mission</Link></li>
            <li><Link to="/hiring" className="hover:text-emerald-500 transition-colors">Careers</Link></li>
            <li><Link to="/blog" className="hover:text-emerald-500 transition-colors">Research Unit</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-500 transition-colors">Compliance HQ</Link></li>
          </ul>
        </div>

        {/* --- Column 4: Infrastructure Status --- */}
        <div>
          <h4 className="mb-10 text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500/60">Global Status</h4>
          <div className="space-y-6">
            {[
              { city: "London", latency: "0.12ms", status: "Active" },
              { city: "New York", latency: "0.08ms", status: "Active" },
              { city: "Tokyo", latency: "0.31ms", status: "Operational" },
            ].map((node) => (
              <div key={node.city} className="flex items-center justify-between group">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white tracking-widest">{node.city}</span>
                  <span className="text-[8px] text-gray-600 font-medium uppercase tracking-widest">{node.latency} Latency</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[8px] font-bold text-emerald-500/40 uppercase tracking-widest">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Secondary Branding --- */}
      <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <Database className="w-4 h-4 text-gray-700" />
             <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em]">Audit Vault 2026</span>
          </div>
          <div className="flex items-center gap-3">
             <Cpu className="w-4 h-4 text-gray-700" />
             <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em]">HFT Engine: V4.2</span>
          </div>
          <div className="flex items-center gap-3">
             <Globe className="w-4 h-4 text-gray-700" />
             <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em]">Global Node Grid</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] opacity-60">
           <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
           <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
           <Link to="/risk" className="hover:text-white transition-colors text-red-500/40">Risk Disclosure</Link>
           <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
           <span className="text-gray-800">&copy; 2026 {BRANDING.name} Systems AG</span>
        </div>
      </div>
    </div>
  </footer>
);
