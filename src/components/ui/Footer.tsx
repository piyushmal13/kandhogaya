import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Mail,
  MessageSquare,
  Shield,
} from "lucide-react";

import { BRANDING } from "../../constants/branding";
import { ResizedImage } from "./ResizedImage";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/5 pt-32 pb-20 bg-[#020202]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)]" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-4">
        <div className="bg-[#050505] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl lg:col-span-1">
          <Link to="/" className="flex items-center gap-5 group mb-8">
            <div className="flex items-center justify-center overflow-hidden rounded-[1.25rem] bg-white/[0.04] p-0 transition-all duration-700 group-hover:bg-white/[0.08] group-hover:scale-105 border border-white/5 group-hover:border-[var(--brand)]/20 shadow-2xl h-12 w-12 sm:h-14 sm:w-14">
              <ResizedImage
                src={BRANDING.logoUrl}
                alt={`${BRANDING.name} Logo`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-bold tracking-[0.4em] text-white uppercase">{BRANDING.name}</div>
              <div className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-medium mt-1">Institutional HFT</div>
            </div>
          </Link>

          <p className="text-sm leading-relaxed text-gray-500 font-sans font-light opacity-80 mb-10">
            {BRANDING.description}
          </p>

          <div className="flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[var(--brand)]" />
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">ISO 27001</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">PCI-DSS</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h4 className="mb-10 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Execution Desk</h4>
          <ul className="space-y-6 text-sm text-gray-400 font-sans font-medium uppercase tracking-[0.1em]">
            <li><Link to="/signals" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between group">Live Intelligence <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></Link></li>
            <li><Link to="/marketplace" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between group">Alchemy Algos <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></Link></li>
            <li><Link to="/results" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between group">Audit History <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></Link></li>
            <li><Link to="/login" className="hover:text-[var(--brand)] transition-colors flex items-center justify-between group">Command Center <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" /></Link></li>
          </ul>
        </div>

        <div className="p-4">
          <h4 className="mb-10 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Company Registry</h4>
          <ul className="space-y-6 text-sm text-gray-400 font-sans font-medium uppercase tracking-[0.1em]">
            <li><Link to="/about" className="hover:text-[var(--brand)] transition-colors">Our Mission</Link></li>
            <li><Link to="/hiring" className="hover:text-[var(--brand)] transition-colors">Career Pathways</Link></li>
            <li><Link to="/blog" className="hover:text-[var(--brand)] transition-colors">Research Unit</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--brand)] transition-colors">Global Support</Link></li>
          </ul>
        </div>

        <div className="bg-[#050505] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--brand)]">Direct Channels</h4>
          <div className="space-y-4">
            <a
              href={BRANDING.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-5 py-4 text-xs text-gray-500 hover:border-[var(--brand)]/30 hover:bg-white/[0.03] transition-all duration-700"
            >
              <span className="inline-flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-[var(--brand)]/80" />
                Institutional WA
              </span>
              <ArrowUpRight className="h-3.5 h-3.5 text-gray-700 group-hover:text-[var(--brand)] transition-colors" />
            </a>
            <a
              href={`mailto:${BRANDING.supportEmail}`}
              className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-5 py-4 text-xs text-gray-500 hover:border-[var(--brand)]/30 hover:bg-white/[0.03] transition-all duration-700"
            >
              <span className="inline-flex items-center gap-3">
                <Mail className="h-4 w-4 text-[var(--brand)]/80" />
                HQ Support
              </span>
              <ArrowUpRight className="h-3.5 h-3.5 text-gray-700 group-hover:text-[var(--brand)] transition-colors" />
            </a>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5">
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
               <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">Operational Readiness Online</span>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-24 flex flex-col gap-8 border-t border-white/5 pt-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 text-[10px] text-gray-600 font-sans font-medium uppercase tracking-[0.2em] lg:flex-row lg:items-center opacity-60">
          <span>&copy; 2026 {BRANDING.name}. &nbsp; Institutional Grade Execution Surface.</span>
        </div>

        <div className="flex flex-wrap gap-8 text-[10px] font-sans font-bold text-gray-500 uppercase tracking-[0.3em]">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/risk" className="hover:text-white transition-colors text-red-500/60">Risk Disclosure</Link>
          <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>

      </div>
    </div>
  </footer>
);
