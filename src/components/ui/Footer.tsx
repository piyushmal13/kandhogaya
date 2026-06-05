import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShieldCheck,
  TerminalSquare,
  Globe,
  Building,
  Users
} from "lucide-react";

import { BRANDING } from "../../constants/branding";
import { InstagramIcon, LinkedinIcon } from "./Icons";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/[0.03] pt-24 lg:pt-32 pb-12 bg-[#010203]">
    {/* Deep Void Ambient background */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.03),transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </div>

    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
      
      {/* Master Corporate Grid */}
      <div 
        className="grid gap-16 lg:grid-cols-12 mb-20 md:mb-28"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <meta itemProp="url" content="https://ifxtrades.com" />
        <meta itemProp="logo" content="https://ifxtrades.com/logo.png" />
        
        {/* --- Column 1: Brand Corporate Identity --- */}
        <div className="lg:col-span-4 pr-0 lg:pr-8">
          <Link to="/" className="flex items-center gap-4 group mb-8" aria-label="Go to Home">
            {/* Curved, border-free logo matching precisely */}
            <div className="flex items-center justify-center transition-all duration-700 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden group-hover:scale-105">
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="h-full w-full object-contain rounded-2xl"
                itemProp="image"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-[11px] font-black tracking-[0.45em] text-white uppercase leading-tight">IFX TRADES</div>
            </div>
          </Link>
          <p className="text-xs leading-[1.8] text-[#8A9AAB] font-medium max-w-sm mb-8" itemProp="description">
            The global standard for systematic CFD intelligence, sub-millisecond execution bridges, and quantitative multi-asset allocations. Engineered for sovereign capital and elite institutional desks.
          </p>

          {/* Socials & Compliance badging */}
          <div className="flex items-center gap-2">
            {[
              { Icon: InstagramIcon, url: `https://instagram.com/${BRANDING.name}` },
              { Icon: LinkedinIcon, url: `https://linkedin.com/company/${BRANDING.name}` }
            ].map((social) => (
              <a 
                key={social.url} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 border border-white/[0.04] rounded-xl bg-white/[0.01] text-[#4F5A69] hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:scale-105 transition-all duration-300 shadow-md flex items-center justify-center shrink-0"
                itemProp="sameAs"
                aria-label="Social Link"
              >
                <social.Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* --- Navigation Grid: Expanded for Professional B2B / Partners --- */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* --- Column 1: Core Protocol --- */}
          <div>
            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
              <TerminalSquare className="w-3.5 h-3.5 text-emerald-500/50" /> Core System
            </h4>
            <ul className="space-y-4 text-xs text-[#8A9AAB] font-medium">
              <li><Link to="/marketplace" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">Algorithms <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" /></Link></li>
              <li><Link to="/solutions/custom" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">Custom Strategy <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" /></Link></li>
              <li><Link to="/results" className="hover:text-emerald-400 transition-colors">Verified Audit Logs</Link></li>
              <li><Link to="/webinars" className="hover:text-emerald-400 transition-colors">Desk Sessions</Link></li>
              <li><Link to="/blog" className="hover:text-emerald-400 transition-colors">Intelligence Feed</Link></li>
            </ul>
          </div>

          {/* --- Column 2: B2B Broker Services --- */}
          <div>
            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-emerald-500/50" /> B2B Services
            </h4>
            <ul className="space-y-4 text-xs text-[#8A9AAB] font-medium">
              <li><Link to="/b2b/liquidity" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">Liquidity Integration <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" /></Link></li>
              <li><Link to="/b2b/white-label" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">White Label Partnering <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" /></Link></li>
              <li><Link to="/broker-talent" className="hover:text-emerald-400 transition-colors">Broker Talent Recruitment</Link></li>
            </ul>
          </div>

          {/* --- Column 3: Partner Program --- */}
          <div>
            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-emerald-500/50" /> Partners
            </h4>
            <ul className="space-y-4 text-xs text-[#8A9AAB] font-medium">
              <li><Link to="/affiliate" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">Elite Affiliate Desk <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500" /></Link></li>
            </ul>
          </div>

          {/* --- Column 4: Corporate Hub --- */}
          <div>
            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-500/50" /> About Us
            </h4>
            <ul className="space-y-4 text-xs text-[#8A9AAB] font-medium">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Operations</Link></li>
              <li><Link to="/careers" className="hover:text-emerald-400 transition-colors">Careers (We're Hiring)</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Support Portal</Link></li>
              <li><Link to="/risk" className="hover:text-emerald-400 transition-colors">Risk Protocol</Link></li>
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
           <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
           <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
           <Link to="/risk" className="hover:text-red-400/80 text-red-500/50 transition-colors">Institutional Risk Disclosure</Link>
        </div>
      </div>
    </div>
  </footer>
);
